// lib/session.ts
import { auth } from "@/services/auth"; // Ajusta la ruta según tu estructura

export async function getUserSession() {
  const session = await auth();
  if (!session) {
    throw new Error("No hay sesión activa. El usuario no está autenticado.");
  }
  return session;
}
