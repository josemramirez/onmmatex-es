import { auth } from "@/services/auth"; // Ajusta la ruta según tu proyecto
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  let response;

  try {
    // Verificar la sesión del usuario
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Leer el cuerpo como texto para inspeccionarlo
    const bodyText = await request.text();
    console.log("Cuerpo recibido:", bodyText); // Para depuración

    // Verificar si el cuerpo está vacío
    if (!bodyText) {
      return NextResponse.json({ error: "Cuerpo de la solicitud vacío" }, { status: 400 });
    }

    // Intentar parsear el JSON
    const { totalTokens, userInput } = JSON.parse(bodyText);

    // Validar que los campos necesarios estén presentes
    if (!totalTokens || !userInput) {
      return NextResponse.json({ error: "Faltan campos requeridos: totalTokens o userInput" }, { status: 400 });
    }

    // Ejecutar la lógica de la base de datos en una transacción
    const result = await prisma.$transaction(async (tx) => {
      let chatEntry = await tx.chatEntry.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (!chatEntry) {
//        chatEntry = await tx.chatEntry.create({
//          data: {
//            userId,
//            content: userInput.slice(0, 10),
//            tokensUsed: parseInt(totalTokens) || 0,
//            nameChat: `Tópico=>${userInput.slice(0, 10).replace(" ", "-")}`,
//          },
//        });
      console.log('No salvamos aqui!');
      } else {
        await tx.chatEntry.update({
          where: { id: chatEntry.id },
          data: { tokensUsed: parseInt(totalTokens) || 0 },
        });
      }

      const user = await tx.user.update({
        where: { id: userId },
        data: { totalTokens: { increment: parseInt(totalTokens) || 0 }
      , totalSaldo: { decrement: parseInt(totalTokens)*(0.01/1000) || 0 } },
        select: { totalTokens: true, totalSaldo: true },
      });

      return { totalTokens: user.totalTokens, totalSaldo: user.totalSaldo};
    });

    // Respuesta exitosa
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // Manejo de errores
    console.error("Error en update-tokens:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON inválido en el cuerpo de la solicitud" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar tokens" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Cerrar conexión de Prisma
  }
}