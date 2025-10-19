"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, Zap, Heart } from "lucide-react"
import Link from "next/link"

// Servicios e instalaciones del gimnasio
const facilities = [
  {
    icon: Dumbbell,
    title: "Zona de Pesas",
    description: "Equipamiento profesional de última generación para todos los niveles",
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
    description: "Zumba, Bailes, Coreografias y más con instructores certificados",
    filter: "clases",
  },
  {
    icon: Heart,
    title: "Zona Cardio",
    description: "Caminadoras, elípticas y bicicletas",
    filter: "cardio",
  },
]

export function FacilitiesSection() {
  return (
    <section id="instalaciones" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-primary" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Nuestras Instalaciones</span>
            <div className="h-1 w-12 bg-primary" />
          </div>
          <h2 className="font-bebas text-5xl md:text-7xl text-foreground mb-4 tracking-tight">
            TODO LO QUE <span className="text-primary">NECESITAS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instalaciones de primer nivel diseñadas para tu máximo rendimiento y comodidad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {facilities.map((facility, index) => {
            const Icon = facility.icon
            return (
              <Link key={index} href={`/galeria?filter=${facility.filter}`}>
                <Card className="border-border hover:border-primary transition-all duration-300 group cursor-pointer h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="font-bebas text-2xl mb-3 text-card-foreground">{facility.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
                    <p className="text-primary text-sm mt-4 font-semibold">Ver fotos →</p>
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
