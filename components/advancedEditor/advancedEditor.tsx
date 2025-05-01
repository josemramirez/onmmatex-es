"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FaGithub } from "react-icons/fa";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Cargando editor...</p>,
});

type ChatProps = {
  id: string;
  initialMessages: string;
  setTotalTokens: (value: string | null) => void;
  setTotalTotalTokens: (value: string | null) => void;
  setNameChat: (value: string | null) => void;
  setTotalSaldo: (value: string | null) => void;
  typeShort: string;
  fileName: string;
};

export function AdvancedEditorPage({
  id,
  initialMessages,
  setTotalTokens,
  setTotalTotalTokens,
  setNameChat,
  setTotalSaldo,
  typeShort,
  fileName
}: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>(initialMessages);
  const [documentTitle, setDocumentTitle] = useState<string>("Documento sin título");
  const [lastModified, setLastModified] = useState("");
  const [saving, setSaving] = useState(false);
  const [splitPosition, setSplitPosition] = useState(80);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const splitRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  // Cargar el contenido inicial y mostrar PDF al montar
  useEffect(() => {
    setLastModified(new Date().toLocaleString());
    loadInitialPDF();
  }, []);

  const handleUploadToGitHub = async (content: string) => {
    const response = await fetch("/api/upload-to-github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId, fileName }),
    });

    const result = await response.json();

    if (result.exists) {
      const confirmOverwrite = window.confirm(result.message);
      if (confirmOverwrite) {
        const contentL = content
        .replace(/°/g, "\\textdegree ")
        .replace(/(?<!\\)&/g, "\\& ")
        .replace(/\\textit/g, "\\textbf ");

        const overwriteResponse = await fetch("/api/upload-to-github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentL,
            userId,
            fileName,
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
      }
      return { success: false, error: "Cancelado por el usuario" };
    }
    toast(
      result.success ? "Archivo subido correctamente." : "Error al subir el archivo.",
      { type: result.success ? "success" : "error" }
    );
    return result;
  };

  const generatePDF = async (content: string) => {
    const contentL = content
      .replace(/°/g, "\\textdegree ")
      .replace(/&/g, "\\& ")
      .replace(/\\textit/g, "\\textbf ");

    try {
      const response = await fetch("/api/generate-pdf-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentL,
          isOptionOne: true,
          userId,
          typeShort,
          fileName
        }),
      });

      if (!response.ok) throw new Error("Error al generar la URL del PDF");

      const { latexUrl } = await response.json();
      const pdfContainer = document.getElementById("pdf-container2");

      if (pdfContainer) {
        pdfContainer.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <div class="spinner"></div>
            <p>Espere, su PDF ya está siendo procesado</p>
          </div>
        `;

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

        setTimeout(() => {
          pdfContainer.innerHTML = `
            <div>
              <object data="${latexUrl}" type="application/pdf" width="103%" height="550px">
                <p style="margin: 20px 0; text-align: center;">¡Por favor: Compilar -> Subir -> Actualizar <a href="${latexUrl}">PDF</a></p>
              </object>
            </div>
          `;
        }, 1000);
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      const pdfContainer = document.getElementById("pdf-container2");
      if (pdfContainer) {
        pdfContainer.innerHTML = `<p style="margin: 20px 0; text-align: center;">Error al procesar el PDF: ${error.message}</p>`;
      }
    }
  };

  // Cargar PDF inicial
  const loadInitialPDF = () => {
    generatePDF(initialMessages);
  };

  // Guardar cambios y actualizar todo
  const handleSaveDocument = async () => {
    if (!userId) {
      toast.error("Debes iniciar sesión para guardar el documento.");
      return;
    }

    try {
      setSaving(true);
      
      // Subir a GitHub solo cuando se guarda
      if (typeShort !== "short") {
        await handleUploadToGitHub(content);
      }
      
      // Generar PDF actualizado
      await generatePDF(content);

      // Guardar en la base de datos
      const response = await fetch("/api/latex-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameChat: documentTitle,
          content,
          tokensUsed: 0,
          userId,
          typeShort,
          fileName
        }),
      });

      if (!response.ok) throw new Error("Error al guardar la entrada");

      toast.success("Documento guardado correctamente.");
      setLastModified(new Date().toLocaleString());
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo guardar el documento.");
    } finally {
      setSaving(false);
    }
  };

  // Manejo del divisor
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current && splitRef.current) {
      const containerRect = splitRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSplitPosition(Math.max(0, Math.min(100, newPosition)));
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold text-white bg-emerald-500 rounded-md">
        v1.0
      </span>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>[mmatex] Editor Avanzado</h1>
      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Título del documento"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={splitRef}
            style={{
              display: "flex",
              position: "relative",
              height: "550px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: splitPosition === 100 ? "100%" : `${splitPosition}%`,
                display: splitPosition === 0 ? "none" : "block",
                overflow: "hidden",
              }}
            >
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="hc-black"
                value={content}
                onChange={(value) => setContent(value || "")}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  fontSize: 24,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  validate: false,
                  renderValidationDecorations: "off",
                  fontFamily: 'JetBrains Mono, monospace',
                  wordWrap: 'on',
                  padding: { top: 30 }
                }}
              />
            </div>
            <div
              onMouseDown={handleMouseDown}
              style={{
                width: "5px",
                background: "#ccc",
                cursor: "col-resize",
                position: "absolute",
                left: `${splitPosition}%`,
                top: 0,
                bottom: 0,
                display: splitPosition === 0 || splitPosition === 100 ? "none" : "block",
              }}
            />
            <div
              style={{
                width: splitPosition === 0 ? "100%" : `${100 - splitPosition}%`,
                display: splitPosition === 100 ? "none" : "block",
                overflow: "hidden",
              }}
            >
              <div id="pdf-container2" style={{ height: "100%" }} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Última modificación: {lastModified || "Cargando..."}
          </div>
          <Button onClick={handleSaveDocument} disabled={saving}>
            <FaGithub className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}