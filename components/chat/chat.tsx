"use client";

import { useState, useEffect } from "react";
import { Message } from "ai";
import { motion } from "framer-motion";
import { GithubIcon, PanelRightOpen } from "lucide-react";
import { Feather } from 'lucide-react';
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";
import CompileTxtButton2 from "@/components/chat/compile-txt2";
import { MultimodalInput } from "@/components/chat/input2";
import { PreviewMessage, ProgressStep } from "@/components/chat/message";
import { ResearchProgress } from "@/components/chat/research-progress";
import dynamic from 'next/dynamic';
const LaTeXEditorTxt = dynamic(() => import('@/components/chat/latex-editor'), { ssr: false });
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import AtomWithCounter from "@/components/chat/atomloader";
import { useChatContext } from "@/components/context/ChatContext";
import * as Frigade from '@frigade/react';
import Carousel3D from "@/components/chat/Carousel3D"; // Ajusta la ruta según tu estructura



const PDFportadas = [
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada_v1.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada2.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada3.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada21.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada31.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada41.pdf",
  "https://josemramirez.github.io/mmatex/pdf_examples/Portada51.pdf"
]

const getRandomEndpoint = () => {
  const randomIndex = Math.floor(Math.random() * PDFportadas.length);
  return PDFportadas[randomIndex];
};  
  
const PDFportada = getRandomEndpoint();



interface ChatProps {
  id: string;
  initialMessages: any[];
  setTotalTokens: (value: string) => void;
  setTotalTotalTokens: (value: string) => void;
  setNameChat: (value: string) => void;
  setTotalSaldo: (value: string) => void;
  totalTokens: string | null;
  TotaltotalTokens: string | null;
  nameChat: string | null;
  totalSaldo: string | null;
}

