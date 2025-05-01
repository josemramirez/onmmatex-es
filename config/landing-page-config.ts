// NAVBAR
export const navbarLinks = [{
  title: "Precios",
  url: "#pricing"
}, {
  title: "Caracter\xEDsticas",
  url: "#features"
}, {
  title: "Testimonios",
  url: "#testimonials"
}, {
  title: "Preguntas Frecuentes",
  url: "#faq"
}];

// HERO
import user1 from "@/public/landing/user_1.jpeg";
import user2 from "@/public/landing/user_2.jpeg";
import user3 from "@/public/landing/user_3.jpeg";
import user4 from "@/public/landing/user_4.jpeg";
import user5 from "@/public/landing/user_5.jpeg";
export const heroUsers = [{
  image: user1,
  alt: "user1"
}, {
  image: user2,
  alt: "user2"
}, {
  image: user3,
  alt: "user3"
}, {
  image: user4,
  alt: "user4"
}, {
  image: user5,
  alt: "user5"
}];

// FEATURES
import offline from "@/public/landing/offline.svg";
import git from "@/public/landing/git.svg";
import editor from "@/public/landing/editor.svg";
import pdf from "@/public/landing/pdf.svg";
export const features = [{
  icon: offline,
  title: "Motor de Investigaci\xF3n Avanzada",
  description: "Accede a investigaciones completas sobre cualquier tema, desde ciencia hasta finanzas, con nuestro potente motor de b\xFAsqueda impulsado por IA. [on]MMaTeX entrega informaci\xF3n precisa y detallada al instante."
}, {
  icon: git,
  title: "Excelencia Acad\xE9mica",
  description: "Perfecto para estudiantes e investigadores que abordan temas complejos en matem\xE1ticas, biolog\xEDa, qu\xEDmica y f\xEDsica. [on]MMaTeX transforma conceptos dif\xEDciles en informes claros y concisos."
}, {
  icon: editor,
  title: "Informes PDF Profesionales",
  description: "Genera documentos PDF listos para publicaci\xF3n con formato LaTeX perfecto, incluyendo ecuaciones, citas y gr\xE1ficos\u2014sin necesidad de conocimientos de LaTeX."
}, {
  icon: pdf,
  title: "Asistente de Investigaci\xF3n Interactivo",
  description: "Nuestra IA gu\xEDa tu investigaci\xF3n con preguntas aclaratorias, garantizando resultados precisos adaptados a tus necesidades espec\xEDficas, desde an\xE1lisis de mercado hasta consultas cient\xEDficas."
}];

// TESTIMONIALS
export const testimonials = [{
  image: "https://i.pravatar.cc/150?img=45",
  name: "Dra. Emily Davis",
  userName: "@emily_d",
  comment: "[on]MMaTeX revolucion\xF3 mi flujo de trabajo de publicaci\xF3n acad\xE9mica. \xA1Recib\xED una revisi\xF3n bibliogr\xE1fica completa para mi art\xEDculo de neurociencia en minutos en lugar de semanas!"
}, {
  image: "https://i.pravatar.cc/150?img=68",
  name: "Prof. Michael Brown",
  userName: "@mike_brown",
  comment: "Como profesor de finanzas, estoy impresionado por la profundidad del an\xE1lisis de mercado que proporciona [on]MMaTeX. Mis estudiantes ahora crean informes de calidad profesional que impresionar\xEDan a los analistas de Wall Street."
}, {
  image: "https://i.pravatar.cc/150?img=38",
  name: "Sophia Johnson",
  userName: "@sophia_j",
  comment: "Las capacidades de investigaci\xF3n de [on]MMaTeX han transformado mi proceso de tesis doctoral. Encuentra conexiones entre fuentes que habr\xEDa pasado por alto y las presenta en documentos con formato impecable."
}, {
  image: "https://i.pravatar.cc/150?img=25",
  name: "David Wilson",
  userName: "@david_w",
  comment: "Como consultor de marketing digital, conf\xEDo en [on]MMaTeX para crear informes estrat\xE9gicos basados en datos para mis clientes. La IA encuentra perspectivas en m\xFAltiples plataformas que a mi equipo le llevar\xEDa d\xEDas recopilar."
}, {
  image: "https://i.pravatar.cc/150?img=15",
  name: "Olivia Mart\xEDnez",
  userName: "@olivia_m",
  comment: "Mis estudiantes de secundaria utilizan [on]MMaTeX para resolver problemas complejos de qu\xEDmica y f\xEDsica. Las explicaciones paso a paso en los informes generados han mejorado dr\xE1sticamente su comprensi\xF3n y calificaciones."
}, {
  image: "https://i.pravatar.cc/150?img=29",
  name: "James Taylor",
  userName: "@james_t",
  comment: "Como analista del mercado burs\xE1til, [on]MMaTeX me da una ventaja competitiva. Sintetiza datos financieros de m\xFAltiples fuentes en informes coherentes y accionables que encantan a mis clientes."
}];

