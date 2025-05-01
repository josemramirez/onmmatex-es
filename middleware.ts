import { auth } from "@/services/auth";
import {
  authRedirectTo,
  signOutRedirectTo,
  unauthRedirectTo,
} from "./config/auth-config";

export default auth((req) => {
  // Verificar si la solicitud es de Loader.io (solo para rutas de API)
  if (req.nextUrl.pathname.startsWith("/api")) {
    const loaderioKey = req.headers.get("x-loaderio-key");
    if (loaderioKey === "tu-clave-secreta-para-loaderio-123456") {
      return; // Permitir sin autenticación
    }
  }

  // Lógica existente para rutas de la aplicación
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL(unauthRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }

  if (
    (!req.auth || process.env.ADMIN_EMAIL !== req.auth.user?.email) &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    const redirectUrl = new URL(signOutRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }

  if (req.auth && req.nextUrl.pathname.startsWith("/auth/login")) {
    const redirectUrl = new URL(authRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Rutas de la aplicación
    "/api/:path*", // Incluir rutas de API
  ],
};