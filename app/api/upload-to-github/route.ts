import { NextRequest, NextResponse } from "next/server";

async function checkDirectoryExists({
  owner,
  repo,
  path,
  authToken,
}: {
  owner: string;
  repo: string;
  path: string;
  authToken: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (response.status === 200) return { exists: true };
    if (response.status === 404) return { exists: false };
    throw new Error("Error al verificar el directorio");
  } catch (error) {
    console.error("Error checking directory:", error);
    return { exists: false, error: (error as Error).message };
  }
}

async function checkFileExists({
  owner,
  repo,
  pathGit,
  authToken,
}: {
  owner: string;
  repo: string;
  pathGit: string;
  authToken: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${pathGit}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      return { exists: true, sha: data.sha };
    }
    if (response.status === 404) return { exists: false };
    throw new Error("Error al verificar el archivo");
  } catch (error) {
    console.error("Error checking file:", error);
    return { exists: false, error: (error as Error).message };
  }
}

async function uploadFileToGitHub({
  fileElement,
  owner,
  repo,
  pathGit,
  message,
  authToken,
  sha,
}: {
  fileElement: string; // Ahora es Base64 para todos los casos
  owner: string;
  repo: string;
  pathGit: string;
  message: string;
  authToken: string;
  sha?: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${pathGit}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message,
          content: fileElement, // Ya está en Base64
          sha: sha || undefined,
        }),
      }
    );
    if (response.ok) return { success: true };
    throw new Error("Error al subir el archivo");
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: (error as Error).message };
  }
}

async function getSourceFiles({
  owner,
  repo,
  path,
  authToken,
}: {
  owner: string;
  repo: string;
  path: string;
  authToken: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/josemramirez/mmatex/contents/${path}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!response.ok) throw new Error("Error al obtener los archivos fuente");
    const files = await response.json();
    return files
      .filter((file: any) => file.name.endsWith(".png")) // Solo archivos .png
      .map((file: any) => ({
        name: file.name,
        download_url: file.download_url,
      }));
  } catch (error) {
    console.error("Error fetching source files:", error);
    return [];
  }
}

async function copyFilesToBkgs({
  owner,
  repo,
  userId,
  authToken,
}: {
  owner: string;
  repo: string;
  userId: string;
  authToken: string;
}) {
  const sourceFiles = await getSourceFiles({
    owner: "josemramirez",
    repo: "mmatex",
    path: "pdf_examples/bkgs",
    authToken,
  });

  for (const file of sourceFiles) {
    try {
      // Descargar el archivo como datos binarios
      const fileResponse = await fetch(file.download_url);
      if (!fileResponse.ok) {
        console.error(`Error downloading file ${file.name}: ${fileResponse.status}`);
        continue;
      }
      const fileBuffer = await fileResponse.arrayBuffer();
      // Convertir a Base64
      const fileContentBase64 = Buffer.from(fileBuffer).toString("base64");

      // Verificar si el archivo ya existe en el destino
      const fileCheck = await checkFileExists({
        owner,
        repo,
        pathGit: `${userId}/bkgs/${file.name}`,
        authToken,
      });

      // Subir el archivo al directorio bkgs
      const uploadResult = await uploadFileToGitHub({
        fileElement: fileContentBase64,
        owner,
        repo,
        pathGit: `${userId}/bkgs/${file.name}`,
        message: `Añadir archivo ${file.name} al directorio bkgs`,
        authToken,
        sha: fileCheck.exists ? fileCheck.sha : undefined, // Soporte para sobrescritura
      });

      if (!uploadResult.success) {
        console.error(`Error uploading file ${file.name}:`, uploadResult.error);
      } else {
        console.log(`Successfully uploaded ${file.name} to ${userId}/bkgs/`);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  const { content, userId, fileName } = await request.json();

  if (!content || !userId || !fileName) {
    return NextResponse.json(
      { error: "Faltan parámetros: content, userId o fileName" },
      { status: 400 }
    );
  }

  const credentialsGitHub = {
    owner: process.env.MMATEX_GITS_OWNER!,
    repo: process.env.MMATEX_GITS_REPO_v1!,
    path: `${userId}/${fileName}`,
    authToken: process.env.MMATEX_GITS_TOKEN!,
  };

  const [directory] = credentialsGitHub.path.split("/");
  const dirCheck = await checkDirectoryExists({
    owner: credentialsGitHub.owner,
    repo: credentialsGitHub.repo,
    path: directory,
    authToken: credentialsGitHub.authToken,
  });

  if (!dirCheck.exists) {
    console.log(`El directorio ${directory} no existe, se creará al subir el archivo.`);
    await copyFilesToBkgs({
      owner: credentialsGitHub.owner,
      repo: credentialsGitHub.repo,
      userId,
      authToken: credentialsGitHub.authToken,
    });
  } else {
    const bkgsCheck = await checkDirectoryExists({
      owner: credentialsGitHub.owner,
      repo: credentialsGitHub.repo,
      path: `${userId}/bkgs`,
      authToken: credentialsGitHub.authToken,
    });
    if (!bkgsCheck.exists) {
      await copyFilesToBkgs({
        owner: credentialsGitHub.owner,
        repo: credentialsGitHub.repo,
        userId,
        authToken: credentialsGitHub.authToken,
      });
    }
  }

  const fileCheck = await checkFileExists({
    owner: credentialsGitHub.owner,
    repo: credentialsGitHub.repo,
    pathGit: credentialsGitHub.path,
    authToken: credentialsGitHub.authToken,
  });

  if (fileCheck.exists && fileCheck.sha) {
    return NextResponse.json({
      exists: true,
      sha: fileCheck.sha,
      message: "El archivo ya existe. ¿Deseas sobrescribirlo?",
    });
  }

  // Subir el archivo principal (mantiene la funcionalidad original)
  const contentBase64 = Buffer.from(content).toString("base64");
  const result = await uploadFileToGitHub({
    fileElement: contentBase64,
    owner: credentialsGitHub.owner,
    repo: credentialsGitHub.repo,
    pathGit: credentialsGitHub.path,
    message: `Subiendo archivo: ${fileName}`,
    authToken: credentialsGitHub.authToken,
  });

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const { content, userId, fileName, sha } = await request.json();

  const credentialsGitHub = {
    owner: process.env.MMATEX_GITS_OWNER!,
    repo: process.env.MMATEX_GITS_REPO_v1!,
    path: `${userId}/${fileName}`,
    authToken: process.env.MMATEX_GITS_TOKEN!,
  };

  const contentBase64 = Buffer.from(content).toString("base64");
  const result = await uploadFileToGitHub({
    fileElement: contentBase64,
    owner: credentialsGitHub.owner,
    repo: credentialsGitHub.repo,
    pathGit: credentialsGitHub.path,
    message: "Actualizando archivo",
    authToken: credentialsGitHub.authToken,
    sha,
  });

  return NextResponse.json(result);
}