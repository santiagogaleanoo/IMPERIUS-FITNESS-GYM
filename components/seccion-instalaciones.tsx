"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, Zap, Heart } from "lucide-react"
import Link from "next/link"

// Servicios e instalaciones del gimnasio
const facilities = [
  {
    icon: Dumbbell,
    title: "Zona de Pesas",
    description:
      "Equipamiento profesional de última generación para todos los niveles",
    filter: "pesas",
  },
  {
    icon: Zap,
    title: "Área Funcional",
    description: "Espacio dedicado para entrenamiento funcional y CrossFit",
    filter: "funcional",
  },
  {
    icon: Users,
    title: "Rumba Terapia",
    description:
      "Zumba, Bailes, Coreografías y más con instructores certificados",
    filter: "clases",
  },
  {
    icon: Heart,
    title: "Zona Cardio",
    description: "Caminadoras, elípticas y bicicletas disponibles",
    filter: "cardio",
  },
]

export function FacilitiesSection() {
  return (
    <section
      id="instalaciones"
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{
        backgroundImage: "url('/fondos/grunge.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Capas de texturas */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ffffff08_50%,transparent_55%)] bg-[length:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[length:26px_26px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent" />

      {/* Difuminados arriba/abajo */}
      <div className="pointer-events-none absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/50" />
      <div className="pointer-events-none absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-transparent to-black/50" />

      <div className="relative z-10 container mx-auto px-4">

        {/* Encabezado */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-1 w-10 bg-primary" />
            <span className="text-primary font-semibold tracking-wider uppercase text-[11px] md:text-xs">
              Nuestras Instalaciones
            </span>
            <div className="h-1 w-10 bg-primary" />
          </div>

          <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
            TODO LO QUE <span className="text-primary">NECESITAS</span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto">
            Instalaciones de primer nivel con zonas diseñadas para tu máximo rendimiento.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">

          {facilities.map((facility, index) => {
            const Icon = facility.icon

            return (
              <Link key={index} href={`/galeria?filter=${facility.filter}`}>
                <Card className="border-yellow-600/30 hover:border-primary transition-all duration-300 group cursor-pointer bg-[#1a1a1a]/80 backdrop-blur-sm shadow-xl h-full">
                  <CardContent className="p-6 md:p-7">

                    {/* Ícono */}
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 md:mb-5 group-hover:bg-primary transition-colors">
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary group-hover:text-black transition-colors" />
                    </div>

                    {/* Título */}
                    <h3 className="font-bebas text-xl md:text-2xl mb-2 text-white">
                      {facility.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-300 text-[13px] md:text-sm leading-relaxed">
                      {facility.description}
                    </p>

                    {/* Enlace */}
                    <p className="text-primary text-xs md:text-sm mt-3 font-semibold">
                      Ver fotos →
                    </p>

                  </CardContent>
                </Card>
              </Link>
            )
          })}

        </div>
      </div>
    </section>
  )
}
