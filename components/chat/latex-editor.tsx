"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui2/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Code, Eye, Search, Replace, ReplaceAll, IndentIncrease } from "lucide-react";
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { FaGithub } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { editor } from 'monaco-editor';

// Asumo que tienes un componente Accordion, si no, lo definimos más abajo
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LaTeXEditorTxtProps {
  reportText: string;
  totalTokens: string;
  nameChat: string;
  isOptionOne: boolean;
  typeShort: string;
  fileNameGit: string;
}

const LaTeXEditorTxt: React.FC<LaTeXEditorTxtProps> = ({
  reportText,
  isOptionOne,
  typeShort,
  fileNameGit
}) => {
  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const [content, setContent] = useState(reportText ?? "");
  const [lines, setLines] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const saveChatEntryNotify = () => toast("¡Éxito! ¡Documento guardado correctamente!");
  const noSaveChatEntryNotify = () => toast("¡Algo salió mal! Por favor, inténtalo de nuevo.");
  const [fileNameGitL, setFileNameGitL] = useState(fileNameGit);
  const [activeTab, setActiveTab] = useState("editor");

  // Estado para las figuras
  const [insertButtonText, setInsertButtonText] = useState("Insertar Figuras");
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [imageFiles, setImageFiles] = useState<
    { name: string; checked: boolean; line: string }[]
  >([]);

  // Nuevo estado para el acordeón de fondos
  const [backgroundImages, setBackgroundImages] = useState<
    { name: string; url: string }[]
  >([]);

  // Cargar imágenes del repositorio al montar el componente
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/josemramirez/mmatex/contents/pdf_examples/bkgs"
        );
        if (!response.ok) throw new Error("Error al obtener imágenes");
        const files = await response.json();
        const pngFiles = files
          .filter((file: any) => file.name.endsWith(".png"))
          .map((file: any) => ({
            name: file.name,
            url: file.download_url,
          }));
        setBackgroundImages(pngFiles);
      } catch (error) {
        console.error("Error fetching background images:", error);
        toast("Error al cargar imágenes de fondo.", { type: "error" });
      }
    };
    fetchBackgroundImages();
  }, []);

  function generateUniqueFileName(baseName: string, extension: string) {
    const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${baseName}-${timestamp}-${randomStr}${extension}`;
  }

  const handleUpdatePDF = () => {
    const newFileName = generateUniqueFileName("onmmatex-es-v1", ".tex");
    setFileNameGitL(newFileName);
    updatePDF();
  };

  const contentL = content
    .replace(/°/g, "\\textdegree ")
    .replace(/(?<!\\)&/g, "\\& ")
    .replace(/\\textit/g, "\\textbf ");

  const handleUploadToGitHub = async (content: string) => {
    const response = await fetch("/api/upload-to-github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: contentL,
        userId,
        fileName: fileNameGitL
      }),
    });

    const result = await response.json();

    if (result.exists) {
      const confirmOverwrite = window.confirm(result.message);
      if (confirmOverwrite) {
        const overwriteResponse = await fetch("/api/upload-to-github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentL,
            userId,
            fileName: fileNameGitL,
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
      } else {
        toast("Operación cancelada.");
      }
    } else {
      toast(
        result.success ? "Archivo subido correctamente." : "Error al subir el archivo.",
        { type: result.success ? "success" : "error" }
      );
    }
  };

  const handleSearch = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      if (model) {
        const matches = model.findMatches('d', true, false, false, null, true);
        if (matches.length > 0) {
          const range = matches[0].range;
          editor.setSelection(range);
          editor.revealRangeInCenter(range);
        }
      }
      editor.getAction('actions.find').run();
    }
  };

  useEffect(() => {
    setContent(reportText);
  }, [reportText]);

  useEffect(() => {
    setLines(content.split("\n"));
  }, [content]);

  const handleScroll = () => {
    if (editorContainerRef.current) {
      setScrollPosition(editorContainerRef.current.scrollTop);
    } else if (previewContainerRef.current) {
      setScrollPosition(previewContainerRef.current.scrollTop);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "editor" && previewContainerRef.current) {
      setScrollPosition(previewContainerRef.current.scrollTop);
    } else if (value === "preview" && editorContainerRef.current) {
      setScrollPosition(editorContainerRef.current.scrollTop);
    }
    setTimeout(() => {
      if (value === "editor" && editorContainerRef.current) {
        editorContainerRef.current.scrollTop = scrollPosition;
        if (textareaRef.current) {
          const selStart = textareaRef.current.selectionStart;
          const selEnd = textareaRef.current.selectionEnd;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(selStart, selEnd);
        }
      } else if (value === "preview" && previewContainerRef.current) {
        previewContainerRef.current.scrollTop = scrollPosition;
      }
    }, 10);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleEditorChange = () => {
    const newValue = editorRef.current?.getValue();
    if (newValue !== undefined) {
      setContent(newValue);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "document.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };





  const updatePDF = async () => {

    let latexUrl = ""; // Declarar latexUrl fuera del try con un valor inicial

    try {
      const response = await fetch("/api/generate-pdf-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          isOptionOne,
          userId,
          typeShort,
          fileName: fileNameGitL,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la URL del PDF");
      }

      //const { latexUrl } = await response.json();
      const data = await response.json();
      latexUrl = data.latexUrl || ""; // Asignar el valor a latexUrl

      const pdfContainer = document.getElementById("pdf-container2");
      if (pdfContainer) {
        pdfContainer.innerHTML = `<div>
          <object data="${latexUrl}" type="application/pdf" width="105%" height="550px">
              <div style="text-align: center;">
                <p style="margin: 10px 0; color: #d32f2f; font-size: 16px; font-weight: bold;">Error al compilar, revisar por favor</p>
                  <iframe src="${latexUrl}" width="100%" height="500px" style="border: 2px solid #d32f2f;">
                  <p style="margin: 20px 0; text-align: center;">Tu navegador no soporta iframes. Por favor, <a href="${latexUrl}" target="_blank">abre este enlace</a> para ver el mensaje de error.</p>
                </iframe>
              </div>
          </object>
        </div>`;
      }
    } catch (error) {
      console.error("Error final:", error);
      const pdfContainer = document.getElementById("pdf-container2");
      if (pdfContainer) {
        pdfContainer.innerHTML = `<div style="text-align: center;">
                <p style="margin: 10px 0; color: #d32f2f; font-size: 16px; font-weight: bold;">Error al compilar, revisar por favor</p>
                  <iframe src="${latexUrl}" width="100%" height="500px" style="border: 2px solid #d32f2f;">
                  <p style="margin: 20px 0; text-align: center;">Tu navegador no soporta iframes. Por favor, <a href="${latexUrl}" target="_blank">abre este enlace</a> para ver el mensaje de error.</p>
                </iframe>
              </div>`;
      }
    }
  };






  const saveChatEntry = async () => {
    function generarStringAleatorio() {
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let resultado = '';
      for (let i = 0; i < 15; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      return resultado;
    }

// Después
function extraerPrimerosQuinceCaracteresConFecha(contenido) {
  const regexPrimeraSeccion = /\\section\{([^}]*)\}/;
  const match = contenido.match(regexPrimeraSeccion);
  if (!match) {
    return "NoSection-v-[NoDate]";
  }
  const finComando = match.index + match[0].length;
  const inicioSiguienteSeccion = contenido.indexOf("\\section", finComando);
  const finDocumento = contenido.indexOf("\\end{document}", finComando);
  let finSeccion;
  if (inicioSiguienteSeccion === -1 || finDocumento < inicioSiguienteSeccion) {
    finSeccion = finDocumento;
  } else {
    finSeccion = inicioSiguienteSeccion;
  }
  const contenidoSeccion = contenido.substring(finComando, finSeccion).trim();
  const primerosQuince = contenidoSeccion.substring(0, 10).replace(/[^a-zA-Z0-9\s]/g, "");
  const ahora = new Date();
  const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mes = meses[ahora.getMonth()];
  const dia = ahora.getDate();
  const horas24 = ahora.getHours();
  const ampm = horas24 >= 12 ? "pm" : "am";
  const horas12 = horas24 % 12 === 0 ? 12 : horas24 % 12;
  const minutos = ahora.getMinutes().toString().padStart(2, "0");
  const nombreConFecha = `${primerosQuince}-v-[${mes}${dia}/${horas12}${ampm}/${minutos}]`;
  return nombreConFecha;
}

const tokensUsed = Number("234");
const nameChat = extraerPrimerosQuinceCaracteresConFecha(content);

    try {
      const response = await fetch('/api/save-chatentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nameChat,
          content,
          tokensUsed,
          userId,
          typeShort,
          "fileName": fileNameGitL
        })
      });
      if (!response.ok) {
        throw new Error('Error al guardar la entrada');
      }
      const data = await response.json();
      console.log(data.message);
      saveChatEntryNotify();
    } catch (error) {
      console.error('Error:', error);
      noSaveChatEntryNotify();
    }
  };

  const fetchImages = async () => {
    const mockImages = [
      "imagen2.png",
      "imagen3.png",
      "imagen4.png",
    ];
    return mockImages.map((name) => ({
      name,
      checked: false,
      line: "",
    }));
  };

  const handleInsertFiguresClick = async () => {
    if (insertButtonText === "Insertar Figuras") {
      try {
        const images = await fetchImages();
        setImageFiles(images);
        setShowImageMenu(true);
        setInsertButtonText("Proceder");
      } catch (error) {
        toast("Error al cargar imágenes.", { type: "error" });
      }
    } else {
      const newContent = insertFigures();
      if (newContent) {
        setContent(newContent);
        setShowImageMenu(false);
        setInsertButtonText("Insertar Figuras");
        setImageFiles([]);
        toast("Figuras insertadas correctamente.", { type: "success" });
      }
    }
  };

  const handleImageSelection = (index: number, field: "checked" | "line", value: boolean | string) => {
    setImageFiles((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    );
  };

  const insertFigures = () => {
    let contentLines = content.split("\n");
    if (!content.includes("\\usepackage{graphicx}")) {
      const documentClassIndex = contentLines.findIndex((line) =>
        line.includes("\\documentclass")
      );
      if (documentClassIndex !== -1) {
        contentLines.splice(documentClassIndex + 1, 0, "\\usepackage{graphicx}");
      }
    }
    const insertions: { line: number; code: string }[] = [];
    let valid = true;

    imageFiles.forEach((img) => {
      if (img.checked && img.line) {
        const lineNum = parseInt(img.line, 10);
        if (isNaN(lineNum) || lineNum < 1 || lineNum > contentLines.length + 1) {
          toast(`Número de línea inválido para ${img.name}.`, { type: "error" });
          valid = false;
          return;
        }
        const figureCode = [
          "",
          "%% --- Inclusión de una figura --------------",
          "\\begin{figure}[h]",
          `  \\includegraphics[width=\\textwidth]{images/${img.name}}`,
          `  \\caption{Descripción de ${img.name}}`,
          "  \\label{fig:" + img.name.replace(/\.[^/.]+$/, "") + "}",
          "\\end{figure}",
          "%% ------------------------------------------",
          "",
        ].join("\n");
        insertions.push({ line: lineNum - 1, code: figureCode });
      }
    });

    if (!valid) return null;
    insertions.sort((a, b) => b.line - a.line);
    insertions.forEach(({ line, code }) => {
      contentLines.splice(line, 0, code);
    });
    return contentLines.join("\n");
  };

  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [backgrounds, setBackgrounds] = useState<
    { name: string; checked: boolean }[]
  >([]);
  const [opacityValue, setOpacityValue] = useState("0.4");

  // Actualizar BACKGROUNDS con las imágenes del repositorio
  const BACKGROUNDS = backgroundImages.map((img) => `bkgs/${img.name}`);

  const initializeBackgrounds = () => {
    return BACKGROUNDS.map((name) => ({
      name,
      checked: false,
    }));
  };

  const handleBeautifyClick = async () => {
    if (!showBackgroundMenu) {
      setBackgrounds(initializeBackgrounds());
      setShowBackgroundMenu(true);
    } else {
      const selectedBackground = backgrounds.find((bg) => bg.checked);
      if (!selectedBackground) {
        toast("Por favor, selecciona una imagen de fondo.", { type: "error" });
        return;
      }
      if (
        !opacityValue ||
        isNaN(parseFloat(opacityValue)) ||
        parseFloat(opacityValue) < 0 ||
        parseFloat(opacityValue) > 1
      ) {
        toast("Por favor, ingresa un valor de opacidad entre 0 y 1.", { type: "error" });
        return;
      }
      const newContent = beautifyContent(selectedBackground.name);
      if (newContent) {
        setContent(newContent);
        setShowBackgroundMenu(false);
        setBackgrounds([]);
        toast(
          content.includes("\\backgroundsetup")
            ? "Fondo actualizado correctamente."
            : content.includes("\\begin{titlepage}")
            ? "Fondo agregado al encabezado con portada."
            : "Documento embellecido correctamente.",
          { type: "success" }
        );
      }
    }
  };

  const handleBackgroundSelection = (index: number) => {
    setBackgrounds((prev) =>
      prev.map((bg, i) => ({
        ...bg,
        checked: i === index ? !bg.checked : false,
      }))
    );
  };

  // Helper to escape LaTeX special characters
  const escapeLatex = (str: string) =>
    str.replace(/[#$%&_{}]/g, "\\$&").replace(/~/g, "\\textasciitilde{}").replace(/\^/g, "\\textasciicircum{}");

  const beautifyContent = (backgroundImage: string) => {
    // Case 1: Update existing \backgroundsetup
    if (content.includes("\\backgroundsetup")) {
      const backgroundSetupRegex = /\\backgroundsetup\s*\{[\s\S]*?\n\}/;
      const newBackgroundSetup = `\\backgroundsetup{
    scale=1,
    color=black,
    opacity=${parseFloat(opacityValue).toFixed(1)},
    angle=0,
    pages=all,
    contents={\\includegraphics[width=\\paperwidth,height=\\paperheight]{${backgroundImage}}}
}`;
      if (!content.match(backgroundSetupRegex)) {
        toast("No se encontró un bloque \\backgroundsetup válido.", { type: "error" });
        return null;
      }
      return content.replace(backgroundSetupRegex, newBackgroundSetup);
    }

    // Extract title, author, date
    let title = "Documento";
    let author = "Autor";
    let date = "Fecha";
    
    const titleMatch = content.match(/\\title\s*\{([^}]*)\}/);
    if (titleMatch) title = titleMatch[1];
    const authorMatch = content.match(/\\author\s*\{([^}]*)\}/);
    if (authorMatch) author = authorMatch[1];
    const dateMatch = content.match(/\\date\s*\{([^}]*)\}/);
    if (dateMatch) date = dateMatch[1];

    // Escape special characters
    const escapedTitle = escapeLatex(title);
    const escapedAuthor = escapeLatex(author);
    const escapedDate = escapeLatex(date);

    // Case 2: Document with titlepage header but no background
    if (content.includes("\\begin{titlepage}")) {
      if (!content.includes("\\usepackage{background}")) {
        // Insert background package and setup after geometry or other packages
        const geometryIndex = content.indexOf("\\geometry{");
        const insertIndex = geometryIndex !== -1
          ? content.indexOf("\n", geometryIndex) + 1
          : content.indexOf("\\begin{document}");
        if (insertIndex === -1) {
          toast("No se encontró un lugar válido para insertar el fondo.", { type: "error" });
          return null;
        }
        const newBackgroundSetup = [
          "\\usepackage{background}",
          "",
          "% Configuración del fondo pastel",
          `\\backgroundsetup{`,
          `    scale=1,`,
          `    color=black,`,
          `    opacity=${parseFloat(opacityValue).toFixed(1)},`,
          `    angle=0,`,
          `    pages=all,`,
          `    contents={\\includegraphics[width=\\paperwidth,height=\\paperheight]{${backgroundImage}}}`,
          `}`,
          "",
        ].join("\n");
        return (
          content.slice(0, insertIndex) +
          newBackgroundSetup +
          content.slice(insertIndex)
        );
      }
      return content; // If background exists, do nothing (handled by \backgroundsetup case)
    }

    // Case 3: Simple document with \maketitle, apply random header
    const maketitleIndex = content.indexOf("\\maketitle");
    if (maketitleIndex === -1) {
      toast("No se encontró \\maketitle en el documento.", { type: "error" });
      return null;
    }

    const contentAfter = content.slice(maketitleIndex);

    // Randomly choose header
    const useTitlepageHeader = Math.random() < 0.5;

    // Existing embelleced header
    const existingHeader = [
      "\\documentclass{article}",
      "\\usepackage[utf8]{inputenc}",
      "\\usepackage{textcomp}",
      "\\usepackage{amsmath}",
      "\\usepackage{geometry}",
      "\\geometry{a4paper, margin=1.5in}",
      "\\usepackage{lmodern}",
      "\\usepackage{graphicx}",
      "\\usepackage{background}",
      "\\usepackage{fancyhdr}",
      "\\usepackage{xcolor}",
      "",
      "% Set headheight for fancyhdr",
      "\\setlength{\\headheight}{15pt}",
      "",
      "% Configuración del fondo pastel",
      `\\backgroundsetup{`,
      `    scale=1,`,
      `    color=black,`,
      `    opacity=${parseFloat(opacityValue).toFixed(1)},`,
      `    angle=0,`,
      `    pages=all,`,
      `    contents={\\includegraphics[width=\\paperwidth,height=\\paperheight]{${backgroundImage}}}`,
      `}`,
      "",
      "% Configuración de encabezado y pie de página",
      "\\pagestyle{fancy}",
      "\\fancyhf{}",
      `\\fancyhead[L]{\\textit{${escapedTitle}}}`,
      "\\fancyhead[R]{\\thepage}",
      `\\fancyfoot[C]{\\textit{${escapedAuthor} - ${escapedDate}}}`,
      "",
      "% Ajuste del interlineado",
      "\\linespread{1.3}",
      "",
      "% Definición de colores nuevos",
      "\\definecolor{navyblue}{RGB}{0,0,128}",
      "\\definecolor{black}{RGB}{0,0,0}",
      "",
      "% Redefinir secciones con colores",
      "\\makeatletter",
      "\\renewcommand{\\section}{\\@startsection{section}{1}{\\z@}{-3.5ex \\@plus -1ex \\@minus -.2ex}{2.3ex \\@plus.2ex}{\\normalfont\\Large\\bfseries\\color{navyblue}}}",
      "\\renewcommand{\\subsection}{\\@startsection{subsection}{2}{\\z@}{-3.25ex\\@plus -1ex \\@minus -.2ex}{1.5ex \\@plus .2ex}{\\normalfont\\large\\bfseries\\color{black}}}",
      "\\makeatother",
      "",
      "% Títulos con colores",
      `\\title{\\color{navyblue} ${escapedTitle}}`,
      `\\author{\\color{black} ${escapedAuthor}}`,
      `\\date{\\color{black} ${escapedDate}}`,
      "",
      "\\begin{document}",
      "\\maketitle",
    ].join("\n");

    // New titlepage header
    const titlepageHeader = [
      "\\documentclass[12pt,a4paper]{article}",
      "\\usepackage[utf8]{inputenc}",
      "\\usepackage{textcomp}",
      "\\usepackage[spanish]{babel}",
      "\\usepackage{amsmath, amssymb}",
      "\\usepackage{graphicx}",
      "\\usepackage{geometry}",
      "\\geometry{left=2cm, right=2cm, top=2cm, bottom=2cm}",
      "\\usepackage{hyperref}",
      "\\usepackage{fancyhdr}",
      "\\usepackage{setspace}",
      "",
      "% Set headheight for fancyhdr",
      "\\setlength{\\headheight}{15pt}",
      "",
      "\\hypersetup{",
      "    colorlinks=true,",
      "    linkcolor=blue,",
      "    filecolor=magenta,",
      "    urlcolor=cyan,",
      "}",
      "",
      "\\usepackage{background}",
      "% Configuración del fondo pastel",
      `\\backgroundsetup{`,
      `    scale=1,`,
      `    color=black,`,
      `    opacity=${parseFloat(opacityValue).toFixed(1)},`,
      `    angle=0,`,
      `    pages=all,`,
      `    contents={\\includegraphics[width=\\paperwidth,height=\\paperheight]{${backgroundImage}}}`,
      `}`,
      "",
      `\\title{${escapedTitle}}`,
      `\\author{${escapedAuthor}}`,
      `\\date{${escapedDate}}`,
      "",
      "\\pagestyle{fancy}",
      "\\fancyhead{}",
      "\\fancyfoot{}",
      `\\fancyhead[L]{${escapedTitle}}`,
      "\\fancyfoot[C]{\\thepage}",
      "",
      "\\begin{document}",
      "\\begin{titlepage}",
      "    \\centering",
      "    \\vspace*{1cm}",
      `    \\huge\\textbf{${escapedTitle}}`,
      "",
      "    \\vspace{0.5cm}",
      "    \\LARGE Un análisis detallado de su legado y contribuciones",
      "",
      "    \\vspace{1.5cm}",
      `    \\textbf{${escapedAuthor}}`,
      "",
      "    \\vspace{2cm}",
      "",
      `    \\Large ${escapedDate}`,
      "",
      "    \\vfill",
      "",
      "    \\normalsize",
      "\\end{titlepage}",
      "",
      "\\tableofcontents",
      "\\newpage",
    ].join("\n");

    // Apply selected header
    return useTitlepageHeader ? titlepageHeader + contentAfter : existingHeader + contentAfter;
  };


  // New function for color beautification
  const handleBeautifyColorsClick = async () => {
    const newContent = beautifyWithColors();
    if (newContent) {
      setContent(newContent);
      toast("Documento embellecido con colores correctamente.", { type: "success" });
    }
  };

// New beautify function for colors only
const beautifyWithColors = () => {
  // Extraer título, autor, fecha
  let title = "Documento";
  let author = "Autor";
  let date = "Fecha";

  const titleMatch = content.match(/\\title\s*\{([^}]*)\}/);
  if (titleMatch) title = titleMatch[1];
  const authorMatch = content.match(/\\author\s*\{([^}]*)\}/);
  if (authorMatch) author = authorMatch[1];
  const dateMatch = content.match(/\\date\s*\{([^}]*)\}/);
  if (dateMatch) date = dateMatch[1];

  const escapedTitle = escapeLatex(title);
  const escapedAuthor = escapeLatex(author);
  const escapedDate = escapeLatex(date);

  // Extraer preámbulo y cuerpo original
  let preamble = "";
  let contentAfter = content;
  const beginDocIndex = content.indexOf("\\begin{document}");
  if (beginDocIndex !== -1) {
    preamble = content.slice(0, beginDocIndex).trim();
    contentAfter = content.slice(beginDocIndex + "\\begin{document}".length).trim();
  }

  // Encontrar el inicio del cuerpo
  let maketitleIndex = contentAfter.indexOf("\\maketitle");
  let titlepageEndIndex = contentAfter.indexOf("\\end{titlepage}");

  if (maketitleIndex !== -1) {
    contentAfter = contentAfter.slice(maketitleIndex + "\\maketitle".length).trim();
  } else if (titlepageEndIndex !== -1) {
    const afterTitlepage = contentAfter.indexOf("\\newpage", titlepageEndIndex);
    if (afterTitlepage !== -1) {
      contentAfter = contentAfter.slice(afterTitlepage + "\\newpage".length).trim();
    } else {
      contentAfter = contentAfter.slice(titlepageEndIndex + "\\end{titlepage}".length).trim();
    }
  } else {
    toast("No se encontró \\maketitle ni \\end{titlepage} en el documento.", { type: "error" });
    return null;
  }

  // Definir encabezados
  const headers = [
    {
      id: "colorHeader",
      preambleLines: [
        "\\usepackage{xcolor}",
        "\\definecolor{navyblue}{RGB}{0,0,128}",
        "\\definecolor{black}{RGB}{0,0,0}",
        "\\makeatletter",
        "\\renewcommand{\\section}{\\@startsection{section}{1}{\\z@}{-3.5ex \\@plus -1ex \\@minus -.2ex}{2.3ex \\@plus .2ex}{\\normalfont\\Large\\bfseries\\color{navyblue}}}",
        "\\renewcommand{\\subsection}{\\@startsection{subsection}{2}{\\z@}{-3.25ex\\@plus -1ex \\@minus -.2ex}{1.5ex \\@plus .2ex}{\\normalfont\\large\\bfseries\\color{black}}}",
        "\\makeatother",
      ],
      template: [
        "\\maketitle",
      ].join("\n"),
      marker: "\\definecolor{navyblue}",
    },
    {
      id: "titlepageHeader",
      preambleLines: [
        "\\usepackage[spanish]{babel}",
        "\\usepackage{hyperref}",
        "\\hypersetup{",
        "    colorlinks=true,",
        "    linkcolor=blue,",
        "    filecolor=magenta,",
        "    urlcolor=cyan,",
        "}",
      ],
      template: [
        "\\begin{titlepage}",
        "    \\centering",
        "    \\vspace*{1cm}",
        `    \\huge\\textbf{${escapedTitle}}`,
        "    \\vspace{0.5cm}",
        "    \\LARGE Un análisis detallado de su legado y contribuciones",
        "    \\vspace{1.5cm}",
        `    \\textbf{${escapedAuthor}}`,
        "    \\vspace{2cm}",
        `    \\Large ${escapedDate}`,
        "    \\vfill",
        "    \\normalsize",
        "\\end{titlepage}",
        "\\tableofcontents",
        "\\newpage",
      ].join("\n"),
      marker: "\\begin{titlepage}",
    },
  ];

  // Base del preámbulo común
  const basePreamble = [
    "\\documentclass[12pt,a4paper]{article}",
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage{textcomp}",
    "\\usepackage{amsmath, amssymb}",
    "\\usepackage{geometry}",
    "\\geometry{left=2cm, right=2cm, top=2cm, bottom=2cm}",
    "\\usepackage{fancyhdr}",
    "\\setlength{\\headheight}{15pt}",
    "\\pagestyle{fancy}",
    "\\fancyhead{}",
    "\\fancyfoot{}",
    `\\fancyhead[L]{${escapedTitle}}`,
    "\\fancyfoot[C]{\\thepage}",
    `\\title{${escapedTitle}}`,
    `\\author{${escapedAuthor}}`,
    `\\date{${escapedDate}}`,
  ];

  // Detectar encabezado actual
  let currentHeader = null;
  for (const header of headers) {
    if (content.includes(header.marker)) {
      currentHeader = header.id;
      break;
    }
  }

  // Elegir próximo encabezado
  let selectedHeader;
  if (!currentHeader) {
    const randomIndex = Math.floor(Math.random() * headers.length);
    selectedHeader = headers[randomIndex];
  } else {
    const currentIndex = headers.findIndex((h) => h.id === currentHeader);
    const nextIndex = (currentIndex + 1) % headers.length;
    selectedHeader = headers[nextIndex];
  }

  // Construir nuevo preámbulo
  let preambleLines = preamble.split("\n").filter(line => line.trim() !== "");
  if (currentHeader) {
    const oldHeader = headers.find(h => h.id === currentHeader);
    preambleLines = preambleLines.filter(line => !oldHeader.preambleLines.includes(line));
  }
  const newPreamble = [...basePreamble, ...selectedHeader.preambleLines].join("\n");

  // Construir documento final
  const newContent = `${newPreamble}\n\\begin{document}\n${selectedHeader.template}\n${contentAfter}`;

  toast("Documento embellecido con un nuevo encabezado.", { type: "success" });
  return newContent;
};



  return (
    <Card className="w-full max-w-7xl mx-auto max-h-[550px] overflow-auto">
      <CardHeader>
        <CardTitle>Editor MMaTEX</CardTitle>
        <CardDescription>Edita tu documento de investigación aquí
        
        {typeShort === "large" && (
        <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold text-white bg-emerald-500 rounded-md">
        long-v1.0
        </span>
        )}

        {typeShort === "short" && (
        <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold text-white bg-emerald-500 rounded-md">
        short-v1.0
        </span>
        )}

        </CardDescription>
        {/* Acordeón de imágenes de fondo */}
        {typeShort === "large" && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="backgrounds">
              <AccordionTrigger>Fondos de documento</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {backgroundImages.map((img, index) => (
                    <div key={img.name} className="relative">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-24 object-cover rounded-md cursor-pointer"
                        onClick={() => handleBackgroundSelection(index)}
                      />
                      <Checkbox
                        checked={backgrounds[index]?.checked || false}
                        onCheckedChange={() => handleBackgroundSelection(index)}
                        className="absolute top-2 right-2"
                      />
                      <span className="text-xs text-center block mt-1">{img.name}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardHeader>

      <Tabs defaultValue="editor" onValueChange={handleTabChange}>
        <TabsList className="mx-6">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />Compilar
          </TabsTrigger>
          {activeTab === "editor" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
              style={{ marginLeft: "auto" }}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          )}
        </TabsList>

        <CardContent>
          <TabsContent value="editor" className="mt-0">
            <div className="border rounded-md overflow-hidden overflow-y-auto" ref={editorContainerRef} onScroll={handleScroll}>
              <div className="flex">
                <Editor
                  height="55vh"
                  language="javascript"
                  theme="javascriptTheme"
                  value={content}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monaco.languages.setMonarchTokensProvider('javascript', {
                      tokenizer: {
                        root: [
                          [/\\[a-zA-Z]+/, 'keyword'],
                          [/\{/, 'delimiter'],
                          [/\}/, 'delimiter'],
                          [/\$(?!\$)/, { token: 'string', next: '@math' }],
                          [/\%.*$/, 'comment']
                        ],
                        math: [[/(?<!\$)\$(?!\$)/, { token: 'string', next: '@pop' }]]
                      }
                    });
                    monaco.editor.setTheme('hc-black');
                    editor.onDidChangeModelContent(handleEditorChange);
                  }}
                  options={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 18,
                    lineHeight: 24,
                    wordWrap: 'on',
                    validate: false,
                    renderValidationDecorations: "off",
                    minimap: { enabled: false },
                    padding: { top: 10 }
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex flex-col gap-2">
  <div className="w-full flex justify-between items-center">
    <div className="text-sm text-muted-foreground">
      {lines.length} líneas | {content.length} caractéres
    </div>
    <div className="flex gap-2">
      {(isOptionOne === true && typeShort === "short") && (
        <Button variant="outline" size="sm" 
        onClick={() => {
          handleUpdatePDF();
          saveChatEntry();
        }}>
          <ReplaceAll className="h-4 w-4 mr-2" />
          Actualizar PDF
        </Button>
      )}

{(isOptionOne === false || typeShort === "large") && (
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            handleUploadToGitHub(content)
              .then(() => {
                handleUpdatePDF();
                saveChatEntry();
              })
              .catch(error => console.error("Error al subir a GitHub:", error));
          }}
        >
          <FaGithub className="h-4 w-4 mr-2" />
          Actualizar con GitHub
        </Button>
      )}


      <Button variant="default" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />Descargar .tex
      </Button>





    </div>
  </div>

  {typeShort === "short" && (
    <div className="w-full flex justify-start">
      <Button
        variant="outline"
        size="sm"
        onClick={
          handleBeautifyColorsClick
        }
        className="h-8"
      >
        <Replace className="h-4 w-4 mr-2" />
        Beautify sencillo
      </Button>
    </div>
  )}

  {typeShort === "large" && (
    <div className="w-full flex flex-col items-start">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleInsertFiguresClick}
          className="mt-2"
        >
          <IndentIncrease className="h-4 w-4 mr-2" />
          {insertButtonText}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBeautifyClick}
          className="mt-2"
        >
          <Replace className="h-4 w-4 mr-2" />
          {showBackgroundMenu ? "Aplicar fondo" : "Beautify con background"}
        </Button>
      </div>

      {showImageMenu && (
        <div className="mt-2 w-full border rounded-md p-4 bg-background">
          {imageFiles.map((img, index) => (
            <div key={img.name} className="flex items-center gap-4 mb-2">
              <Checkbox
                checked={img.checked}
                onCheckedChange={(checked) =>
                  handleImageSelection(index, "checked", !!checked)
                }
              />
              <span className="flex-1">{img.name}</span>
              <Input
                type="number"
                placeholder="Línea"
                value={img.line}
                onChange={(e) =>
                  handleImageSelection(index, "line", e.target.value)
                }
                className="w-24"
                min="1"
              />
            </div>
          ))}
        </div>
      )}

      {showBackgroundMenu && (
        <div className="mt-2 w-full border rounded-md p-4 bg-background">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Opacidad (0 a 1):
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={opacityValue}
              onChange={(e) => setOpacityValue(e.target.value)}
              className="w-24"
              placeholder="0.1"
            />
          </div>
          {backgrounds.map((bg, index) => (
            <div key={bg.name} className="flex items-center gap-4 mb-2">
              <Checkbox
                checked={bg.checked}
                onCheckedChange={() => handleBackgroundSelection(index)}
              />
              <span className="flex-1">{bg.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</CardFooter>

    </Card>
  );
};

export default LaTeXEditorTxt;