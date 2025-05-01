"use client";

import { useState, useEffect } from "react";
import { Message } from "ai";
import { PanelRightOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";
{/*-- Mi boton de compilar --*/}
import CompileTxtButton2 from "@/components/chat/compile-txt2";
import { MultimodalInput } from "@/components/chat/input2";
import { PreviewMessage, ProgressStep } from "@/components/chat/message";
import { ResearchProgress } from "@/components/chat/research-progress";
{/* Para el lateX Editor */}
import LaTeXEditorTxt from "@/components/chat/latex-editor";
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import AtomWithCounter from "@/components/chat/atomloader";
// -----------------------------------------

// Define las props que Chat recibirá
type ChatProps = {
  id: string;
  initialMessages: string;
  setTotalTokens: (value: string | null) => void; // Función para actualizar totalTokens
  setTotalTotalTokens: (value: string | null) => void; // Función para actualizar
  setNameChat: (value: string | null) => void; // Función para actualizar Nombre Chat
  setTotalSaldo: (value: string | null) => void; // Función para actualizar Saldo Total
  typeShort: string;
  fileName: string;
};
export function RecentChat({
  id,
  initialMessages,
  setTotalTokens,
  setTotalTotalTokens,
  setNameChat,
  setTotalSaldo,
  typeShort,
  fileName
}: ChatProps) {
  // Mensajes iniciales que simulan haber pasado por "initial" y "feedback"
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    role: "user",
    content: "Quiero investigar sobre mec\xE1nica cu\xE1ntica."
  }, {
    id: "2",
    role: "assistant",
    content: "Por favor, responde estas sencillas preguntas para enfocar tu investigaci\xF3n:\n\n1. \xBFQu\xE9 aspecto de la mec\xE1nica cu\xE1ntica te interesa m\xE1s?"
  }, {
    id: "3",
    role: "user",
    content: "Me interesa la superposici\xF3n cu\xE1ntica."
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  // Agrega este estado al inicio de tu componente (antes del return)
  const [isOptionOne, setIsOptionOne] = useState(true);


  // Progreso inicial (opcional, puedes dejarlo vacío si prefieres)
  const [progress, setProgress] = useState<ProgressStep[]>([{
    type: "research",
    content: "Investigando mec\xE1nica cu\xE1ntica..."
  }, {
    type: "research",
    content: "Analizando principios de superposici\xF3n cu\xE1ntica..."
  }]);
  const [containerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [totalTokens] = useState<string | null>(null);
  const [TotaltotalTokens] = useState<string | null>(null);
  const [nameChat] = useState<string | null>(null);
  const [totalSaldo] = useState<string | null>(null);

  // Panel de progreso visible desde el inicio
  const [showProgressPanel, setShowProgressPanel] = useState<boolean>(true);

  // Estado inicial cambiado a "researching"
  const [stage, setStage] = useState<"initial" | "feedback" | "researching" | "improving">("researching");
  const [initialQuery, setInitialQuery] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  {/* Temas de sesion de usuario */}
  const {
    data: session,
    update
  } = useSession();
  const userId = session?.user?.id;
  const saveChatEntryNotify = () => toast("\xA1Excelente! \xA1Documento guardado con \xE9xito!");
  const noSaveChatEntryNotify = () => toast("\xA1Algo sali\xF3 mal! Por favor, int\xE9ntalo de nuevo.");
  function extraerPrimerosQuinceCaracteresDePrimeraSeccion(contenido: string) {
    // Buscar la primera aparición de \section{...}
    const regexPrimeraSeccion = /\\section\{([^}]*)\}/;
    const match = contenido.match(regexPrimeraSeccion);
    if (!match) {
      return "No se encontró ninguna sección.";
    }

    // Encontrar la posición donde termina el comando \section{...}
    const finComando = match!.index + match![0].length;

    // Encontrar el final de la sección
    const inicioSiguienteSeccion = contenido.indexOf('\\section', finComando);
    const finDocumento = contenido.indexOf('\\end{document}', finComando);
    let finSeccion;
    if (inicioSiguienteSeccion === -1 || finDocumento < inicioSiguienteSeccion) {
      finSeccion = finDocumento; // Si no hay más secciones, termina en \end{document}
    } else {
      finSeccion = inicioSiguienteSeccion; // Termina en la siguiente sección
    }

    // Extraer el contenido de la sección y limpiarlo
    const contenidoSeccion = contenido.substring(finComando, finSeccion).trim();

    // Tomar los primeros quince caracteres
    return contenidoSeccion.substring(0, 15);
  }

  // Ejemplo: actualiza totalTokens cuando sea necesario
  useEffect(() => {
    // Simula la obtención de tokens (reemplaza con tu lógica real)
    setTotalTokens(totalTokens ?? "0");
    setTotalTotalTokens(TotaltotalTokens ?? "0");
    setNameChat("Inicial ");
    setTotalSaldo(totalSaldo ?? "10");
  }, [setTotalTokens, totalTokens, setTotalTotalTokens, TotaltotalTokens, setNameChat, nameChat, setTotalSaldo, totalSaldo]);

  // Detección de móvil (sin cambios)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Establecer un finalReport inicial al cargar el componente
  useEffect(() => {
    setFinalReport(initialMessages);
  }, []);

  // Update the condition to only be true when there are actual research steps
  const hasStartedResearch = progress.filter(step =>
  // Only count non-report steps or initial report steps
  step.type !== "report" || step.content.includes("Generating") || step.content.includes("Synthesizing")).length > 0;

  // Helper function to call the research endpoint
  const sendResearchQuery = async (query: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    try {
      setIsLoading(true);
      setShowProgressPanel(true);
      setProgress([]);
      // Inform the user that research has started
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Iniciando investigaci\xF3n exhaustiva basada en tus aportaciones..."
      }]);
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          breadth: config.breadth,
          depth: config.depth,
          modelId: config.modelId
        })
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, {
          stream: true
        });
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
                  // Check for duplicates before adding this progress step.
                  setProgress(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].content === event.step.content) {
                      return prev;
                    }
                    return [...prev, event.step];
                  });
                }
              } else if (event.type === "result") {
                // Save the final report so we can download it later
                setFinalReport(event.report.report);

                // como ir actualizando
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());
                //setTotalTokens("1.32k");
                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Usar valores directamente disponibles
                const currentTotalTokens = event.report.tokens.totalTokens; // Valor directo del evento
                const currentQuery = query; // Usar 'query' recibido por sendResearchQuery como userInput

                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    totalTokens: currentTotalTokens,
                    // Valor numérico
                    userInput: currentQuery.slice(0, 20) // Valor de texto
                  })
                }).then(response => {
                  if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                  }
                  return response.json(); // Parsear la respuesta JSON
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  const newTotalTokens = data.totalTokens; // Obtener totalTokens de la respuesta
                  setTotalTotalTokens(String(newTotalTokens)); // Actualizar el estado
                  const newTotalSaldo = data.totalSaldo; // Obtener totalSaldo de la respuesta
                  setTotalSaldo(String(newTotalSaldo)); // Actualizar el estado
                }).catch(error => {
                  console.error('Error:', error);
                });
                //--------------------------------------------------------------------
                //--------------------------------------------------------------------

                // Hide progress panel when research completes
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
        // In case the report was sent in parts
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: fullReport
        }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lo sentimos, hubo un error al realizar la investigaci\xF3n. Por favor, int\xE9ntalo de nuevo."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------
  // Helper function mia para las mejoras -----------------------------------
  const sendImprovments = async (query: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    setIsImproving(true); // Inicia el proceso de mejora

    try {
      setIsLoading(true);
      setProgress([]);
      setShowProgressPanel(true);
      // Inform the user that research has started
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Comenzando mejoras del documento seg\xFAn tus indicaciones..."
      }]);
      const response = await fetch("/api/improvments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          breadth: config.breadth,
          depth: config.depth,
          modelId: config.modelId
        })
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const textDecoder = new TextDecoder();
      let buffer = "";
      const reportParts: string[] = [];
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += textDecoder.decode(value, {
          stream: true
        });
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
                  // Check for duplicates before adding this progress step.
                  setProgress(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].content === event.step.content) {
                      return prev;
                    }
                    return [...prev, event.step];
                  });
                }
              } else if (event.type === "result") {
                // Save the final report so we can download it later
                setFinalReport(event.report.report);

                // como ir actualizando
                setTotalTokens("+" + event.report.tokens.totalTokens.toString());

                // -------------------------------------------------------
                // --- Para guardar los chats ----------------------------
                const tokensUsed = Number(event.report.tokens.totalTokens);
                const saveReport = event.report.report;
                const nameChat = extraerPrimerosQuinceCaracteresDePrimeraSeccion(saveReport);
                try {
                  const response = await fetch('/api/save-chatentry', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      nameChat,
                      content: saveReport,
                      tokensUsed,
                      userId,
                      typeShort: typeShort,
                      fileName: fileName
                    })
                  });
                  if (!response.ok) {
                    throw new Error('Error al guardar la entrada');
                  }
                  const data = await response.json();
                  console.log(data.message); // "Entrada guardada exitosamente"
                  saveChatEntryNotify();
                } catch (error) {
                  console.error('Error:', error);
                  noSaveChatEntryNotify();
                }
                //--------------------------------------------------------------------

                //--------------------------------------------------------------------
                //--------------------------------------------------------------------
                // Usar valores directamente disponibles
                const currentTotalTokens = event.report.tokens.totalTokens; // Valor directo del evento
                const currentQuery = query; // Usar 'query' recibido por sendResearchQuery como userInput

                fetch('/api/update-tokens', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    totalTokens: currentTotalTokens,
                    // Valor numérico
                    userInput: currentQuery.slice(0, 20) // Valor de texto
                  })
                }).then(response => {
                  if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                  }
                  return response.json(); // Parsear la respuesta JSON
                }).then(data => {
                  console.log('Datos recibidos:', data);
                  const newTotalTokens = data.totalTokens; // Obtener totalTokens de la respuesta
                  setTotalTotalTokens(String(newTotalTokens)); // Actualizar el estado
                  const newTotalSaldo = data.totalSaldo; // Obtener totalSaldo de la respuesta
                  setTotalSaldo(String(newTotalSaldo)); // Actualizar el estado
                }).catch(error => {
                  console.error('Error:', error);
                });
                //--------------------------------------------------------------------
                //--------------------------------------------------------------------

                // Hide progress panel when research completes
                setShowProgressPanel(false);
                setIsImproving(false); // Termina el proceso de mejora
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
        // In case the report was sent in parts
        const fullReport = reportParts.join("\n");
        setFinalReport(fullReport);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: fullReport
        }]);
      }
    } catch (error) {
      console.error("Research error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lo sentimos, hubo un error al mejorar tu documento. Por favor, int\xE9ntalo de nuevo."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------

  const handleSubmit = async (userInput: string, config: {
    breadth: number;
    depth: number;
    modelId: string;
  }) => {
    if (!userInput.trim() || isLoading) return;

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "user",
      content: userInput
    }]);
    setIsLoading(true);
    if (stage === "initial") {
      // Add thinking message only for initial query
      setMessages(prev => [...prev, {
        id: "thinking",
        role: "assistant",
        content: "Procesando tu solicitud..."
      }]);

      // Handle the user's initial query
      setInitialQuery(userInput);
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: userInput,
            numQuestions: 1,
            modelId: config.modelId
          })
        });
        const data = await response.json();
        const questions: string[] = data.questions.questions || [];
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== "thinking");
          if (questions.length > 0) {
            const formattedQuestions = questions.map((q, index) => `${index + 1}. ${q}`).join("\n\n");
            return [...filtered, {
              id: Date.now().toString(),
              role: "assistant",
              content: `Por favor responda a estas sencillas preguntas para darle forma a su investigación:\n\n${formattedQuestions}`
            }];
          }
          return filtered;
        });
        setStage("feedback");

        // como ir actualizando
        setTotalTokens("+" + data.questions.tokens.totalTokens.toString());
        setNameChat("Tópico=>\n" + userInput + " ".slice(0, 10).replace(" ", "-"));
      } catch (error) {
        console.error("Feedback generation error:", error);
        setMessages(prev => [...prev.filter(m => m.id !== "thinking"), {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo sentimos, hubo un error al generar preguntas de retroalimentaci\xF3n. Por favor, int\xE9ntalo de nuevo."
        }]);
      } finally {
        setIsLoading(false);
      }
    } else if (stage === "feedback") {
      // In feedback stage, combine the initial query and follow-up answers
      const combined = `Initial Query: ${initialQuery}\nFollow-up Answers:\n${userInput}`;
      setStage("researching");
      try {
        await sendResearchQuery(combined, config);
      } finally {
        setIsLoading(false);
        // Reset the stage so further messages will be processed
        // setStage("improving");
        // Inform the user that a new research session can be started
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "\xA1Sesi\xF3n de investigaci\xF3n completada! Tu documento est\xE1 listo para revisi\xF3n."
        }]);
      }
      //-----------------------------------------------------------------------
    } else if (stage === "researching") {
      // In the improving stage, combine the initial document and follow-up requests
      const combined = `Initial Document: ${finalReport}\nFollow-up Improvments:\n${userInput}`;
      setStage("improving");
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        // Mantener el estado en "improving" para que el panel de investigación siga visible
        // Inform the user that a new research session can be started
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "\xA1Mejora completada! Puedes continuar realizando m\xE1s perfeccionamientos."
        }]);
      }
    } else if (stage === "improving") {
      // Permitir mejoras adicionales
      const combined = `Current Document: ${finalReport}\nAdditional Improvements:\n${userInput}`;
      try {
        await sendImprovments(combined, config);
      } finally {
        setIsLoading(false);
        // Mantener el estado en "improving"
        setMessages(prev => [{
          id: Date.now().toString(),
          role: "assistant",
          content: "\xA1Mejora aplicada! Puedes seguir refinando tu documento."
        }]);
      }
    }
  };

  // ---------------------------------------------------
  // La parte del RETURN -------------------------------
  // ---------------------------------------------------
  return <div className="flex w-full h-full relative">
      {/* Main container with dynamic width */}
      <motion.div className={`mx-auto flex flex-col h-full pt-10 ${hasStartedResearch || stage === "improving" ? "md:mr-0" : "md:mx-auto"}`} initial={{
      width: "100%",
      maxWidth: "800px"
    }} animate={{
      width: !isMobile && (hasStartedResearch || stage === "improving") ? "55%" : "100%",
      maxWidth: !isMobile && (hasStartedResearch || stage === "improving") ? "800px" : "800px"
    }} transition={{
      duration: 0.3,
      ease: "easeInOut"
    }}>
        {/* Messages Container - Hide completely when finalReport is available */}
        <div ref={containerRef} className={`${showProgress ? "hidden md:block" : "block"} ${finalReport ? "hidden" : "flex-1 overflow-y-auto"} relative`}>
          {/* Welcome Message (if no research started and no messages) */}
          {!hasStartedResearch && messages.length === 0 && <div className="absolute inset-0 flex items-center justify-center">
              <motion.div initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }} className="relative text-center space-y-4 p-4 md:p-12
                  before:absolute before:inset-0 
                  before:bg-gradient-to-b before:from-primary/[0.03] before:to-primary/[0.01]
                  before:rounded-[32px] before:blur-xl before:-z-10
                  after:absolute after:inset-0 
                  after:bg-gradient-to-br after:from-primary/[0.08] after:via-transparent after:to-primary/[0.03]
                  after:rounded-[32px] after:blur-md after:-z-20">
                <motion.div animate={{
              y: [-2, 2, -2],
              rotate: [-1, 1, -1]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }} className="relative">
                  <motion.div animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }} className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 
                      blur-2xl rounded-full -z-10" />
                </motion.div>

                <div className="space-y-2">
                  <motion.h2 initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.2
              }} className="text-base md:text-2xl font-semibold bg-clip-text text-transparent 
                      bg-gradient-to-r from-primary via-primary/90 to-primary/80">Investigación Profunda OnMMaTeX</motion.h2>

                  <motion.p initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }} className="text-xs md:text-base text-muted-foreground/80 max-w-[340px] mx-auto leading-relaxed">OnMMaTeX - Crea documentos académicos profesionales al instante.</motion.p>

                  <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.4
              }} className="pt-2">
                  </motion.div>
                </div>
              </motion.div>
            </div>}

          {/* Messages */}
          <div className="p-4 md:p-6 space-y-6">
            {messages.map(message => <PreviewMessage key={message.id} message={message} />)}

             {/* Research Progress Panel - Only show when in progress */}
             {showProgressPanel && <ResearchProgress progress={progress} isLoading={isLoading} />}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>



         {/* LaTeX Editor - Show when finalReport is available */}
         {finalReport && <div className="flex-1 w-full pt-10">
             <LaTeXEditorTxt 
              reportText={finalReport} 
              totalTokens={totalTokens ?? ''} 
              nameChat={nameChat ?? ''} 
              isOptionOne={isOptionOne}
              typeShort={typeShort}
              fileNameGit={fileName}
              />
           </div>}




        {/* Input - Fixed to bottom */}
        <div className="sticky bottom-0">

        {isLoading && !finalReport && <AtomWithCounter />}
        {isImproving && <AtomWithCounter />}

          <div className="p-4 md:p-6 mx-auto">
            <MultimodalInput onSubmit={handleSubmit} isLoading={isLoading} placeholder={stage === "initial" ? "\xBFQu\xE9 te gustar\xEDa investigar hoy? Refina tu pregunta para obtener m\xE1xima precisi\xF3n." : stage === "feedback" ? "Por favor, proporciona tus respuestas a las preguntas de seguimiento para resultados m\xE1s precisos..." : stage === "researching" ? "Investigaci\xF3n en progreso... Analizando fuentes acad\xE9micas." : stage === "improving" ? "\xBFQu\xE9 aspectos del documento te gustar\xEDa mejorar?" : "Escribe tu mensaje aqu\xED..."} />
          </div>
        </div>
      </motion.div>




      {/* Research Progress Panel */}
      <motion.div className={`
          pt-20 fixed md:relative
          inset-0 md:inset-auto
          bg-background md:bg-transparent
          md:w-[45%]
          ${showProgress ? "flex" : "hidden md:flex"}
          ${hasStartedResearch || stage === "improving" ? "md:flex" : "md:hidden"}
        `} initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} exit={{
      opacity: 0,
      x: 20
    }}>

      {/* El PDF */}
	    {finalReport && <
        CompileTxtButton2 
        reportText={finalReport} 
        totalTokens1={totalTokens ?? ''} 
        nameChat1={nameChat ?? ''}
        isOptionOne={isOptionOne}
        typeShort={typeShort}
        fileNameGit={fileName}
        />}

        
      </motion.div>




      {/* Mobile Toggle Button - Only show when research has started or improving */}
      {(hasStartedResearch || stage === "improving") && <button onClick={() => setShowProgress(!showProgress)} className={`
            md:hidden
            fixed
            bottom-24
            right-4
            z-50
            p-3
            bg-primary
            text-primary-foreground
            rounded-full
            shadow-lg
            transition-transform
            ${showProgress ? "rotate-180" : ""}
          `} aria-label="Toggle research progress">
          <PanelRightOpen className="h-5 w-5" />
        </button>}
    </div>;
}