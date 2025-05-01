import type { Metadata } from "next";
import "./globals.css";

import { ChatProvider } from '@/components/context/ChatContext';
import { site } from "@/config/site-config";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@/components/blocks/ThemeProvider";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/services/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <ChatProvider>{children}</ChatProvider>
            <ToastContainer position="bottom-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
