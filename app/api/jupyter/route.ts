import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch("https://tu_wolfram/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Error HTTP: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Transformar la respuesta al formato esperado
    const mappedData = {
      success: true,
      outputs: [
        {
          type: "text",
          content: data.result.trim(), // Eliminar el salto de línea extra (\n)
        },
      ],
    };
    return NextResponse.json(mappedData);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
