// app/api/save-chatentry/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'; // Importa NextResponse

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      // Obtén los datos del body con req.json()
      const { nameChat, content, tokensUsed, userId, typeShort, fileName 
       } = await req.json();
      //console.log("======= Informacion de los parametros =======")
      //console.log(nameChat)
      //console.log(content)
      //console.log(tokensUsed)
      //console.log(userId)
      //console.log("=============================================")
      // Ejecuta la transacción para guardar la entrada
      await prisma.$transaction(async (tx) => {
        await tx.chatEntry.create({
          data: {
            nameChat,
            content,
            tokensUsed,
            userId,
            typeShort,
            fileName
          },
        });
      });

      // Devuelve una respuesta con NextResponse
      return NextResponse.json({ message: 'Entrada guardada exitosamente' }, { status: 200 });
    } catch (error) {
      console.error('Error al guardar la entrada:', error);
      return NextResponse.json({ error: 'Error al guardar la entrada' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
  }
}