// PRICING
export const packages = [{
  title: "Explorador",
  popular: 0,
  price: 0,
  priceId: "",
  mode: "free",
  description: "Perfecto para estudiantes e individuos que buscan asistencia en investigaci\xF3n. Accede a nuestro motor de investigaci\xF3n impulsado por IA para proyectos acad\xE9micos y personales.",
  button: "Comienza ya y pruebalo!",
  services: [{
    support: 1,
    name: "Capacidades B\xE1sicas de Investigaci\xF3n"
  }, {
    support: 1,
    name: "20 Informes Mensuales"
  }, {
    support: 0,
    name: "Exportaci\xF3n a PDF"
  }, {
    support: 0,
    name: "Profundidad de Investigaci\xF3n Est\xE1ndar"
  }, {
    support: 0,
    name: "Soporte por Email"
  }]
}, {
  title: "Acad\xE9mico Pro",
  popular: 1,
  price: 4.99,
  priceId: process.env.NODE_ENV === "production" ? "price_1RABXWBO3RpV9ttzA5goILPK" : process.env.PRICE_ID_ACADEMIC,
  mode: "subscription",
  description: "Dise\xF1ado para acad\xE9micos y profesionales que requieren capacidades de investigaci\xF3n en profundidad para art\xEDculos, informes y an\xE1lisis.",
  button: "Comienza",
  services: [{
    support: 1,
    name: "Motor de Investigaci\xF3n Avanzado"
  }, {
    support: 1,
    name: "100 Informes Mensuales"
  }, {
    support: 1,
    name: "Formato PDF Mejorado"
  }, {
    support: 1,
    name: "Capacidades de Investigaci\xF3n Profunda"
  }, {
    support: 0,
    name: "Soporte Prioritario"
  }]
}, {
  title: "Nobel Prize",
  popular: 0,
  price: 29,
  priceId: process.env.NODE_ENV === "production" ? "price_1RABYQBO3RpV9ttzbQmA1O2c" : process.env.PRICE_ID_RESEARCH_PRO,
  mode: "subscription",
  description: "Para equipos de investigaci\xF3n, empresas e instituciones que requieren las capacidades de investigaci\xF3n m\xE1s completas y caracter\xEDsticas premium.",
  button: "Muchos modelos de I.A, muchas ideas!",
  services: [{
    support: 1,
    name: "Investigaci\xF3n de Nivel Empresarial"
  }, {
    support: 1,
    name: "Informes Ilimitados"
  }, {
    support: 1,
    name: "Opciones de Marca Personalizada"
  }, {
    support: 1,
    name: "M\xE1xima Profundidad de Investigaci\xF3n"
  }, {
    support: 1,
    name: "Gestor de Cuenta Dedicado"
  }]
}];

