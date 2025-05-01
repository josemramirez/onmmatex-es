// lib/fileExistGitHub.ts
'use client';

interface CheckFileParams {
  owner: string;
  repo: string;
  pathGit: string;
  authToken: string;
}

interface CheckFileResponse {
  exists: boolean;
  sha?: string; // Agregamos el sha como opcional
  error: string | null;
}

export async function checkFileExists({
  owner,
  repo,
  pathGit,
  authToken,
}: CheckFileParams): Promise<CheckFileResponse> {
  try {
    // Construir la URL del API endpoint
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${pathGit}`;
    console.log("URL being requested:", url); // Para depuración, como el Print en Mathematica

    // Configurar los headers para la solicitud
    const headers = {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Hacer la solicitud HTTP GET
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    // Verificar el estado de la respuesta
    if (response.status === 200) {
      const data = await response.json(); // Obtener los datos de la respuesta
      return {
        exists: true,
        sha: data.sha, // Agregamos el sha del archivo existente
        error: null,
      };
    } else if (response.status === 404) {
      return {
        exists: false,
        error: null,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    return {
      exists: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}