"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { adminSidebarLinks, userSidebarLinks } from "@/config/menu-config";
import NavRecentChats from "@/components/dashboard/nav-recent-chats";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { MailPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react"; // Asumiendo que usas NextAuth

type MobileSideBarProps = {
  isAdminMode?: boolean;
};

const MobileSidebar = ({ isAdminMode }: MobileSideBarProps) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
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

      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