// FAQs
export const FAQs = [{
  question: "\xBFC\xF3mo realiza [on]MMaTeX sus investigaciones?",
  answer: "[on]MMaTeX utiliza IA avanzada para buscar y analizar informaci\xF3n de m\xFAltiples fuentes confiables en internet, sintetizando los hallazgos en informes coherentes y bien estructurados adaptados a tu consulta espec\xEDfica.",
  value: "item-1"
}, {
  question: "\xBFNecesito conocer LaTeX para usar [on]MMaTeX?",
  answer: "\xA1En absoluto! [on]MMaTeX maneja autom\xE1ticamente todo el formato LaTeX. Simplemente ingresa tu pregunta de investigaci\xF3n, y el sistema genera documentos PDF bellamente formateados con ecuaciones, citas y formato adecuados.",
  value: "item-2"
}, {
  question: "\xBFQu\xE9 tipos de temas puede investigar [on]MMaTeX?",
  answer: "[on]MMaTeX destaca en la investigaci\xF3n de una amplia gama de temas, desde materias acad\xE9micas como matem\xE1ticas, biolog\xEDa, qu\xEDmica y f\xEDsica hasta campos profesionales como marketing digital, an\xE1lisis del mercado burs\xE1til y estrategia empresarial.",
  value: "item-3"
}, {
  question: "\xBFQu\xE9 tan detallados son los informes generados por [on]MMaTeX?",
  answer: "Los informes suelen tener 1-2 p\xE1ginas de informaci\xF3n concentrada de alta calidad. Los planes Acad\xE9mico e Investigaci\xF3n Pro ofrecen capacidades de investigaci\xF3n m\xE1s profundas para an\xE1lisis m\xE1s completos, con opciones para solicitar detalles adicionales en secciones espec\xEDficas.",
  value: "item-4"
}, {
  question: "\xBFPuedo editar los informes despu\xE9s de que se generan?",
  answer: "\xA1Absolutamente! Puedes solicitar cambios espec\xEDficos a trav\xE9s de nuestra interfaz de chat interactiva. Pide a\xF1adir secciones, eliminar contenido o reorientar la investigaci\xF3n, y [on]MMaTeX regenerar\xE1 tu PDF con las modificaciones solicitadas.",
  value: "item-5"
}];

// FOOTER
export const footer = [{
  title: "Enlaces",
  links: [{
    url: "/#pricing",
    name: "Precios"
  }
  //      { url: "/documentation", name: "Documentation" },
  //      { url: "/support", name: "Support" },
  //      { url: "/roadmap", name: "Roadmap" },
  ]
}, {
  title: "Redes Sociales",
  links: [{
    url: "https://github.com/josemramirez/onmmatex",
    name: "GitHub"
  }, {
    url: "https://x.com/mmatex_",
    name: "X.com"
  }
  //      { url: "#", name: "LinkedIn" },
  ]
}
//  {
//    title: "Legal",
//    links: [
//      { url: "/terms", name: "Terms and Conditions" },
//      { url: "/policy", name: "Privacy Policy" },
//    ],
//  },
//  {
//    title: "Contribute",
//    links: [
//      { url: "/contribute", name: "Contribute" },
//      { url: "/issues", name: "Report Issues" },
//    ],
//  },
];

// En @/config/landing-page-config.js o directamente en Hero.js

import { getTotalRevenue, getNewResearchers, getActiveAccounts, getGrowthRate } from "@/prisma/db/users"; // Ajusta la ruta según tu estructura


export const getMetrics = async () => {
  try {
    const [totalRevenue, newResearchers, activeAccounts, growthRate] = await Promise.all([
      getTotalRevenue(),
      getNewResearchers(),
      getActiveAccounts(),
      getGrowthRate(),
    ]);

    return [
      totalRevenue,
      newResearchers,
      activeAccounts,
      growthRate,
    ];
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    // Opcional: devolver métricas por defecto si hay error
    return [
      {
        title: "Ingresos Totales",
        value: "$0.00",
        change: "+0%",
        trend: "Sin datos",
        description: "Visitantes de los últimos 6 meses",
      },
      {
        title: "Nuevos Investigadores",
        value: "0",
        change: "+0%",
        trend: "Sin datos",
        description: "La adquisición necesita poca atención",
      },
      {
        title: "Cuentas Activas",
        value: "0",
        change: "+0%",
        trend: "Sin datos",
        description: "El compromiso supera los objetivos",
      },
      {
        title: "Tasa de Crecimiento",
        value: "0.0%",
        change: "+0%",
        trend: "Sin datos",
        description: "Cumple con las proyecciones de crecimiento",
      },
    ];
  }
};