export function Chat({
  id,
  initialMessages,
  setTotalTokens,
  setTotalTotalTokens,
  setNameChat,
  setTotalSaldo,
  totalTokens,
  TotaltotalTokens,
  nameChat,
  totalSaldo
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [containerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [isOptionOne, setIsOptionOne] = useState(true);
  const [fileNameGit, setFileNameGit] = useState("");
  const [typeShort, setTypeShort] = useState("short");
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const { chats, setChats } = useChatContext();
  const [showProgressPanel, setShowProgressPanel] = useState<boolean>(true);
  const [stage, setStage] = useState<"initial" | "feedback" | "researching" | "improving">("initial");
  const [initialQuery, setInitialQuery] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);


  // Hook de Frigade para manejar el tour
  const { flow } = Frigade.useFlow('flow_TTxMQoLB');

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleToggle = () => {
    const newIsOptionOne = !isOptionOne;
    setIsOptionOne(newIsOptionOne);
    setTypeShort(newIsOptionOne ? "short" : "large");
  };

  function generateUniqueFileName(baseName: string, extension: string) {
    const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${baseName}-${timestamp}-${randomStr}${extension}`;
  }

  useEffect(() => {
    setFileNameGit(generateUniqueFileName("onmmatex-es-v1", ".tex"));
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => console.log("Hello"), 1000);
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  interface ChatData {
    nameChat: string;
    content: string;
    tokensUsed: number;
    userId: string | number | undefined;
    typeShort: string;
    fileName: string;
  }

  const saveChatEntryNotify = (chatData: ChatData) => {
    toast("¡Excelente! ¡Documento guardado con éxito!");
    return chatData;
  };

  const noSaveChatEntryNotify = () => toast("¡Algo salió mal! Por favor, inténtelo de nuevo.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

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


  const removeLatexFigures = (latexText: string) => {
    // Expresión regular para detectar figuras en LaTeX
    const figureRegex = /\\begin\{(figure|center)\}[\s\S]*?\\includegraphics[\s\S]*?(?:\\caption\{[\s\S]*?\})?(?:\\label\{[\s\S]*?\})?[\s\S]*?\\end\{(figure|center)\}/g;
    
    // Reemplaza las coincidencias con una cadena vacía
    return latexText.replace(figureRegex, '');
  };
  

  const hasStartedResearch = progress.filter(step =>
    step.type !== "report" || step.content.includes("Generating") || step.content.includes("Synthesizing")
  ).length > 0;

  const sendResearchQuery = async (query: string, config: { breadth: number; depth: number; modelId: string }) => {
    try {
      setIsLoading(true);
      setShowProgressPanel(true);
      setProgress([]);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Iniciando investigación profunda basada en sus datos..." }]);
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, breadth: config.breadth, depth: config.depth, modelId: config.modelId, typeShort }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "progress") {
                if (event.step.type !== "report") {
                  setProgress(prev => prev.length > 0 && prev[prev.length - 1].content === event.step.content ? prev : [...prev, event.step]);
                }
              } else if (event.type === "result") {
                setFinalReport(removeLatexFigures(event.report.report));
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());
                const tokensUsed = Number(event.report.tokens.totalTokens);
                const saveReport = event.report.report;
                const nameChat = extraerPrimerosQuinceCaracteresConFecha(saveReport);
                let fileName = isOptionOne ? "doc12.tex" : fileNameGit;

                try {
                  const response = await fetch('/api/save-chatentry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nameChat, content: saveReport, tokensUsed, userId, typeShort, fileName })
                  });
                  if (!response.ok) throw new Error('Error al guardar la entrada');
                  const data = await response.json();
                  console.log(data.message);
                  const newChat = { nameChat, content: saveReport, tokensUsed, userId, typeShort, fileName };
                  saveChatEntryNotify(newChat);
                  setChats(prevChats => [...prevChats, newChat]);
                } catch (error) {
                  console.error('Error:', error);
                  noSaveChatEntryNotify();
                }

                const currentTotalTokens = event.report.tokens.totalTokens;
                const currentQuery = query;
                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ totalTokens: currentTotalTokens, userInput: currentQuery.slice(0, 20) })
                }).then(response => {
                  if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
                  return response.json();
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  setTotalTotalTokens(String(data.totalTokens));
                  setTotalSaldo(String(data.totalSaldo));
                }).catch(error => console.error('Error:', error));
                setShowProgressPanel(false);
              } else if (event.type === "report_part") {
                reportParts.push(event.content);
              }
            } catch (e) {
              console.error("Error parsing event:", e);
            }
          }
        }
      }
      if (reportParts.length > 0) {
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: fullReport }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Lo sentimos, hubo un error al realizar la investigación. Por favor, intente de nuevo con una consulta más específica." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendImprovments = async (query: string, config: { breadth: number; depth: number; modelId: string }) => {
    setIsImproving(true);
    try {
      setIsLoading(true);
      setProgress([]);
      setShowProgressPanel(true);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Comenzando mejoras del documento según sus indicaciones..." }]);
      const response = await fetch("/api/improvments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, breadth: config.breadth, depth: config.depth, modelId: config.modelId })
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "progress") {
                if (event.step.type !== "report") {
                  setProgress(prev => prev.length > 0 && prev[prev.length - 1].content === event.step.content ? prev : [...prev, event.step]);
                }
              } else if (event.type === "result") {
                setFinalReport(event.report.report);
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());
                const tokensUsed = Number(event.report.tokens.totalTokens);
                const saveReport = event.report.report;
                const nameChat = extraerPrimerosQuinceCaracteresConFecha(saveReport);
                const fileName = fileNameGit;

                try {
                  const response = await fetch('/api/save-chatentry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nameChat, content: saveReport, tokensUsed, userId, typeShort, fileName })
                  });
                  if (!response.ok) throw new Error('Error al guardar la entrada');
                  const data = await response.json();
                  console.log(data.message);
                  const newChat = { nameChat, content: saveReport, tokensUsed, userId, typeShort, fileName };
                  saveChatEntryNotify(newChat);
                  setChats(prevChats => [...prevChats, newChat]);
                } catch (error) {
                  console.error('Error:', error);
                  noSaveChatEntryNotify();
                }

                const currentTotalTokens = event.report.tokens.totalTokens;
                const currentQuery = query;
                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ totalTokens: currentTotalTokens, userInput: currentQuery.slice(0, 20) })
                }).then(response => {
                  if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
                  return response.json();
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  setTotalTotalTokens(String(data.totalTokens));
                  setTotalSaldo(String(data.totalSaldo));
                }).catch(error => console.error('Error:', error));
                setShowProgressPanel(false);
                setIsImproving(false);
              } else if (event.type === "report_part") {
                reportParts.push(event.content);
              }
            } catch (e) {
              console.error("Error parsing event:", e);
            }
          }
        }
      }
      if (reportParts.length > 0) {
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: fullReport }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Lo sentimos, hubo un error al mejorar su documento. Por favor, intente de nuevo con instrucciones más claras." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (userInput: string, config: { breadth: number; depth: number; modelId: string }) => {
    if (!userInput.trim() || isLoading) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userInput }]);
    setIsLoading(true);
    if (stage === "initial") {
      setMessages(prev => [...prev, { id: "thinking", role: "assistant", content: "Procesando su solicitud..." }]);
      setInitialQuery(userInput);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userInput, numQuestions: 3, modelId: config.modelId })
        });
        const data = await response.json();
        const questions: string[] = data.questions.questions || [];
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== "thinking");
          if (questions.length > 0) {
            const formattedQuestions = questions.map((q, index) => `${index + 1}. ${q}`).join("\n\n");
            return [...filtered, { id: Date.now().toString(), role: "assistant", content: `Por favor responda a estas sencillas preguntas para darle forma a su investigación:\n\n${formattedQuestions}` }];
          }
          return filtered;
        });
        setStage("feedback");
        setTotalTokens("+" + data.questions.tokens.totalTokens.toString());
        setNameChat("Tópico=>\n" + userInput.slice(0, 10).replace(" ", "-"));
        fetch('/api/update-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalTokens: data.questions.tokens.totalTokens, userInput: userInput.slice(0, 20) })
        }).then(response => {
          if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
          return response.json();
        }).then(data => {
          //console.log('Datos recibidos:', data);
          setTotalTotalTokens(String(data.totalTokens));
          setTotalSaldo(String(data.totalSaldo));
        }).catch(error => console.error('Error:', error));
      } catch (error) {
        console.error("Feedback generation error:", error);
        setMessages(prev => [...prev.filter(m => m.id !== "thinking"), { id: Date.now().toString(), role: "assistant", content: "Lo sentimos, hubo un error al generar preguntas de seguimiento. Por favor, refine su consulta inicial." }]);
      } finally {
        setIsLoading(false);
      }
    } else if (stage === "feedback") {
      const combined = `Initial Query: ${initialQuery}\nFollow-up Answers:\n${userInput}`;
      setStage("researching");
      try {
        await sendResearchQuery(combined, config);
      } finally {
        setIsLoading(false);
        setMessages(prev => [{ id: Date.now().toString(), role: "assistant", content: "¡Sesión de investigación completada! Su PDF está listo para visualizar." }]);
      }
    } else if (stage === "researching") {
      const combined = `Initial Document: ${finalReport}\nFollow-up Improvements:\n${userInput}`;
      setStage("improving");
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        setMessages(prev => [{ id: Date.now().toString(), role: "assistant", content: "¡Mejora completada! Puede continuar realizando mejoras adicionales a su documento." }]);
      }
    } else if (stage === "improving") {
      const combined = `Current Document: ${finalReport}\nAdditional Improvements:\n${userInput}`;
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        setMessages(prev => [{ id: Date.now().toString(), role: "assistant", content: "¡Mejora aplicada! Puede seguir refinando su documento para obtener resultados óptimos." }]);
      }
    }
  };

  return (
    <div className="flex w-full h-full relative">
      <motion.div
        className={`mx-auto flex flex-col h-full pt-10 ${hasStartedResearch || stage === "improving" ? "md:mr-0" : "md:mx-auto"}`}
        initial={{ width: "100%", maxWidth: "800px" }}
        animate={{ width: !isMobile && (hasStartedResearch || stage === "improving") ? "55%" : "100%", maxWidth: !isMobile && (hasStartedResearch || stage === "improving") ? "800px" : "800px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
    <div
      ref={containerRef}
      className={`${showProgress ? "hidden md:block" : "block"} ${
        finalReport ? "hidden" : "flex-1 overflow-y-auto"
      } relative`}
    >
      {!hasStartedResearch && messages.length === 0 && (
        <div className="w-full max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row md:space-x-16">
            {/* Carrusel a la izquierda */}
            <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
              <div className="w-full max-w-[400px]">
                
                <Carousel3D />

              </div>
            </div>

            {/* Texto a la derecha */}
            <div className="md:w-1/2 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative text-center space-y-4 p-4 md:p-8"
              >
                <motion.div
                  animate={{ y: [-2, 2, -2], rotate: [-1, 1, -1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 blur-2xl rounded-full -z-10"
                  />
                  <Feather className="w-12 h-12 mx-auto text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
                </motion.div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-600">corto</span>
                    <button
                      onClick={handleToggle}
                      data-tour="toggle-corto"
                      className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      style={{ backgroundColor: isOptionOne ? "#4f46e5" : "#10b981" }}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          isOptionOne ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-600">largo</span>
                  </div>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-base md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80"
                  >
                    Motor de Investigación Profunda OnMMaTeX
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs md:text-base text-muted-foreground/80 max-w-[340px] mx-auto leading-relaxed"
                  >
                    Cree documentos de calidad profesional al instante con las avanzadas capacidades de investigación IA de OnMMaTeX.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <a
                      href="https://github.com/josemramirez/onmmatex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 md:px-6 md:py-2.5 text-xs md:text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 text-primary hover:text-primary/90 rounded-full transition-all duration-300 shadow-[0_0_0_1px_rgba(var(--primary),0.1)] hover:shadow-[0_0_0_1px_rgba(var(--primary),0.2)] hover:scale-[1.02]"
                    >
                      <GithubIcon className="w-4 h-4 mr-1" />
                      Ver código fuente
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}



          <div className="p-4 md:p-6 space-y-6">
            {messages.map(message => <PreviewMessage key={message.id} message={message} />)}
            {showProgressPanel && <ResearchProgress progress={progress} isLoading={isLoading} />}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
        {finalReport && (
          <div className="flex-1 w-full pt-10">
            <LaTeXEditorTxt
              reportText={finalReport}
              totalTokens={totalTokens ?? ''}
              nameChat={nameChat ?? ''}
              isOptionOne={isOptionOne}
              typeShort={typeShort}
              fileNameGit={fileNameGit}
            />
          </div>
        )}
        <div className="sticky bottom-0">
          {isLoading && !finalReport && <AtomWithCounter />}
          {isImproving && <AtomWithCounter />}
          <div className="p-4 md:p-6 mx-auto">
            <MultimodalInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder={
                stage === "initial" ? "¿Qué le gustaría investigar hoy?" :
                stage === "feedback" ? "Por favor, responda a las preguntas de seguimiento para refinar su investigación y obtener mayor precisión..." :
                stage === "researching" ? "Investigación en progreso... Analizando múltiples fuentes para resultados precisos." :
                stage === "improving" ? "¿Qué le gustaría mejorar en su documento?" :
                "Escriba su mensaje o consulta de investigación aquí..."
              }
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        className={`pt-20 fixed md:relative inset-0 md:inset-auto bg-background md:bg-transparent md:w-[45%] ${showProgress ? "flex" : "hidden md:flex"} ${hasStartedResearch || stage === "improving" ? "md:flex" : "md:hidden"}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        {finalReport && (
          <CompileTxtButton2
            reportText={finalReport}
            totalTokens1={totalTokens ?? ""}
            nameChat1={nameChat ?? ""}
            isOptionOne={isOptionOne}
            typeShort={typeShort}
            fileNameGit={fileNameGit}
          />
        )}
      </motion.div>
      {(hasStartedResearch || stage === "improving") && (
        <button
          onClick={() => setShowProgress(!showProgress)}
          className={`md:hidden fixed bottom-24 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-transform ${showProgress ? "rotate-180" : ""}`}
          aria-label="Toggle research progress"
        >
          <PanelRightOpen className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}