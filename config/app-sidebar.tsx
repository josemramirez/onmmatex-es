"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "OnMMaTeX",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  teams: [{
    name: "Centro de Investigaci\xF3n",
    logo: GalleryVerticalEnd,
    plan: "Enterprise"
  }, {
    name: "Suite Acad\xE9mica",
    logo: AudioWaveform,
    plan: "Startup"
  }, {
    name: "Investigaci\xF3n Pro",
    logo: Command,
    plan: "Free"
  }],
  navMain: [{
    title: "Laboratorio de Investigaci\xF3n",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [{
      title: "Historial de Investigaciones",
      url: "#"
    }, {
      title: "Informes Guardados",
      url: "#"
    }, {
      title: "Preferencias",
      url: "#"
    }]
  }, {
    title: "Modelos de IA",
    url: "#",
    icon: Bot,
    items: [{
      title: "Investigaci\xF3n G\xE9nesis",
      url: "#"
    }, {
      title: "Explorador Profundo",
      url: "#"
    }, {
      title: "An\xE1lisis Cu\xE1ntico",
      url: "#"
    }]
  }, {
    title: "Centro de Ayuda",
    url: "#",
    icon: BookOpen,
    items: [{
      title: "Gu\xEDa de Inicio R\xE1pido",
      url: "#"
    }, {
      title: "Fundamentos de Investigaci\xF3n",
      url: "#"
    }, {
      title: "T\xE9cnicas Avanzadas",
      url: "#"
    }, {
      title: "Registro de Actualizaciones",
      url: "#"
    }]
  }, {
    title: "Configuraci\xF3n",
    url: "#",
    icon: Settings2,
    items: [{
      title: "Ajustes de Investigaci\xF3n",
      url: "#"
    }, {
      title: "Colaboraci\xF3n",
      url: "#"
    }, {
      title: "Suscripci\xF3n",
      url: "#"
    }, {
      title: "M\xE9tricas de Uso",
      url: "#"
    }]
  }],
  projects: [{
    name: "Investigaci\xF3n STEM",
    url: "#",
    icon: Frame
  }, {
    name: "An\xE1lisis de Negocios",
    url: "#",
    icon: PieChart
  }, {
    name: "Proyectos Acad\xE9micos",
    url: "#",
    icon: Map
  }]
};
export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>;
}