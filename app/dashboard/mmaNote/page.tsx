"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { TrendingUp, Send, Plus, Minus } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { FaGithub } from "react-icons/fa";
import xml2js from "xml2js";
import Image from "next/image";
import wolframLogo from "/public/providers/wolfram.png";
import { derivative, evaluate } from "mathjs";
import WolframNotebook from "@/components/plots/WolframNotebook";
// -----------------------------------------
// --- Para guardar los chats --------------
import { useSession } from 'next-auth/react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; 

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const defaultColors = ["#8884d8", "#82ca9d", "#ff7300", "#00c49f", "#ffbb28", "#ff8042"];

const initialChartData = [
  { "x": 0.0000, "y1": 1.0000, "y2": 0.0000 },
  { "x": 0.1283, "y1": 0.9919, "y2": 0.1279 },
  { "x": 0.2566, "y1": 0.9677, "y2": 0.2538 },
  { "x": 0.3850, "y1": 0.9277, "y2": 0.3759 },
  { "x": 0.5133, "y1": 0.8725, "y2": 0.4924 },
  { "x": 0.6416, "y1": 0.8027, "y2": 0.6018 },
  { "x": 0.7699, "y1": 0.7193, "y2": 0.7027 },
  { "x": 0.8982, "y1": 0.6235, "y2": 0.7937 },
  { "x": 1.0265, "y1": 0.5167, "y2": 0.8733 },
  { "x": 1.1549, "y1": 0.4005, "y2": 0.9407 },
  { "x": 1.2832, "y1": 0.2764, "y2": 0.9951 },
  { "x": 1.4115, "y1": 0.1461, "y2": 0.9898 },
  { "x": 1.5398, "y1": 0.0115, "y2": 0.9996 },
  { "x": 1.6681, "y1": -0.1253, "y2": 0.9920 },
  { "x": 1.7964, "y1": -0.2598, "y2": 0.9657 },
  { "x": 1.9248, "y1": -0.3894, "y2": 0.9211 },
  { "x": 2.0531, "y1": -0.5115, "y2": 0.8590 },
  { "x": 2.1814, "y1": -0.6242, "y2": 0.7810 },
  { "x": 2.3097, "y1": -0.7259, "y2": 0.6880 },
  { "x": 2.4380, "y1": -0.8149, "y2": 0.5817 },
  { "x": 2.5664, "y1": -0.8898, "y2": 0.4639 },
  { "x": 2.6947, "y1": -0.9492, "y2": 0.3367 },
  { "x": 2.8230, "y1": -0.9919, "y2": 0.2023 },
  { "x": 2.9513, "y1": -0.9998, "y2": 0.0638 },
  { "x": 3.0796, "y1": -0.9919, "y2": -0.0756 },
  { "x": 3.2079, "y1": -0.9677, "y2": -0.2126 },
  { "x": 3.3363, "y1": -0.9277, "y2": -0.3456 },
  { "x": 3.4646, "y1": -0.8725, "y2": -0.4723 },
  { "x": 3.5929, "y1": -0.8027, "y2": -0.5905 },
  { "x": 3.7212, "y1": -0.7193, "y2": -0.6984 },
  { "x": 3.8495, "y1": -0.6235, "y2": -0.7941 },
  { "x": 3.9779, "y1": -0.5167, "y2": -0.8763 },
  { "x": 4.1062, "y1": -0.4005, "y2": -0.9436 },
  { "x": 4.2345, "y1": -0.2764, "y2": -0.9957 },
  { "x": 4.3628, "y1": -0.1461, "y2": -0.9862 },
  { "x": 4.4911, "y1": -0.0115, "y2": -0.9998 },
  { "x": 4.6194, "y1": 0.1253, "y2": -0.9948 },
  { "x": 4.7478, "y1": 0.2598, "y2": -0.9700 },
  { "x": 4.8761, "y1": 0.3894, "y2": -0.9258 },
  { "x": 5.0044, "y1": 0.5115, "y2": -0.8632 },
  { "x": 5.1327, "y1": 0.6242, "y2": -0.7833 },
  { "x": 5.2610, "y1": 0.7259, "y2": -0.6878 },
  { "x": 5.3894, "y1": 0.8149, "y2": -0.5784 },
  { "x": 5.5177, "y1": 0.8898, "y2": -0.4572 },
  { "x": 5.6460, "y1": 0.9492, "y2": -0.3260 },
  { "x": 5.7743, "y1": 0.9919, "y2": -0.1874 },
  { "x": 5.9026, "y1": 0.9998, "y2": -0.0437 },
  { "x": 6.0310, "y1": 0.9919, "y2": 0.1020 },
  { "x": 6.1593, "y1": 0.9677, "y2": 0.2462 },
  { "x": 6.2876, "y1": 0.9277, "y2": 0.3753 },
];

interface ChartData {
  [key: string]: string | number;
}

