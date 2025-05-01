import { NextResponse } from "next/server";
import { saveLatexDocument } from "@/prisma/db/latex-documents";

export async function POST(request: Request) {
  try {
    const { 
      nameChat, 
      content, 
      tokensUsed, 
      userId,
      typeShort,
      fileName } = await request.json();

    const document = await saveLatexDocument({
      nameChat,
      content,
      tokensUsed,
      userId,
      typeShort,
      fileName
    });

    return NextResponse.json({ message: "Entrada guardada exitosamente", document });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Error al guardar la entrada" }, { status: 500 });
  }
}