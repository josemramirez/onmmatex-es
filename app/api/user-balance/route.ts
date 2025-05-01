// app/api/user-balance/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Singleton para PrismaClient (evita múltiples instancias en desarrollo)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(req: NextRequest) {
  try {
    // Obtener el userId de los parámetros de la query string
    const userId = req.nextUrl.searchParams.get('userId');

    // Log para debugging
    console.log("=== Solicitud de balance de usuario ===");
    console.log("UserID solicitado:", userId);
    console.log("=====================================");

    // Validar que se proporcionó un userId válido
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { error: 'Se requiere un userId válido' },
        { status: 400 }
      );
    }

    // Consultar la base de datos para obtener totalTokens y totalSaldo
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        totalTokens: true,  // Número entero que representa los tokens del usuario (default: 0)
        totalSaldo: true,   // Valor decimal que representa el saldo monetario (default: 10.00)
      },
    });

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Devolver la respuesta con los valores encontrados
    return NextResponse.json(
      {
        totalTokens: user.totalTokens,  // Cantidad de tokens disponibles
        totalSaldo: user.totalSaldo,    // Saldo en formato decimal
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores con logging
    console.error('Error al obtener balance del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar la solicitud' },
      { status: 500 }
    );
  } finally {
    // Desconectar Prisma en desarrollo para evitar conexiones abiertas
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}