export default function PlotEditorPage() {
  {/* Temas de sesion de usuario */}
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const posiblesTitulos = [
    "Ventas Mensuales",
    "Análisis Financiero",
    "Cálculos Avanzados",
    "Álgebra estricta",
    "Reporte Semestral",
    "Tarea de Mate",
    "Investigación profunda"
  ];
  
  const [documentTitle, setDocumentTitle] = useState<string>(() => {
    const indiceAleatorio = Math.floor(Math.random() * posiblesTitulos.length);
    return posiblesTitulos[indiceAleatorio];
  });

  // Definir los estados para caption y captionExplanation
  const [caption, setCaption] = useState<string>("Un caption para este grafico");
  const [captionExplanation, setCaptionExplanation] = useState<string>(
    "Explicación del Caption: En esta grafica podemos observar..."
  );

  
  const [chartDataInput, setChartDataInput] = useState<string>(JSON.stringify(initialChartData, null, 2));
  const [chartData, setChartData] = useState(initialChartData);
  const [fecha, setFecha] = useState("");

  const [xKey, setXKey] = useState<string>("x");
  const [yKeys, setYKeys] = useState<string[]>(["y1", "y2"]);

  const [xAxisName, setXAxisName] = useState("Eje X");
  const [yAxisName, setYAxisName] = useState("Visitas");
  const [axisFontSize, setAxisFontSize] = useState(16);
  const [lineWidth, setLineWidth] = useState(3);
  const [lineType, setLineType] = useState("solid");
  const [xTicks, setXTicks] = useState(10);
  const [yTicks, setYTicks] = useState(10);
  const [tickFontSize, setTickFontSize] = useState(16);
  const [paddingLeft, setPaddingLeft] = useState(30);
  const [paddingRight, setPaddingRight] = useState(30);
  const [paddingTop, setPaddingTop] = useState(30);
  const [paddingBottom, setPaddingBottom] = useState(30);
  const [backgroundColor, setBackgroundColor] = useState("#333333");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showLines, setShowLines] = useState<{ [key: string]: boolean }>({
    y1: true,
    y2: true,
  });
  const [legendXOffset, setLegendXOffset] = useState(15);
  const [legendYOffset, setLegendYOffset] = useState(15);
  const [xLabelOffset, setXLabelOffset] = useState(-12);
  const [yLabelOffset, setYLabelOffset] = useState(-12);
  const [path, setPath] = useState("imagen2.png");

  const [lineColors, setLineColors] = useState<{ [key: string]: string }>({
    y1: defaultColors[0],
    y2: defaultColors[1],
  });

  const [xMin, setXMin] = useState<number | null>(null);
  const [xMax, setXMax] = useState<number | null>(null);
  const [yMin, setYMin] = useState<number | null>(null);
  const [yMax, setYMax] = useState<number | null>(null);

  const [apiPrompt, setApiPrompt] = useState<string>("");


  const [prompts, setPrompts] = useState([
  { id: 1, value: "sin(x)" },
  { id: 2, value: "cos(x)" },
  ]);


  const [yCounter, setYCounter] = useState<number>(3); // Comienza en 3 porque ya tienes y1, y2, y3
  // Añade este estado al inicio de tu componente
  const [loadingIframe, setLoadingIframe] = useState(true);


  // Inicializar yCounter basado en las claves existentes
  useEffect(() => {
    setFecha(new Date().toLocaleString());
    setLoading(false);
    initializeAxisLimits();
  
    // Inicializar prompts y functionDefs con las funciones actuales
//    setPrompts([
//      { id: 1, value: "log(x)" },
//      { id: 2, value: "exp(x)" },
//    ]);
  
//    setFunctionDefs({
//      y3: "log10(x)", // Correspondiente a log(x)
//      y2: "exp(x)",   // Correspondiente a exp(x)
//    });
  
    // Establecer yCounter basado en el índice más alto existente
    const maxIndex = Math.max(
      ...Object.keys(functionDefs)
        .filter((key) => key.startsWith("y"))
        .map((key) => parseInt(key.replace("y", ""), 10)),
      0
    );
    setYCounter(maxIndex);
  }, [chartData, xKey, yKeys]);




  
  const [tempColumnNames, setTempColumnNames] = useState<{ [key: string]: string }>({});
  const [showZeroLine, setShowZeroLine] = useState(true); // Por defecto, la línea está visible
  // Nuevo estado para almacenar las funciones transformadas
  const [functionDefs, setFunctionDefs] = useState<{ [key: string]: string }>({});
  // Estado adicional para el valor temporal del input
  const [tempXMin, setTempXMin] = useState<string | null>(xMin !== null ? xMin.toString() : null);
  // Estado adicional para el valor temporal del input
  const [tempXMax, setTempXMax] = useState<string | null>(xMax !== null ? xMax.toString() : null);


  // Sincronizar tempXMin cuando xMin cambie (por ejemplo, desde otro lugar)
  useEffect(() => {
    setTempXMin(xMin !== null ? xMin.toString() : null);
  }, [xMin]);

  // Sincronizar tempXMax cuando xMax cambie (por ejemplo, desde otro lugar)
  useEffect(() => {
    setTempXMax(xMax !== null ? xMax.toString() : null);
  }, [xMax]);



  const [dataW, setDataW] = useState(null);
  const [errorW, setErrorW] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef([]);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [errorT, setErrorT] = useState(null);

  const chartRef = useRef<HTMLDivElement>(null);

  const isXNumeric = chartData.every((d) => !isNaN(Number(d[xKey])));

  const xValues = chartData.map((d) => Number(d[xKey])).filter((v) => !isNaN(v));
  const yValues = yKeys.flatMap((key) => chartData.map((d) => Number(d[key]))).filter((v) => !isNaN(v));
  const xMinLimit = xValues.length > 0 && isXNumeric ? Math.min(...xValues) : 0;
  const xMaxLimit = xValues.length > 0 && isXNumeric ? Math.max(...xValues) : (chartData.length > 0 ? chartData.length - 1 : 1);
  const yMinLimit = yValues.length > 0 ? Math.min(...yValues) : 0;
  const yMaxLimit = yValues.length > 0 ? Math.max(...yValues) : 1;

  const effectiveXMin = xMin !== null ? Math.max(xMinLimit, Math.min(xMin, xMaxLimit)) : xMinLimit;
  const effectiveXMax = xMax !== null ? Math.max(xMinLimit, Math.min(xMax, xMaxLimit)) : xMaxLimit;
  const effectiveYMin = yMin !== null ? Math.max(yMinLimit, Math.min(yMin, yMaxLimit)) : yMinLimit;
  const effectiveYMax = yMax !== null ? Math.max(yMinLimit, Math.min(yMax, yMaxLimit)) : yMaxLimit;



  const filteredChartData = chartData.filter((d) => {
    const xValue = Number(d[xKey]);
    // Incluir el punto si está en el rango de X y tiene al menos un valor válido
    return (
      xValue >= effectiveXMin &&
      xValue <= effectiveXMax &&
      yKeys.some((key) => d[key] !== null && isFinite(d[key]))
    );
  });



  const initializeAxisLimits = () => {
    if (xMin === null) setXMin(xMinLimit);
    if (xMax === null) setXMax(xMaxLimit);
    if (yMin === null) setYMin(yMinLimit);
    if (yMax === null) setYMax(yMaxLimit);
  };

  useEffect(() => {
    setFecha(new Date().toLocaleString());
    setLoading(false);
    initializeAxisLimits();
  }, [chartData, xKey, yKeys]);

  useEffect(() => {
    setXAxisName(xKey);
  }, [xKey]);

  const handleChartDataChange = (newValue: string) => {
    setChartDataInput(newValue);
    try {
      const parsedData = JSON.parse(newValue);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const keys = Object.keys(parsedData[0]);
        const isConsistent = parsedData.every((item) =>
          Object.keys(item).length === keys.length &&
          keys.every((key) => key in item)
        );
        if (!isConsistent) throw new Error("Los objetos en el arreglo no tienen las mismas claves");
        const yKeysToSet = keys.slice(1);
        const isYNumeric = yKeysToSet.every((key) =>
          parsedData.every((item) => !isNaN(Number(item[key])))
        );
        if (!isYNumeric) throw new Error("Las claves Y deben contener valores numéricos");
        setXKey(keys[0]);
        setYKeys(yKeysToSet);
        setShowLines(yKeysToSet.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        setChartData(parsedData);
      } else {
        throw new Error("El input no es un array válido");
      }
    } catch (error) {
      console.error("Error al parsear los datos:", error);
      toast(`Error en los datos: ${error.message}`, { type: "error" });
    }
  };

  useEffect(() => {
    setChartDataInput(JSON.stringify(chartData, null, 2));
  }, [chartData]);

  const handleTableChange = (index: number, key: string, value: string) => {
    const newData = [...chartData];
    if (key === xKey) {
      newData[index][key] = isNaN(Number(value)) ? value : Number(value);
    } else {
      newData[index][key] = Number(value);
    }
    setChartData(newData);
  };



  const handleColumnNameChange = (oldKey: string, newKey: string) => {
    // Evitar nombres vacíos o duplicados
    if (!newKey) {
      toast("El nombre de la columna no puede estar vacío", { type: "warning" });
      return;
    }
    if (newKey === oldKey || [xKey, ...yKeys].includes(newKey)) {
      toast("El nombre ya existe o no ha cambiado", { type: "warning" });
      return;
    }
  
    // Actualizar chartData
    setChartData((prevData) =>
      prevData.map((item) => {
        const { [oldKey]: value, ...rest } = item;
        return { ...rest, [newKey]: value };
      })
    );
  
    // Actualizar xKey o yKeys según corresponda
    if (oldKey === xKey) {
      setXKey(newKey);
    } else {
      setYKeys((prev) => prev.map((k) => (k === oldKey ? newKey : k)));
    }
  
    // Actualizar showLines
    setShowLines((prev) => {
      const { [oldKey]: value, ...rest } = prev;
      return { ...rest, [newKey]: value };
    });
  
    // Actualizar lineColors
    setLineColors((prev) => {
      const { [oldKey]: color, ...rest } = prev;
      return { ...rest, [newKey]: color };
    });
  
    toast(`Columna renombrada a ${newKey}`, { type: "success" });
  };

  const handleDownloadPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, {
        backgroundColor: backgroundColor,
        useCORS: true,
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = path || "imagen2.png";
        link.click();
      });
    }
  };

  const handleUploadToGitHub = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: backgroundColor,
        useCORS: true,
        scale: 2,
      });
      const base64Image = canvas.toDataURL("image/png").split(",")[1];
      const pathGit = path.startsWith("images/") ? path : `images/${path || "imagen2.png"}`; // Aseguramos que siempre sea images/...

      
      const response = await fetch("/api/upload-graphic-to-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image, path: pathGit, userId }),
      });

      const result = await response.json();

      if (result.exists) {
        const confirmOverwrite = window.confirm(result.message);
        if (confirmOverwrite) {
          const overwriteResponse = await fetch("/api/upload-graphic-to-github", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              base64Image, 
              path: pathGit, 
              sha: result.sha, 
              userId
             }),
          });
          const overwriteResult = await overwriteResponse.json();
          toast(
            overwriteResult.success
              ? "Gráfico actualizado correctamente."
              : "Error al actualizar el gráfico.",
            { type: overwriteResult.success ? "success" : "error" }
          );
        } else {
          toast("Operación cancelada.");
        }
      } else {
        toast(
          result.success ? "Gráfico subido correctamente." : "Error al subir el gráfico.",
          { type: result.success ? "success" : "error" }
        );
      }
    }
  };

  const calculateLegendPosition = () => {
    return {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      wrapperStyle: {
        right: `${legendXOffset}%`,
        top: `${legendYOffset}%`,
      },
    };
  };

  const getXTicks = () => {
    const minX = effectiveXMin;
    const maxX = effectiveXMax;
    const range = maxX - minX;
    const step = range / (xTicks - 1 || 1);
    return Array.from({ length: xTicks }, (_, i) => minX + i * step);
  };

  const getYDomain = () => {
    return [effectiveYMin, effectiveYMax];
  };

  const handleApiCall = async () => {
    const prompt = prompts[0]?.value || "";
    if (!prompt) {
      toast("Por favor, ingresa un prompt para la API", { type: "warning" });
      return;
    }
    try {
      const response = await fetch("/api/plotting-easy-v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: apiPrompt, 
          breadth: 1, 
          depth: 1, 
          modelId: "gpt-4o-mini" 
        }),
      });
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No se pudo leer el stream de la API");
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }
      const lines = result.split("\n").filter((line) => line.startsWith("data:"));
      const data = lines.map((line) => JSON.parse(line.replace("data: ", "")));
      const plotData = data.find((d) => d.type === "result")?.plot?.report;
      if (!plotData) throw new Error("No se encontraron datos válidos en la respuesta de la API");
      const newChartData = JSON.parse(plotData);
      setChartData(newChartData);
      setChartDataInput(JSON.stringify(newChartData, null, 2));
      toast("Gráfico actualizado desde la API", { type: "success" });
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      toast(`Error al generar el gráfico: ${error.message}`, { type: "error" });
    }
  };

  const EXCLUSION_THRESHOLD = 1e6;

  const detectSingularities = (func: (x: number) => number, xMin: number, xMax: number, numPoints: number): number[] => {
    const singularities: number[] = [];
    const step = (xMax - xMin) / (numPoints - 1 || 1);
    for (let i = 0; i < numPoints; i++) {
      const x = xMin + i * step;
      try {
        const y = func(x);
        if (Math.abs(y) > EXCLUSION_THRESHOLD || isNaN(y) || !isFinite(y)) {
          singularities.push(x);
        }
      } catch (err) {
        singularities.push(x);
      }
    }
    return singularities;
  };




  useEffect(() => {
    setFecha(new Date().toLocaleString());
    setLoading(false);
    initializeAxisLimits();
  
    // Inicializar functionDefs con las funciones iniciales
    setFunctionDefs({
      y1: "sin(x)",  // Asumimos que y1 es sin(x)
      y2: "cos(x)",  // Asumimos que y2 es cos(x)
    });
  }, [chartData, xKey, yKeys]);



  const fetchTranslation = async (prompt: string) => {
    try {
      const response = await fetch("/api/translate-easy-v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt, modelId: "gpt-4o-mini" }),
      });

      if (!response.ok) throw new Error("Error en la solicitud al API");

      const reader = response.body.getReader();
      if (!reader) throw new Error("No se pudo obtener el lector del stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;

            const event = JSON.parse(jsonStr);
            if (event.type === "result") {
              const translatedText = event.translate.report;
              setTranslatedText(translatedText);
              return translatedText;
            }
          }
        }
      }

      throw new Error("No se recibió el resultado de la traducción");
    } catch (err) {
      console.error("Error fetching translation:", err);
      setErrorT(err.message);
    }
  };

  const handleButtonClickW = (id: number) => {
    handleTrigonometricFunctions(id);
    fetchWolframData(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === "Enter") {
      handleButtonClickW(id);
    }
  };

  const fetchWolframData = async (id: number) => {
    try {
      const prompt = prompts.find((p) => p.id === id)?.value || "";
      const translatedText = await fetchTranslation(prompt);
      const input = translatedText || prompt;

      setLoading(true);
      const response = await fetch(`/api/wolfram-alpha?query=${encodeURIComponent(input)}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No se pudo obtener el lector del stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (part.startsWith("data: ")) {
            const jsonStr = part.substring(6).trim();
            if (!jsonStr) continue;

            const event = JSON.parse(jsonStr);
            if (event.type === "result") {
              const xml = event.result;
              console.log("XML recibido:", xml);

              const parser = new xml2js.Parser();
              const result = await new Promise((resolve, reject) => {
                parser.parseString(xml, (err, res) => {
                  if (err) reject(err);
                  else resolve(res);
                });
              });
              console.log("Datos parseados:", result);
              setDataW(result);
              setLoading(false);
              return;
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          }
        }
      }

      throw new Error("No se recibió el resultado de Wolfram Alpha");
    } catch (err) {
      console.error("Error al llamar a la API:", err.message);
      setErrorW(`Error al obtener los datos: ${err.message}`);
      setLoading(false);
    }
  };





  const removePrompt = (id: number) => {
    const promptIndex = prompts.findIndex((prompt) => prompt.id === id);
    if (promptIndex === -1) return;
  
    const newPrompts = prompts.filter((prompt) => prompt.id !== id);
    const reindexedPrompts = newPrompts.map((prompt, index) => ({
      ...prompt,
      id: index + 1,
    }));
    setPrompts(reindexedPrompts);
    toast(`Prompt eliminado`, { type: "success" });
  
    // Determinar la clave yKey asociada al prompt eliminado
    const keyToRemove = `y${promptIndex + 2}`; // Ajusta según cómo asignaste inicialmente y1, y2, y3
  
    // Eliminar la columna de chartData
    const newChartData = chartData.map((item) => {
      const { [keyToRemove]: _, ...rest } = item;
      return rest;
    });
  
    // Actualizar yKeys
    const newYKeys = yKeys.filter((key) => key !== keyToRemove);
  
    // Limpiar showLines
    const newShowLines = { ...showLines };
    delete newShowLines[keyToRemove];
  
    // Limpiar lineColors
    const newLineColors = { ...lineColors };
    delete newLineColors[keyToRemove];
  
    // Limpiar functionDefs
    const newFunctionDefs = { ...functionDefs };
    delete newFunctionDefs[keyToRemove];
  
    setChartData(newChartData);
    setYKeys(newYKeys);
    setShowLines(newShowLines);
    setLineColors(newLineColors);
    setFunctionDefs(newFunctionDefs);
    setChartDataInput(JSON.stringify(newChartData, null, 2));
    toast(`Curva ${keyToRemove} eliminada`, { type: "info" });
  };





  const addNewPrompt = () => {
    const newId = prompts.length + 1;
    setPrompts([...prompts, { id: newId, value: "" }]);
  };

  const handlePromptChange = (id: number, value: string) => {
    setPrompts(prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, value } : prompt
    ));
  };

  const pods = dataW?.queryresult?.pod || [];

  const handleRemoveColumn = (keyToRemove: string) => {
    if (keyToRemove === xKey) {
      toast("No puedes eliminar la columna del eje X", { type: "warning" });
      return;
    }

    const newChartData = chartData.map((item) => {
      const { [keyToRemove]: _, ...rest } = item;
      return rest;
    });

    const newYKeys = yKeys.filter((key) => key !== keyToRemove);
    const newShowLines = { ...showLines };
    delete newShowLines[keyToRemove];
    const newLineColors = { ...lineColors };
    delete newLineColors[keyToRemove];

    setChartData(newChartData);
    setYKeys(newYKeys);
    setShowLines(newShowLines);
    setLineColors(newLineColors);
    setChartDataInput(JSON.stringify(newChartData, null, 2));
    toast(`Columna ${keyToRemove} eliminada`, { type: "success" });
  };

  useEffect(() => {
    setChartDataInput(JSON.stringify(chartData, null, 2));
  }, [chartData, yKeys]);


  const handleTrigonometricFunctions = async (id: number) => {
    try {
      const inputRaw = prompts.find((p) => p.id === id)?.value || "";
      if (!inputRaw) return;
      let input = inputRaw.toLowerCase().trim();
  
      input = input
        .replace(/\s*de\s*/g, "")
        .replace(/logaritmo/g, "log")
        .replace(/seno/g, "sin")
        .replace(/coseno/g, "cos")
        .replace(/tangente/g, "tan");
  
      let finalFunction: (x: number) => number;
      let transformedPrompt: string = input;
  
      const derivativeRegex = /^(d\/dx|d|\bderivada\s*de)\s*(.+)$/i;
      const derivativeMatch = input.match(derivativeRegex);
      if (derivativeMatch) {
        const expr = derivativeMatch[2].trim();
        try {
          const deriv = derivative(expr, "x");
          transformedPrompt = deriv.toString();
          finalFunction = (x: number) => evaluate(transformedPrompt, { x });
        } catch (err) {
          throw new Error(`Error al calcular la derivada de "${expr}": ${err.message}`);
        }
      } else if (input.match(/^(\bint|\bintegral\s*de|\u222B)\s*(.+)$/i)) {
        throw new Error("Las integrales aún no están implementadas. Usa derivadas o expresiones por ahora.");
      } else {
        const trigRegex = new RegExp(
          "\\b(sin|seno|cos|coseno|cosin|tan|tangente|asin|arcsin" +
          "|arcos|arccos|atan|arctan|sinh|cosh|tanh|log|ln|exp|sqrt|raiz|abs)\\b",
          "i"
        );
  
        const functionMap: { [key: string]: string } = {
          sin: "sin", seno: "sin", cos: "cos", coseno: "cos",
          cosin: "cos", tan: "tan", tangente: "tan", asin: "asin",
          arcsin: "asin", acos: "acos", arccos: "acos", atan: "atan",
          arctan: "atan", sinh: "sinh", cosh: "cosh", tanh: "tanh",
          log: "log10", ln: "log", exp: "exp", sqrt: "sqrt",
          raiz: "sqrt", abs: "abs",
        };
  
        let trigFunction: string | null = null;
        let innerExpr: string | null = null;
  
        for (const key in functionMap) {
          if (input.includes(key)) {
            trigFunction = functionMap[key];
            const innerMatch = input.match(new RegExp(`${key}\\s*(?:de)?\\s*(.+)`));
            if (innerMatch) {
              innerExpr = innerMatch[1].trim().replace(/al\s*cuadrado/gi, "^2");
            }
            break;
          }
        }
  
        if (trigFunction) {
          if (innerExpr) {
            transformedPrompt = `${trigFunction}(${innerExpr})`;
            finalFunction = (x: number) => evaluate(transformedPrompt, { x });
          } else {
            transformedPrompt = `${trigFunction}(x)`;
            finalFunction = (x: number) => evaluate(transformedPrompt, { x });
          }
        } else {
          transformedPrompt = input;
          finalFunction = (x: number) => evaluate(transformedPrompt, { x });
        }
      }
  
      // Verificar si la función es un logaritmo y si el rango incluye valores negativos
      if ((transformedPrompt.includes("log") || transformedPrompt.includes("ln")) && effectiveXMin <= 0) {
        toast(
          `Advertencia: Las funciones logarítmicas (${inputRaw}) no están definidas para x ≤ 0. Los valores en ese rango se omitirán.`,
          { type: "warning" }
        );
      }
  
      const numPoints = chartData.length || 100;
      const singularities = detectSingularities(finalFunction, effectiveXMin, effectiveXMax, numPoints);
  
      if (singularities.length > 0) {
        toast(
          `Advertencia: Se excluyeron ${singularities.length} puntos singulares en x = [${singularities.map((x) => x.toFixed(2)).join(", ")}]`,
          { type: "warning" }
        );
      }
  
      const points = [];
      const step = (effectiveXMax - effectiveXMin) / (numPoints - 1 || 1);
  
      for (let i = 0; i < numPoints; i++) {
        const x = effectiveXMin + i * step;
        if (singularities.includes(x)) continue;
  
        try {
          let y;
          // Manejar el dominio del logaritmo
          if ((transformedPrompt.includes("log") || transformedPrompt.includes("ln")) && x <= 0) {
            y = null; // No graficar log(x) para x <= 0
          } else {
            y = finalFunction(x);
            if (Math.abs(y) > EXCLUSION_THRESHOLD || isNaN(y) || !isFinite(y)) {
              y = null;
              continue;
            }
            if (input.includes("tan") || input.includes("tangente")) {
              y = Math.abs(y) > 10 ? null : y;
            }
          }
          points.push({
            x: Number(x.toFixed(4)),
            y: y !== null ? Number(y.toFixed(4)) : y,
          });
        } catch (evalError) {
          points.push({
            x: Number(x.toFixed(4)),
            y: null,
          });
        }
      }
  
      const newYKey = `y${yKeys.length + 1}`;
      const newChartData = chartData.map((item, index) => ({
        ...item,
        [newYKey]: points[index]?.y,
      }));
  
      setFunctionDefs((prev) => ({
        ...prev,
        [newYKey]: transformedPrompt,
      }));
  
      setChartData(newChartData);
      setYKeys((prev) => [...prev, newYKey]);
      setShowLines((prev) => ({ ...prev, [newYKey]: true }));
      setLineColors((prev) => ({
        ...prev,
        [newYKey]: defaultColors[yKeys.length % defaultColors.length],
      }));
      setChartDataInput(JSON.stringify(newChartData, null, 2));
      toast(`Función ${inputRaw} agregada como ${newYKey}`, { type: "success" });
    } catch (error) {
      console.error("Error en handleTrigonometricFunctions:", error);
      toast(`Error al procesar la función: ${error.message}`, { type: "error" });
    }
  };



  const regenerateChartData = (newXMin: number, newXMax: number) => {
    if (newXMin >= newXMax) {
      toast("Xmin debe ser menor que Xmax", { type: "warning" });
      return;
    }
  
    const numPoints = 150;
    const step = (newXMax - newXMin) / (numPoints - 1 || 1);
    const newData: ChartData[] = [];
  
    // Verificar si alguna función es un logaritmo y si el rango incluye valores negativos
    const hasLogFunction = yKeys.some((key) => {
      const prompt = functionDefs[key];
      return prompt && (prompt.includes("log") || prompt.includes("ln"));
    });
  
    if (hasLogFunction && newXMin <= 0) {
      toast(
        "Advertencia: Las funciones logarítmicas (log(x), ln(x)) no están definidas para x ≤ 0. Ajusta el rango de x para graficar correctamente.",
        { type: "warning" }
      );
    }
  
    for (let i = 0; i < numPoints; i++) {
      const x = newXMin + i * step;
      const point: ChartData = { x: Number(x.toFixed(4)) };
  
      let hasValidValue = false;
      yKeys.forEach((key) => {
        let transformedPrompt = functionDefs[key];
  
        // Fallback: si no hay transformedPrompt en functionDefs, intenta obtenerlo de prompts
        if (!transformedPrompt) {
          const promptIndex = yKeys.indexOf(key);
          const rawPrompt = prompts[promptIndex]?.value?.toLowerCase().trim() || "";
          if (rawPrompt) {
            const trigRegex = new RegExp(
              "\\b(sin|seno|cos|coseno|cosin|tan|tangente|asin|arcsin" +
              "|arcos|arccos|atan|arctan|sinh|cosh|tanh|log|ln|exp|sqrt|raiz|abs)\\b",
              "i"
            );
  
            const functionMap: { [key: string]: string } = {
              sin: "sin", seno: "sin", cos: "cos", coseno: "cos",
              cosin: "cos", tan: "tan", tangente: "tan", asin: "asin",
              arcsin: "asin", acos: "acos", arccos: "acos", atan: "atan",
              arctan: "atan", sinh: "sinh", cosh: "cosh", tanh: "tanh",
              log: "log10", ln: "log", exp: "exp", sqrt: "sqrt",
              raiz: "sqrt", abs: "abs",
            };
  
            if (trigRegex.test(rawPrompt)) {
              transformedPrompt = rawPrompt;
              for (const term in functionMap) {
                const regex = new RegExp(`\\b${term}\\b`, 'g');
                transformedPrompt = transformedPrompt.replace(regex, functionMap[term]);
              }
              transformedPrompt = transformedPrompt.replace(/\s*de\s*/g, "");
              setFunctionDefs((prev) => ({
                ...prev,
                [key]: transformedPrompt,
              }));
            }
          }
        }
  
        if (transformedPrompt) {
          try {
            // Manejar el dominio del logaritmo
            if ((transformedPrompt.includes("log") || transformedPrompt.includes("ln")) && x <= 0) {
              point[key] = null; // No graficar log(x) para x <= 0
            } else {
              console.log(`Evaluando ${key} con prompt: ${transformedPrompt} en x=${x}`);
              const y = evaluate(transformedPrompt, { x });
              if (isFinite(y) && Math.abs(y) < EXCLUSION_THRESHOLD) {
                point[key] = Number(y.toFixed(4));
                hasValidValue = true;
              } else {
                point[key] = null;
              }
            }
          } catch (err) {
            console.error(`Error evaluando ${key}: ${err.message}`);
            toast(`Error en la función para ${key}: ${err.message}`, { type: "warning" });
            point[key] = null;
          }
        } else {
          point[key] = null;
        }
      });
  
      if (hasValidValue) newData.push(point);
    }
  
    if (newData.length === 0) {
      toast("No se generaron datos válidos para el rango seleccionado", { type: "warning" });
      return;
    }
  
    setChartData(newData);
    setChartDataInput(JSON.stringify(newData, null, 2));
    toast("Datos regenerados para el nuevo rango de X", { type: "success" });
  };

  const [engine, setEngine] = useState("Mathjs"); // Default to Mathjs
    // Define the handleToggle function to toggle between Mathjs and MMA
    const handleToggle = () => {
      setEngine((prev) => (prev === "Mathjs" ? "MMA" : "Mathjs"));
    };


  return (
    <div className="container py-10">
      <div className="flex items-center gap-4">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-emerald-500 rounded-md">
          v1.0
        </span>
        <h1 className="text-3xl font-bold">[mmatex] Editor de Gráficos</h1>
        <div className="ml-auto space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">Mathjs</span>
            <button
              onClick={handleToggle} // Now properly defined
              data-tour="toggle-engine"
              className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              style={{ backgroundColor: engine === "Mathjs" ? "#4f46e5" : "#10b981" }}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  engine === "Mathjs" ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">MMA</span>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle>
                  <Input
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="text-xl font-bold"
                    placeholder="Título del documento"
                  />
                </CardTitle>
                <CardDescription>Editor de datos para el gráfico</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">Última modificación: {fecha}</div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[30vh] w-full" />
              </div>
            ) : (
              <>
                {engine === "Mathjs" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 h-[30vh]">
                      <div className="border rounded-md overflow-hidden">
                        <textarea
                          value={chartDataInput}
                          onChange={(e) => handleChartDataChange(e.target.value)}
                          className="h-full w-full p-2"
                          placeholder="Escribe los datos del gráfico aquí en formato JSON..."
                        />
                      </div>
                      <div className="border rounded-md p-2 overflow-auto">
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-2 bg-gray-800 p-2 font-bold text-center text-white">
                          {[xKey, ...yKeys].map((key) => (
                            <div key={key} className="relative">
                              <Input
                                value={tempColumnNames[key] ?? key}
                                onChange={(e) =>
                                  setTempColumnNames((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleColumnNameChange(key, tempColumnNames[key] ?? key);
                                    setTempColumnNames((prev) => {
                                      const { [key]: _, ...rest } = prev;
                                      return rest;
                                    });
                                  }
                                }}
                                onBlur={() => {
                                  handleColumnNameChange(key, tempColumnNames[key] ?? key);
                                  setTempColumnNames((prev) => {
                                    const { [key]: _, ...rest } = prev;
                                    return rest;
                                  });
                                }}
                                className="text-center bg-gray-700 text-white"
                                placeholder="Nombre de columna"
                              />
                              {key !== xKey && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-0 right-0 h-4 w-4 p-0 text-white hover:bg-red-600"
                                  onClick={() => handleRemoveColumn(key)}
                                >
                                  <span>-</span>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        {chartData.map((data, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-2 p-2 border-b"
                          >
                            {[xKey, ...yKeys].map((key) => (
                              <Input
                                key={key}
                                type={key === xKey ? "text" : "number"}
                                value={data[key]}
                                onChange={(e) => handleTableChange(index, key, e.target.value)}
                                className="text-center"
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button onClick={addNewPrompt} className="mb-2" variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                      {prompts.map((prompt, index) => (
                        <div key={prompt.id} className="flex gap-2 mb-2 items-center">
                          <Input
                            value={prompt.value}
                            onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
                            placeholder="Escribe una función (ej: sin(x), log(x), exp(x))"
                            className="w-1/2"
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            onKeyDown={(e) => handleKeyDown(e, prompt.id)}
                          />
                          <Button onClick={() => handleButtonClickW(prompt.id)}>
                            <Send className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={() => removePrompt(prompt.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            disabled={prompts.length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {engine === "MMA" && <WolframNotebook />}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
        {/*    <Button variant="outline" onClick={() => console.log("Guardar cambios")} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}  
            </Button>*/}
          </CardFooter>
        </Card>





        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Línea</CardTitle>
            <CardDescription>Un subtitulo 2025</CardDescription>
          </CardHeader>
          <CardContent>






          <div className="relative" style={{ backgroundColor }}>
  <div ref={chartRef} style={{ backgroundColor }}>
    <ChartContainer config={{}}>
      <LineChart
        key={yKeys.join("-")}
        accessibilityLayer
        data={filteredChartData}
        margin={{ left: paddingLeft, right: paddingRight, top: paddingTop, bottom: paddingBottom }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          label={{ value: xAxisName, position: "insideBottom", offset: xLabelOffset, fontSize: axisFontSize }}
          tickLine={true}
          axisLine={true}
          tickMargin={8}
          tick={{ fill: "#ffffff", fontSize: tickFontSize }}
          type={isXNumeric ? "number" : "category"}
          domain={isXNumeric ? [effectiveXMin, effectiveXMax] : undefined}
          ticks={isXNumeric ? getXTicks() : undefined}
          tickFormatter={isXNumeric ? (value) => value.toFixed(1) : undefined}
        />
        <YAxis
          label={{ value: yAxisName, angle: -90, position: "insideLeft", offset: yLabelOffset, fontSize: axisFontSize }}
          stroke="#ffffff"
          tick={{ fontSize: tickFontSize }}
          domain={[effectiveYMin, effectiveYMax]}
          tickCount={yTicks}
          tickFormatter={(value) => value.toFixed(1)}
        />
        {showZeroLine && (
          <ReferenceLine
            y={0}
            stroke="#ffffff"
            strokeWidth={1}
            strokeDasharray="3 3" // Línea punteada para que se vea distinta
            label={{
              value: "y = 0",
              position: "insideTopRight",
              fill: "#ffffff",
              fontSize: 12,
            }}
          />
        )}
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        {yKeys.map((key, index) => (
          showLines[key] && (
            <Line
              key={key}
              dataKey={key}
              type="linear"
              stroke={lineColors[key] || defaultColors[index % defaultColors.length]}
              strokeWidth={lineWidth}
              strokeDasharray={lineType === "dashed" ? "5 5" : lineType === "dotted" ? "2 2" : "0"}
              dot={(props) => {
                const { payload, dataKey } = props;
                if (payload[dataKey] === null || !isFinite(payload[dataKey])) {
                  return null;
                }
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={lineColors[key] || defaultColors[index % defaultColors.length]}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                );
              }}
              connectNulls={false}
              name={key}
            />
          )
        ))}
        {showLegend && <Legend {...calculateLegendPosition()} />}
      </LineChart>
    </ChartContainer>
  </div>
  <div className="absolute top-2 right-2 flex flex-col gap-2">
    <Input
      value={path}
      onChange={(e) => setPath(e.target.value)}
      placeholder="Ruta del archivo (ej: imagen2.png)"
      className="w-48"
    />
    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUploadToGitHub}>
      <FaGithub className="h-5 w-5" />
      Subir a GitHub
    </Button>
  </div>
</div>








          </CardContent>



          <CardFooter className="flex justify-between items-center">
  <div className="flex items-start gap-4">

    {isXNumeric && (
      <div className="flex flex-col items-start gap-2 text-sm">
        <Label>Límite X</Label>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Xmin</Label>



          
<Input
  type="text" // Cambiado de number a text
  value={tempXMin ?? ""} // Mostrar tempXMin, o vacío si es null
  onChange={(e) => {
    setTempXMin(e.target.value); // Guardar la cadena tal cual mientras se escribe
  }}
  onBlur={(e) => {
    const value = e.target.value.trim();
    const parsedValue = value === "" ? null : Number(value);
    if (value !== "" && !isNaN(parsedValue)) {
      setXMin(parsedValue);
      setTempXMin(parsedValue.toString()); // Actualizar el valor mostrado
      regenerateChartData(parsedValue, xMax ?? xMaxLimit); // Regenerar el gráfico
    } else {
      setXMin(null);
      setTempXMin(null); // Permitir que el input quede vacío
      regenerateChartData(xMinLimit, xMax ?? xMaxLimit); // Usar el valor por defecto
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      const parsedValue = value === "" ? null : Number(value);
      if (value !== "" && !isNaN(parsedValue)) {
        setXMin(parsedValue);
        setTempXMin(parsedValue.toString()); // Actualizar el valor mostrado
        regenerateChartData(parsedValue, xMax ?? xMaxLimit); // Regenerar el gráfico
      } else {
        setXMin(null);
        setTempXMin(null); // Permitir que el input quede vacío
        regenerateChartData(xMinLimit, xMax ?? xMaxLimit); // Usar el valor por defecto
      }
    }
  }}
  className="w-24"
  placeholder="Xmin" // Placeholder directo
/>






          <Label className="text-xs">Xmax</Label>

<Input
  type="text" // Cambiado de number a text
  value={tempXMax ?? ""} // Mostrar tempXMax, o vacío si es null
  onChange={(e) => {
    setTempXMax(e.target.value); // Guardar la cadena tal cual mientras se escribe
  }}
  onBlur={(e) => {
    const value = e.target.value.trim();
    const parsedValue = value === "" ? null : Number(value);
    if (value !== "" && !isNaN(parsedValue)) {
      setXMax(parsedValue);
      setTempXMax(parsedValue.toString()); // Actualizar el valor mostrado
      regenerateChartData(xMin ?? xMinLimit, parsedValue); // Regenerar el gráfico
    } else {
      setXMax(null);
      setTempXMax(null); // Permitir que el input quede vacío
      regenerateChartData(xMin ?? xMinLimit, xMaxLimit); // Usar el valor por defecto
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      const parsedValue = value === "" ? null : Number(value);
      if (value !== "" && !isNaN(parsedValue)) {
        setXMax(parsedValue);
        setTempXMax(parsedValue.toString()); // Actualizar el valor mostrado
        regenerateChartData(xMin ?? xMinLimit, parsedValue); // Regenerar el gráfico
      } else {
        setXMax(null);
        setTempXMax(null); // Permitir que el input quede vacío
        regenerateChartData(xMin ?? xMinLimit, xMaxLimit); // Usar el valor por defecto
      }
    }
  }}
  className="w-24"
  placeholder="Xmax" // Placeholder directo
/>




        </div>
      </div>
    )}
  </div>



  <div className="flex-col items-start gap-8 text-sm">
      {/* Sección del caption */}
      <div className="flex gap-2 items-center font-medium leading-none">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full max-w-sm"
          placeholder="Escribe un caption..."
        />
        <TrendingUp className="h-4 w-4" />
      </div>
      {/* Sección de la explicación */}
      <div className="leading-none text-muted-foreground">
        <textarea
          value={captionExplanation}
          onChange={(e) => setCaptionExplanation(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full max-w-lg resize-y"
          rows={3}
          placeholder="Escribe una explicación..."
        />
      </div>
    </div>



  <Button variant="outline" onClick={handleDownloadPNG}>
    Descargar PNG
  </Button>
</CardFooter>










        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Personalizar Gráfico</CardTitle>
          </CardHeader>







          <CardContent>
  <div className="grid grid-cols-4 gap-4">
    <div>
      <Label>Nombre Eje X</Label>
      <Input value={xAxisName} onChange={(e) => setXAxisName(e.target.value)} />
    </div>
    <div>
      <Label>Nombre Eje Y</Label>
      <Input value={yAxisName} onChange={(e) => setYAxisName(e.target.value)} />
    </div>
    <div>
      <Label>Tamaño Fuente Ejes</Label>
      <Input type="number" value={axisFontSize} onChange={(e) => setAxisFontSize(Number(e.target.value))} />
    </div>
    <div>
      <Label>Grosor de Línea</Label>
      <Input type="number" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
    </div>
    <div>
      <Label>Tipo de Línea</Label>
      <Select value={lineType} onValueChange={setLineType}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solid">Sólida</SelectItem>
          <SelectItem value="dashed">Discontinua</SelectItem>
          <SelectItem value="dotted">Punteada</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Ticks Eje X</Label>
      <Input type="number" value={xTicks} onChange={(e) => setXTicks(Number(e.target.value))} />
    </div>
    <div>
      <Label>Ticks Eje Y</Label>
      <Input type="number" value={yTicks} onChange={(e) => setYTicks(Number(e.target.value))} />
    </div>
    <div>
      <Label>Tamaño Fuente Ticks</Label>
      <Input type="number" value={tickFontSize} onChange={(e) => setTickFontSize(Number(e.target.value))} />
    </div>
    <div>
      <Label>Padding Izquierda</Label>
      <Input type="number" value={paddingLeft} onChange={(e) => setPaddingLeft(Number(e.target.value))} />
    </div>
    <div>
      <Label>Padding Derecha</Label>
      <Input type="number" value={paddingRight} onChange={(e) => setPaddingRight(Number(e.target.value))} />
    </div>
    <div>
      <Label>Padding Arriba</Label>
      <Input type="number" value={paddingTop} onChange={(e) => setPaddingTop(Number(e.target.value))} />
    </div>
    <div>
      <Label>Padding Abajo</Label>
      <Input type="number" value={paddingBottom} onChange={(e) => setPaddingBottom(Number(e.target.value))} />
    </div>
    <div>
      <Label>Color de Fondo</Label>
      <Select value={backgroundColor} onValueChange={setBackgroundColor}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="white">Blanco (Claro)</SelectItem>
          <SelectItem value="#f0f0f0">Gris Intermedio</SelectItem>
          <SelectItem value="#333333">Gris Oscuro</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox checked={showGrid} onCheckedChange={setShowGrid} />
      <Label>Mostrar Grid</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox checked={showLegend} onCheckedChange={setShowLegend} />
      <Label>Mostrar Leyenda</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox checked={showZeroLine} onCheckedChange={setShowZeroLine} />
      <Label>Mostrar Línea y=0</Label>
    </div>
    {yKeys.map((key) => (
      <div key={key} className="flex items-center gap-2">
        <Checkbox
          checked={showLines[key]}
          onCheckedChange={(checked) => setShowLines((prev) => ({ ...prev, [key]: checked }))}
        />
        <Label>Mostrar {key}</Label>
      </div>
    ))}
    {yKeys.map((key) => (
      <div key={key} className="flex items-center gap-2">
        <Label>Color de {key}</Label>
        <Input
          type="color"
          value={lineColors[key]}
          onChange={(e) => setLineColors((prev) => ({ ...prev, [key]: e.target.value }))}
        />
      </div>
    ))}
    <div>
      <Label>Offset Eje X</Label>
      <Input type="number" value={xLabelOffset} onChange={(e) => setXLabelOffset(Number(e.target.value))} />
    </div>
    <div>
      <Label>Offset Eje Y</Label>
      <Input type="number" value={yLabelOffset} onChange={(e) => setYLabelOffset(Number(e.target.value))} />
    </div>
    <div>
      <Label>Offset X Leyenda (%)</Label>
      <Input type="number" value={legendXOffset} onChange={(e) => setLegendXOffset(Number(e.target.value))} />
    </div>
    <div>
      <Label>Offset Y Leyenda (%)</Label>
      <Input type="number" value={legendYOffset} onChange={(e) => setLegendYOffset(Number(e.target.value))} />
    </div>
  </div>
</CardContent>







        </Card>












        <Card>
          <CardHeader>
            <CardTitle>Wolfram Alpha</CardTitle>
            <CardDescription>{prompts.map((p) => p.value).join(", ")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative"
              style={{
                backgroundColor: "#314d52",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(9, 16, 41, 0.1)",
              }}
            >
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "24px",
                  marginBottom: "15px",
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <Image src={wolframLogo} width={34} height={34} alt="Logo de Wolfram" />
                Resultados de Wolfram Alpha: {prompts.map((p) => p.value).join(", ")}
              </h1>
              {pods.length > 0 ? (
                pods.map((pod, index) => <Pod key={index} pod={pod} />)
              ) : (
                <p
                  style={{
                    color: "#000000",
                    textAlign: "center",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  No hay pods disponibles para esta consulta.
                </p>
              )}
            </div>
          </CardContent>
        </Card>


        














      </div>
    </div>
  );
}

const Pod = ({ pod }) => {
  const title = pod.$.title;
  const subpods = pod.subpod || [];

  return (
    <div
      style={{
        marginBottom: "25px",
        border: "1px solid #444444",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <h2
        style={{
          color: "#000000",
          fontSize: "24px",
          marginBottom: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {title}
      </h2>
      {subpods.map((subpod, index) => (
        <Subpod key={index} subpod={subpod} />
      ))}
    </div>
  );
};

const Subpod = ({ subpod }) => {
  const img = subpod.img[0].$;
  const plaintext = subpod.plaintext ? subpod.plaintext[0] : "";

  return (
    <div style={{ marginTop: "15px" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          border: "2px solid #000000",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={img.src}
          alt={img.alt}
          title={img.title}
          width={img.width}
          height={img.height}
          style={{ maxWidth: "150%", height: "auto" }}
        />
      </div>
      {plaintext && (
        <p
          style={{
            marginTop: "10px",
            color: "#bbbbbb",
            fontSize: "14px",
            lineHeight: "1.5",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {plaintext}
        </p>
      )}
    </div>
  );
};