"use client";

import Link from "next/link";
import Logo from "../blocks/Logo";
import { adminSidebarLinks, userSidebarLinks } from "@/config/menu-config";
import { usePathname } from "next/navigation";
import NavRecentChats from "@/components/dashboard/nav-recent-chats";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MailPlus } from "lucide-react";
import { signIn } from "next-auth/react"; // Asumiendo que usas NextAuth

type SideBarProps = {
  isAdminMode?: boolean;
};

const Sidebar = ({ isAdminMode }: SideBarProps) => {
  const pathName = usePathname();
  const links = isAdminMode ? adminSidebarLinks : userSidebarLinks;
  const [invitationsLeft, setInvitationsLeft] = useState(5);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendInvitation = async () => {
    if (!email || invitationsLeft <= 0) {
      setError("Please enter a valid email or no invitations left.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Crear un FormData similar al que usas en onSignInWithLink
      const formData = new FormData();
      formData.append("email", email);
      // Opcional: Agregar un campo para personalizar el enlace o mensaje
      formData.append(
        "callbackUrl",
        "https://mmatex.com" // Cambia por tu URL real
      );

      // Usar signIn con Resend para enviar el email
      const result = await signIn("resend", {
        email,
        redirect: false, // Evitar redirección automática
        callbackUrl: "https://mmatex.com", // URL de la invitación
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Si el email se envió correctamente, disminuir el contador
      setInvitationsLeft((prev) => prev - 1);
      setEmail("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      setError(error.message || "Failed to send invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-24 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-2">
          <nav className="w-40 grid items-start px-6 text-sm font-medium lg:px-4">
            {links.map(({ label, icon, url }, i) => {
              const Icon = icon;
              return (
                <Link
                  key={i}
                  href={url}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathName === url ? "bg-muted" : null
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </Link>
              );
            })}
            {/* Botón de invitación */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="relative mt-2 flex items-center gap-2 text-muted-foreground hover:text-primary"
                  disabled={invitationsLeft <= 0}
                >
                  <MailPlus className="h-4 w-4" />
                  Invitar
                  {invitationsLeft > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {invitationsLeft}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mandar Invitación</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    onClick={handleSendInvitation}
                    disabled={isLoading || !email}
                  >
                    {isLoading ? "Sending..." : "Mandar Invitación"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
          {/* Los Chats Recientes */}
          <SidebarProvider>
            <NavRecentChats />
          </SidebarProvider>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;