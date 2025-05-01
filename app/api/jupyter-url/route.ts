import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body to get userId
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 });
    }

    // Obtain tokens from environment variables
    const jupyterToken = process.env.JUPYTER_TOKEN;
    const githubToken = process.env.MMATEX_GITS_TOKEN;

    if (!jupyterToken) {
      return NextResponse.json({ error: 'Token de Jupyter no configurado' }, { status: 500 });
    }

    if (!githubToken) {
      return NextResponse.json({ error: 'Token de GitHub no configurado' }, { status: 500 });
    }

    // Define the host where the container is running (Railway URL)
    // Construct the Jupyter URL with userId and githubToken as query parameters
    const jupyterUrl = `https://tu_servicio.tu_dominio.com/?token=${jupyterToken}&userId=${userId}`;

    // Devuelve la URL y el githubToken
    return NextResponse.json({
      url: jupyterUrl,
      githubToken: githubToken,
    });

  } catch (error) {
    console.error('Error en el endpoint POST:', error);
    return NextResponse.json({ error: `Error al generar la URL: ${error.message}` }, { status: 500 });
  }
}