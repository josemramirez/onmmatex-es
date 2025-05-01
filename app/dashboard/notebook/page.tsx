'use client';

import NoteBook from './embeNB';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function NoteBookEmbeded() {
  const [notebookUrl, setNotebookUrl] = useState('');
  const [githubToken, setGithubToken] = useState(''); // Nuevo estado para githubToken
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const iframeRef = useRef<HTMLIFrameElement>(null); // Especificar el tipo aquí
  const [isIframeReady, setIsIframeReady] = useState(false);


  useEffect(() => {
    const fetchNotebookUrl = async () => {
      try {
        setIsLoading(true);
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }

        console.log('Solicitando /api/jupyter-url con userId:', userId);
        const response = await fetch('/api/jupyter-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        console.log('Respuesta recibida:', response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data.url) {
          setNotebookUrl(data.url);
          setGithubToken(data.githubToken); // Almacenar githubToken
        } else {
          setError(data.error || 'URL no proporcionada');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotebookUrl();

    const handleMessage = (event) => {
      if (event.data.type === 'extensionReady' && iframeRef.current) {
        console.log('Extensión lista, enviando parámetros...');
        iframeRef.current.contentWindow?.postMessage(
          {
            type: 'setParams',
            userId: userId,
            githubToken: 'tu_token',
          },
          'https://tu_servicio.tu_dominio.com' // Ajusta según la URL de tu iframe
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [userId]);

  return (
    <div>
      <main className="text-5xl md:text-6xl font-bold">
        <h1 className="relative inline-block">
          <span className="inline bg-gradient-to-r from-[#f3e824] to-[#D247BF] text-transparent bg-clip-text">[on]MMaTeX</span>: Tu
        </h1>
        <span className="ml-2">Plataforma</span>
        <span className="ml-2">Inteligente</span>
        <span className="inline bg-gradient-to-r from-[#5eef6d] via-[#03a3d7] to-[#1048c1] text-transparent bg-clip-text">de Investigación</span>
      </main>

      <h1>Notebook</h1>

      <div style={{ marginBottom: '0px' }}>
        {isLoading ? (
          <p>Cargando JupyterLab, por favor espera...</p>
        ) : error ? (
          <div>
            <p>No se pudo cargar JupyterLab: {error}</p>
            <button onClick={() => fetchNotebookUrl()}>
              Reintentar
            </button>
          </div>
        ) : notebookUrl ? (
          <NoteBook notebookUrl={notebookUrl} iframeRef={iframeRef} />
        ) : (
          <p>No se pudo cargar JupyterLab.</p>
        )}
      </div>
    </div>
  );
}