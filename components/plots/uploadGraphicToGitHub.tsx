'use client';

import html2canvas from 'html2canvas';

interface UploadParams {
  graphicElement: HTMLElement;
  owner: string;
  repo: string;
  pathGit: string;
  message: string;
  authToken: string;
  sha?: string;  // Propiedad opcional
}

interface UploadResponse {
  success: boolean;
  error: string | null;
}

export async function uploadGraphicToGitHub({
  graphicElement,
  owner,
  repo,
  pathGit,
  message,
  authToken,
  sha,  // Se incluye solo si está definido
}: UploadParams): Promise<UploadResponse> {
  try {
    // Paso 1: Convertir el gráfico a PNG en base64
    const canvas = await html2canvas(graphicElement);
    const base64Image = canvas.toDataURL('image/png').split(',')[1]; // Extraer solo la parte base64

    // Paso 2: Construir la URL de la API de GitHub
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${pathGit}`;
    console.log('URL being requested:', url); // Para depuración

    // Paso 3: Configurar los headers
    const headers = {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    // Paso 4: Crear el cuerpo de la solicitud
    const body = JSON.stringify({
      message,
      content: base64Image,
      sha,  // Se incluye solo si está definido
    });

    // Paso 5: Hacer la solicitud PUT a la API de GitHub
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return {
      success: true,
      error: null
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}