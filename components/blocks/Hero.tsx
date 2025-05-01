import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import hero from "@/public/landing/hero.svg";
import { heroUsers } from "@/config/landing-page-config";
import { getMetrics } from "@/config/landing-page-config";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default async function Hero() {
  const metrics = await getMetrics();

  // Lista de logos de tecnologías (puedes ajustar las rutas según tus imágenes)
  const techLogos = [
    "/providers/github.png",
    "/providers/og.png",
    "/providers/supabase.png",
    "/providers/wolfram.png",
    "/providers/openai.png",
    "/providers/nextjs.png",
    "/providers/jupyter.png",
    "/providers/latex.png",
    "/providers/latexonline.png",
    "/providers/frigade.png"
  ];

  return (
    <section className="container py-20 md:py-22">
      {/* Contenido principal */}
      <div className="grid lg:grid-cols-2 place-items-center gap-10">
        {/* Izquierda: Texto promocional */}
        <div className="text-center lg:text-start space-y-10">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="relative inline-block">
              <span className="inline bg-gradient-to-r from-[#f3e824] to-[#D247BF] text-transparent bg-clip-text">
                [on]MMaTeX
              </span>
              : Tu
              <div className="absolute -top-11 left-1/5 transform -translate-x-1/4 w-23 h-23 rounded-full bg-gradient-to-r from-pink-500 to-blue-900 flex items-center justify-center text-white text-sm font-bold border-2 border-white p-2">
                version 1
              </div>
            </h1>
            <span className="ml-2">Plataforma</span>
            <span className="ml-2">Inteligente</span>
            <span className="inline bg-gradient-to-r from-[#5eef6d] via-[#03a3d7] to-[#1048c1] text-transparent bg-clip-text">
              de Investigación
            </span>
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Revoluciona tus investigaciones académicas y profesionales con análisis
            profundo impulsado por IA. OnMMaTeX genera instantáneamente informes en
            LaTeX sobre cualquier tema—desde artículos científicos hasta análisis
            de mercado, matemáticas, química o ejercicios escolares—todo en formato
            PDF perfecto y listo para imprimir.
          </p>

          <Link href="/auth/login">
            <Button className="w-full md:w-1/3 bg-yellow-500 hover:bg-yellow-600 text-white">
              Comenzar a Investigar
            </Button>
          </Link>

          {/* Usuarios */}
          <div className="flex justify-center lg:justify-start ml-1 mt-6">
            {heroUsers.map((user, i) => (
              <Image
                key={i}
                className="h-10 w-10 -ml-2 my-auto object-cover rounded-full border-2 border-yellow-500"
                src={user.image}
                alt={user.alt}
              />
            ))}
            <p className="ml-4 my-auto text-lg text-yellow-500 font-semibold">
              Confiado por
              <span className="font-bold"> 435+ </span>
              académicos, investigadores y profesionales en todo el mundo
            </p>
          </div>
        </div>

        {/* Derecha: Imagen con logos */}
        <div className="hidden lg:flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <a
              href="https://github.com/josemramirez/onmmatex"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <FaGithub className="text-2xl" />
              <span>josemramirez/onmmatex</span>
              <span className="text-yellow-500">★ 47</span>
            </a>
            <iframe
              className="github-stars navigation-item"
              src="https://ghbtns.com/github-btn.html?user=josemramirez&repo=onmmatex&type=star&count=true"
              width="90px"
              height="20px"
            ></iframe>
            <a
              href="https://x.com/mmatex_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <FaTwitter className="text-2xl" />
              <span>Seguir</span>
            </a>
          </div>
          <Image src={hero} alt="" className="w-[500px] h-[500px]" />
        </div>
      </div>

      {/* Métricas distribuidas horizontalmente */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map(({ title, value, change, trend, description }) => (
            <Card key={title} className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-sm text-gray-500 uppercase">
                  {title}
                  <span className="text-black">{change}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{trend}</p>
                <p className="text-sm text-gray-400">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Banner animado de tecnologías */}
      <div className="mt-10 overflow-hidden">
        <h3 className="text-center text-lg font-semibold text-gray-600 mb-4">
          Powered By
        </h3>
        <div className="relative">
          <div className="flex animate-slide">
            {[...techLogos, ...techLogos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-6"
                style={{ width: "120px" }}
              >
                <Image
                  src={logo}
                  alt={`Tech logo ${index}`}
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}