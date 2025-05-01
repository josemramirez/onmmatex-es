"use client";

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Skeleton } from "@/components/ui/skeleton";

interface MonacoLatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: string; // Tema recibido desde el padre
}

export function MonacoLatexEditor({ value, onChange, theme }: MonacoLatexEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [loading, setLoading] = useState(true);

  // Tema estático para LaTeX
  const latexTheme = {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "keyword", foreground: "#569CD6" }, // Comandos LaTeX (azul)
      { token: "type", foreground: "#4EC9B0" }, // Entornos (turquesa)
      { token: "comment", foreground: "#6A9955" }, // Comentarios (verde)
      { token: "string", foreground: "#CE9178" }, // Matemáticas (naranja)
      { token: "delimiter.curly", foreground: "#D4D4D4" }, // Llaves
      { token: "delimiter.square", foreground: "#D4D4D4" }, // Corchetes
      { token: "delimiter.parenthesis", foreground: "#D4D4D4" }, // Paréntesis
    ],
    colors: {
      "editor.background": "#1E1E1E",
      "editor.foreground": "#D4D4D4",
      "editor.lineHighlightBackground": "#2D2D2D",
    },
  };

  // Registrar el lenguaje LaTeX (solo una vez)
  useEffect(() => {
    const isLatexRegistered = monaco.languages.getLanguages().some((lang) => lang.id === "latex");
    if (!isLatexRegistered) {
      monaco.languages.register({ id: "latex" });
      monaco.languages.setMonarchTokensProvider("latex", {
        tokenizer: {
          root: [
            [/\\[a-zA-Z]+/, "keyword"],
            [/\\begin\{([^}]*)\}/, "type"],
            [/\\end\{([^}]*)\}/, "type"],
            [/%.*$/, "comment"],
            [/\$\$/, "string"],
            [/\$/, "string"],
            [/\{/, "delimiter.curly"],
            [/\}/, "delimiter.curly"],
            [/\[/, "delimiter.square"],
            [/\]/, "delimiter.square"],
            [/\(/, "delimiter.parenthesis"],
            [/\)/, "delimiter.parenthesis"],
          ],
        },
      });
    }

    // Definir el tema
    monaco.editor.defineTheme("latex-theme", latexTheme);
  }, []);

  // Inicializar y actualizar el editor
  useEffect(() => {
    if (editorRef.current && !editor) {
      const newEditor = monaco.editor.create(editorRef.current, {
        value,
        language: "latex",
        theme: "latex-theme", // Usamos un solo tema por ahora
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        renderLineHighlight: "all",
        renderWhitespace: "none",
        tabSize: 2,
      });

      newEditor.onDidChangeModelContent(() => {
        onChange(newEditor.getValue());
      });

      setEditor(newEditor);
      setLoading(false);
    }

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [editorRef, editor, onChange]);

  // Sincronizar el valor cuando cambia desde el padre
  useEffect(() => {
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [editor, value]);

  if (loading) {
    return <Skeleton className="h-full w-full" />;
  }

  return <div ref={editorRef} className="h-full w-full" />;
}