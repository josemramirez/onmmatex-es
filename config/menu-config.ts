import { House, CreditCard, Users, Settings, 
  ShieldCheck, ChartBarBig, Headset, 
  MessageSquare, SquareTerminal, FilePlus2, ChartNoAxesCombinedIcon} from "lucide-react";

export const adminSidebarLinks = [{
  label: "Centro de Investigaci\xF3n",
  icon: House,
  url: "/admin"
}, {
  label: "Investigadores Activos",
  icon: CreditCard,
  url: "/admin/subscribers"
}, {
  label: "Equipos de Investigaci\xF3n",
  icon: Users,
  url: "/admin/users"
}, {
  label: "MMaTeXPlot",
  icon: ChartNoAxesCombinedIcon,
  url: "/dashboard/mmaNote"
},
 {
  label: "Jupyter",
  icon: SquareTerminal,
  //url: "https://notebook.mmatex.com/login?next=%2Flab&token=process.env.JUPYTER_TOKEN"
  url: "/dashboard/notebook"
},
{
  label: "Iniciar Nueva Investigaci\xF3n",
  icon: FilePlus2,
  url: "/dashboard/new-chat"
}];



export const userSidebarLinks = [{
  label: "Centro de An\xE1lisis",
  icon: House,
  url: "/dashboard"
}, {
  label: "Plan de Investigaci\xF3n",
  icon: CreditCard,
  url: "/dashboard/subscription"
}, {
  label: "Preferencias",
  icon: Settings,
  url: "/dashboard/settings"
}, {
  label: "MMaTeXPlot",
  icon: ChartNoAxesCombinedIcon,
  url: "/dashboard/mmaNote"
},{
  label: "Jupyter",
  icon: SquareTerminal,
  //url: "https://notebook.mmatex.com/login?next=%2Flab&token=process.env.JUPYTER_TOKEN"
  url: "/dashboard/notebook"
},
 {
  label: "Nuevo Proyecto",
  icon: FilePlus2,
  url: "/dashboard/new-chat"
}];



export const userProfileLinks = [{
  label: "Portal de Administraci\xF3n",
  icon: ShieldCheck,
  url: "/admin",
  isAdmin: true
}, {
  label: "M\xE9tricas de Rendimiento",
  icon: ChartBarBig,
  url: "/dashboard",
  isAdmin: false
}, {
  label: "Personalizaci\xF3n",
  icon: Settings,
  url: "/dashboard/settings",
  isAdmin: false
}, {
  label: "Asistencia de Investigaci\xF3n",
  icon: Headset,
  url: "https://x.com/mmatex_",
  isAdmin: false
}];