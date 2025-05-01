"use client";

import { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, MessageSquare, Trash2, BookOpenCheck } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatContext } from "@/components/context/ChatContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Chat {
  id: string;
  name: string;
  url: string;
  urlI: string;
  urlIadvan: string;
  icon: React.ComponentType;
}

const NavRecentChats = () => {
  const { chats, setChats, isLoading, error } = useChatContext();
  const [visibleChats, setVisibleChats] = useState<Chat[]>([]);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const chatAbriendoNotify = () => toast("[3s] Procesando PDF...");
  const chatBorradoNotify = () => toast("[3s] PDF borrado!");
  const chatsPerPage = 3;

// Memoriza la lista completa de chats formateados
const formattedChats = useMemo(() => {
  return chats.map((entry: any, index: number) => ({
    id: entry.id,
    name: entry.nameChat || "Chat sin título",
    url: `/dashboard/recent-chats/${entry.id}`,
    urlI: `/dashboard/recent-chats/${index}`, // Usa id consistentemente
    urlIadvan: `${index}`, // Usa id consistentemente
    icon: MessageSquare,
  }));
}, [chats]);

  useEffect(() => {
    if (chats.length > 0) {
      setVisibleChats(formattedChats.slice(0, page * chatsPerPage));
    } else {
      setVisibleChats([]);
    }
  }, [chats, page, formattedChats]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handleLoadLess = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error("No se encontró el userId");
      return;
    }

    try {
      const response = await fetch(
        `/api/delete-chatentries?userId=${encodeURIComponent(
          userId
        )}&chatId=${encodeURIComponent(chatId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el chat");
      }

      // Actualizar el estado local filtrando por id
      setChats(chats.filter((chat) => chat.id !== chatId));
      chatBorradoNotify();
      console.log(`Chat ${chatId} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el chat:", error);
    }
  };

  const hasMore = visibleChats.length < chats.length;
  const hasLess = page > 1;

  if (isLoading) return <div><i className="fas fa-spinner fa-spin"></i> Cargando chats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Investigaciones Recientes</SidebarGroupLabel>
      <SidebarMenu>
        {visibleChats.map((item) => (
          <SidebarMenuItem key={item.id}> {/* Usar id como key */}
            <SidebarMenuButton asChild>
              <Link href={item.urlI} onClick={chatAbriendoNotify}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
              
            </SidebarMenuButton>
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <SidebarMenuAction showOnHover>
      <MoreHorizontal />
      <span className="sr-only">Más</span>
    </SidebarMenuAction>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-48 rounded-lg" side="right" align="end">



    <DropdownMenuItem asChild>
      <Link href={`/dashboard/advancedEditor/${item.urlIadvan}`}>
        <BookOpenCheck className="text-muted-foreground" />
        <span> Abrir con Editor Avanzado </span>
      </Link>
    </DropdownMenuItem>



    <DropdownMenuItem onClick={() => handleDeleteChat(item.id)}>
      <Trash2 className="text-muted-foreground" />
      <span>Borrar Proyecto</span>
    </DropdownMenuItem>



  </DropdownMenuContent>
</DropdownMenu>
          </SidebarMenuItem>
        ))}
        {hasLess && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLoadLess} className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Menos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLoadMore} className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Más</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavRecentChats;