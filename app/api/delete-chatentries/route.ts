// app/api/delete-chatentry/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Obtener userId y chatId de los parámetros de la URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const chatId = url.searchParams.get('chatId');

    // Validar que se hayan proporcionado ambos parámetros
    if (!userId || !chatId) {
      return NextResponse.json({ error: 'Se requieren userId y chatId' }, { status: 400 });
    }

// Validar que chatId sea un número
const chatIdNum = Number(chatId);
if (isNaN(chatIdNum)) {
  return NextResponse.json({ error: 'chatId inválido' }, { status: 400 });
}

// Verificar que el chat pertenece al usuario
const chat = await prisma.chatEntry.findFirst({
  where: {
    id: chatIdNum,
    userId: userId,
  },
});

if (!chat) {
  return NextResponse.json({ error: 'Chat no encontrado o no autorizado' }, { status: 404 });
}

// Eliminar el chat
await prisma.chatEntry.delete({
  where: {
    id: chatIdNum,
  },
});

    return NextResponse.json({ message: 'Chat eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el chat:', error);
    return NextResponse.json({ error: 'Error al eliminar el chat' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}