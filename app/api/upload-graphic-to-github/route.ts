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
    return { exists: false, error: error.message };
  }
}

async function createDirectory({
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
    // Subimos un archivo .gitkeep para crear el directorio
    const gitkeepPath = `${path}/.gitkeep`;
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${gitkeepPath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Creando directorio ${path}`,
          content: Buffer.from("").toString("base64"), // Archivo vacío
        }),
      }
    );
    if (response.ok) return { success: true };
    throw new Error("Error al crear el directorio");
  } catch (error) {
    console.error("Error creating directory:", error);
    return { success: false, error: error.message };
  }
}

async function checkFileExists({
  owner,
  repo,
  path,
  authToken,
  userId,
}: {
  owner: string;
  repo: string;
  path: string;
  authToken: string;
  userId: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${userId}/${path}`,
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
    return { exists: false, error: error.message };
  }
}

async function uploadGraphic({
  base64Image,
  owner,
  repo,
  path,
  message,
  authToken,
  sha,
  userId,
}: {
  base64Image: string;
  owner: string;
  repo: string;
  path: string;
  message: string;
  authToken: string;
  sha?: string;
  userId: string;
}) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${userId}/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${authToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: base64Image,
          sha: sha || undefined,
        }),
      }
    );
    if (response.ok) return { success: true };
    throw new Error("Error al subir el gráfico");
  } catch (error) {
    console.error("Error uploading graphic:", error);
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  const { base64Image, path, userId } = await request.json();

  if (!base64Image || !path || !userId) {
    return NextResponse.json(
      { error: "Faltan parámetros: base64Image, path o userId" },
      { status: 400 }
    );
  }

  const owner = process.env.MMATEX_GITS_OWNER!;
  const repo = process.env.MMATEX_GITS_REPO_v1!;
  const authToken = process.env.MMATEX_GITS_TOKEN!;

  // Verificar y crear el directorio images/ dentro de userId/
  const directoryPath = `${userId}/images`;
  const dirCheck = await checkDirectoryExists({ owner, repo, path: directoryPath, authToken });

  if (!dirCheck.exists) {
    const createResult = await createDirectory({ owner, repo, path: directoryPath, authToken });
    if (!createResult.success) {
      return NextResponse.json(
        { error: "No se pudo crear el directorio images/" },
        { status: 500 }
      );
    }
    console.log(`Directorio ${directoryPath} creado exitosamente.`);
  }

  const fileCheck = await checkFileExists({ owner, repo, path, authToken, userId });

  if (fileCheck.exists && fileCheck.sha) {
    return NextResponse.json({
      exists: true,
      sha: fileCheck.sha,
      message: "El archivo ya existe. ¿Deseas sobrescribirlo?",
    });
  }

  const result = await uploadGraphic({
    base64Image,
    owner,
    repo,
    path,
    message: `Subiendo nuevo gráfico: ${path}`,
    authToken,
    userId,
  });

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const { base64Image, path, sha, userId } = await request.json();

  if (!base64Image || !path || !sha || !userId) {
    return NextResponse.json(
      { error: "Faltan parámetros: base64Image, path, sha o userId" },
      { status: 400 }
    );
  }

  const owner = process.env.MMATEX_GITS_OWNER!;
  const repo = process.env.MMATEX_GITS_REPO_v1!;
  const authToken = process.env.MMATEX_GITS_TOKEN!;

  // No necesitamos verificar/crear el directorio aquí porque ya existe si estamos sobrescribiendo
  const result = await uploadGraphic({
    base64Image,
    owner,
    repo,
    path,
    message: "Actualizando gráfico",
    authToken,
    sha,
    userId,
  });

  return NextResponse.json(result);
}