// app/api/get-chatentries/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Singleton para PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(req: NextRequest) {
  try {
    // Obtener el userId de la query string
    const userId = req.nextUrl.searchParams.get('userId');

    console.log("======= Informacion del GET =======");
    console.log(userId);
    console.log("=============================================");

    // Validar userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
    }

    // Consultar las entradas en la base de datos
    const entries = await prisma.chatEntry.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        nameChat: true,
        content: true,
        fileName: true,
        typeShort: true,
        createdAt: true
      },
    });

    // Devolver las entradas en formato JSON
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las entradas:', error);
    return NextResponse.json({ error: 'Error al obtener las entradas' }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}