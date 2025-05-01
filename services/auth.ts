import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/connect";
import Resend from "next-auth/providers/resend";
import { unauthRedirectTo } from "@/config/auth-config";

// Definir las opciones de autenticación
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Resend({
      from: "[on]MMaTeX <onboarding@onboarding.mmatex.com>",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true, // Aquí va la opción trustHost
  callbacks: {
    jwt({ token, session, trigger }) {
      if (trigger === "update") {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          id: token.sub,
        },
      };
    },
  },
  pages: {
    signIn: unauthRedirectTo,
  },
};

// Exportar las funciones de NextAuth con las opciones
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
