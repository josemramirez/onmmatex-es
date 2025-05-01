import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface CompileTxtButtonProps {
  reportText: string;
  totalTokens1: string;
  nameChat1: string;
  isOptionOne: boolean;
  typeShort: string;
  fileNameGit: string;
}

const CompileTxtButton2: React.FC<CompileTxtButtonProps> = ({
  reportText,
  totalTokens1,
  nameChat1,
  isOptionOne,
  typeShort,
  fileNameGit,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [content, setContent] = useState(reportText ?? "");
  const [shouldUpdatePDF, setShouldUpdatePDF] = useState(false);

  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        setShouldUpdatePDF(true);
      }, 2000); // Espera 2 segundos después del último cambio

      return () => clearTimeout(timer);
    }
  }, [content]);

  useEffect(() => {
    if (shouldUpdatePDF) {
      updatePDF();
      setShouldUpdatePDF(false);
    }
  }, [shouldUpdatePDF]);

  const handleUploadToGitHub = async (content: string) => {
    const response = await fetch("/api/upload-to-github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId, fileName: fileNameGit }),
    });

    const result = await response.json();

    if (result.exists) {
      const confirmOverwrite = window.confirm(result.message);
      if (confirmOverwrite) {
        const overwriteResponse = await fetch("/api/upload-to-github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            userId,
            fileName: fileNameGit,
            sha: result.sha,
          }),
        });
        const overwriteResult = await overwriteResponse.json();
        toast(
          overwriteResult.success
            ? "Archivo actualizado correctamente."
            : "Error al actualizar el archivo.",
          { type: overwriteResult.success ? "success" : "error" }
        );
        return overwriteResult;
      } else {
        toast("Operación cancelada.");
        return { success: false, error: "Cancelado por el usuario" };
      }
    } else {
      toast(
        result.success ? "Archivo subido correctamente." : "Error al subir el archivo.",
        { type: result.success ? "success" : "error" }
      );
      return result;
    }
  };

  const updatePDF = async () => {
    const contentL = content
      .replace(/°/g, "\\textdegree ")
      .replace(/&/g, "\\& ")
      .replace(/\\textit/g, "\\textbf ");

    try {
      // Si no es un short y es la primera vez (isOptionOne === false), subimos a GitHub
      if (typeShort !== "short" && isOptionOne === false) {
        await handleUploadToGitHub(contentL);
      }

      // Generar la URL del PDF usando la API Route
      const response = await fetch("/api/generate-pdf-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentL,
          isOptionOne: isOptionOne, // Si es short, usamos la opción de texto directo
          userId,
          typeShort: typeShort,
          fileName: fileNameGit
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la URL del PDF");
      }

      const { latexUrl } = await response.json();
      const pdfContainer = document.getElementById("pdf-container2");

      if (pdfContainer) {
        // Paso 1: Mostrar el spinner
        pdfContainer.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <div class="spinner"></div>
            <p>Espere, su PDF ya está siendo procesado</p>
          </div>
        `;

        // Paso 2: Agregar el estilo del spinner
        const style = document.createElement("style");
        style.innerHTML = `
          .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin: 0 auto 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);

        // Paso 3: Insertar el PDF después de un retraso
        setTimeout(() => {
          pdfContainer.innerHTML = `
            <div>
              <object data="${latexUrl}" type="application/pdf" width="103%" height="550px">
              <div style="text-align: center;">
                <p style="margin: 10px 0; color: #d32f2f; font-size: 16px; font-weight: bold;">Error al compilar, revisar por favor</p>
                  <iframe src="${latexUrl}" width="100%" height="500px" style="border: 2px solid #d32f2f;">
                  <p style="margin: 20px 0; text-align: center;">Tu navegador no soporta iframes. Por favor, <a href="${latexUrl}" target="_blank">abre este enlace</a> para ver el mensaje de error.</p>
                </iframe>
              </div>
              </object>
            </div>
          `;
        }, 1000); // Retraso de 1 segundo
      }
    } catch (error) {
      console.error("Error en updatePDF:", error);
      const pdfContainer = document.getElementById("pdf-container2");
      if (pdfContainer) {
        pdfContainer.innerHTML = `
          <p style="margin: 20px 0; text-align: center;">Error al procesar el PDF: ${error.message}</p>
        `;
      }
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="container py-0 space-y-0">
      <div id="pdf-container2" className="w-full"></div>
    </div>
  );
};

export default CompileTxtButton2;