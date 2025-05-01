"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Image from "next/image";

interface WolframNotebookProps {
  onExecuteCode?: (code: string) => Promise<{ success: boolean; outputs?: Array<{ type: string; content: string }> }>;
}

interface Cell {
  id: number;
  code: string;
  outputs: Array<{ type: string; content: string }>;
}

export default function WolframNotebook({ onExecuteCode }: WolframNotebookProps) {
  const [cells, setCells] = useState<Cell[]>([
    { id: 1, code: "Solve[x^2-1==0, x]", outputs: [] },
    { id: 2, code: "", outputs: [] }, // Comienza con una celda vacía
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(3); // Ahora es parte del estado para evitar problemas

  const handleExecute = async (cellId: number) => {
    const cellIndex = cells.findIndex((cell) => cell.id === cellId);
    if (cellIndex === -1) return;

    const code = cells[cellIndex].code;
    if (!code.trim()) {
      toast("Por favor, ingresa un código para ejecutar", { type: "warning" });
      return;
    }

    setIsLoading(true);

    try {
      let data;
      if (onExecuteCode) {
        const response = await onExecuteCode(code);
        data = response;
      } else {
        const res = await fetch("/api/jupyter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        data = await res.json();
      }

      if (data.success && data.outputs) {
        const updatedCells = [...cells];
        updatedCells[cellIndex] = { ...updatedCells[cellIndex], outputs: data.outputs }; // Actualiza las salidas

        // Verifica si la última celda está vacía
        const lastCell = updatedCells[updatedCells.length - 1];
        const hasEmptyLastCell = lastCell.code === "" && lastCell.outputs.length === 0;

        if (!hasEmptyLastCell) {
          // Agrega una nueva celda vacía si la última no lo está
          updatedCells.push({ id: nextId, code: "", outputs: [] });
          setNextId(nextId + 1); // Incrementa el ID
        }

        setCells(updatedCells);
      } else {
        toast(`Error: ${data.error}`, { type: "error" });
      }
    } catch (error) {
      toast(`Error: ${error.message}`, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, cellId: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleExecute(cellId);
    }
  };

  const handleCodeChange = (cellId: number, newCode: string) => {
    setCells((prev) =>
      prev.map((cell) => (cell.id === cellId ? { ...cell, code: newCode } : cell))
    );
  };

  const handleClearCells = () => {
    setCells([
      { id: 1, code: "Solve[x^2-1==0, x]", outputs: [] },
      { id: 2, code: "", outputs: [] }, // Reinicia con una celda vacía
    ]);
    setNextId(3); // Reinicia el contador de IDs
    toast("Celdas limpiadas, excepto la primera", { type: "info" });
  };

  return (
    <div className="space-y-4">
      {cells.map((cell) => (
        <div key={cell.id} className="w-1/2">
          {/* Celda [In] */}
          <div className="flex items-center space-x-2">
            <span className="font-mono text-gray-600">[In]:</span>
            <Input
              key={`input-${cell.id}`} // Clave única para forzar re-renderizado
              value={cell.code}
              onChange={(e) => handleCodeChange(cell.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, cell.id)}
              placeholder={cell.id === 1 ? "Solve[x^2-1==0, x]" : ""} // Placeholder solo para la primera celda
              className="w-full"
              aria-label="Código Wolfram"
              disabled={isLoading}
            />
          </div>
          {/* Celda [Out] */}
          {cell.outputs.length > 0 && (
            <div className="flex items-start space-x-2 mt-2">
              <span className="font-mono text-gray-600">[Out]:</span>
              <div className="bg-white text-black p-2 rounded flex-1 border border-blue-900 border-2">
                {cell.outputs.map((output, index) => (
                  <div key={index}>
                    {output.type === "image" && (
                      <Image
                        src={output.content}
                        alt="Gráfico Wolfram"
                        width={500}
                        height={300}
                        className="max-w-full"
                      />
                    )}
                    {output.type === "text" && <pre className="bg-transparent">{output.content}</pre>}
                    {output.type === "error" && <pre className="text-red-600">{output.content}</pre>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex space-x-4">
        <Button
          onClick={() => {
            const lastNonEmptyCell = cells.slice(0, -1).findLast((cell) => cell.code !== "");
            if (lastNonEmptyCell) {
              handleExecute(lastNonEmptyCell.id);
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? "Ejecutando..." : "Ejecutar Código"}
        </Button>
        <Button onClick={handleClearCells} variant="outline" disabled={isLoading}>
          Limpiar Celdas
        </Button>
      </div>    

    </div>
  );
}