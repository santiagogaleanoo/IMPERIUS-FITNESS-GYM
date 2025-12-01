"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { useState } from "react"

// Planes regulares
const regularMemberships = [
  {
    id: "membership-dia",
    name: "DÍA",
    price: 7000,
    description: "Perfecto para completar tu entrenamiento",
    image: "/imperius-logo-dia.png",
    features: ["Acceso al gimnasio por 1 día"],
    popular: false,
  },
  {
    id: "membership-semanal",
    name: "SEMANAL",
    price: 25000,
    description: "Una semana completa de entrenamiento",
    image: "/imperius-logo-semanal.png",
    features: [
      "Acceso al gimnasio por 7 días",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
    ],
    popular: false,
  },
  {
    id: "membership-quincenal",
    name: "QUINCENAL",
    price: 47000,
    description: "Dos semanas de entrenamiento intenso",
    image: "/imperius-logo-quincenal.png",
    features: [
      "Acceso al gimnasio por 15 días",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
    ],
    popular: false,
  },
  {
    id: "membership-mensual",
    name: "MENSUAL",
    price: 65000,
    description: "Entrena el musculo y relaja el bolsillo",
    image: "/imperius-logo-mensual.png",
    features: [
      "Acceso al gimnasio todo el mes",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
    ],
    popular: true,
  },
]

// Planes estudiantes
const studentMemberships = [
  {
    id: "membership-estudiante-quincenal",
    name: "QUINCENAL ESTUDIANTE",
    price: 37000,
    description: "Relaja tu mente entrenando tu musculo",
    image: "/imperius-logo-quincenal-estudiantes.png",
    features: [
      "Acceso al gimnasio por 15 días",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
      "Ahorras $10,000 vs plan regular",
    ],
    popular: false,
  },
  {
    id: "membership-estudiante-mensual",
    name: "MENSUAL ESTUDIANTE",
    price: 60000,
    description: "Plan perfecto para equilibrar mente y musculo",
    image: "/imperius-logo-mensual-estudiantes.png",
    features: [
      "Acceso al gimnasio todo el mes",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
      "Ahorras $5,000 vs plan regular",
    ],
    popular: true,
  },
]

// Interfaces
interface MembershipPlan {
  id: string
  name: string
  price: number
  description: string
  image: string
  features: string[]
  popular: boolean
}

export function MembershipsSection() {
  const [activeTab, setActiveTab] = useState("regulares")

  const generateWhatsAppMessage = (plan: MembershipPlan) => {
    const msg = `Hola! Estoy interesado en la membresía ${plan.name} de $${plan.price.toLocaleString(
      "es-CO",
    )}. ¿Podrían darme más información?`
    return `https://wa.me/573013770036?text=${encodeURIComponent(msg)}`
  }

  const renderMembershipCard = (plan: MembershipPlan) => {
    const whatsappUrl = generateWhatsAppMessage(plan)

    return (
      <Card
        key={plan.id}
        className="relative transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80 backdrop-blur-sm border border-yellow-600/30 shadow-2xl"
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-primary text-black px-3 py-0.5 rounded-full text-[11px] md:text-xs font-bold shadow-lg">
              MÁS POPULAR
            </span>
          </div>
        )}

        <CardHeader className="text-center pb-2 relative z-10">
          <CardTitle className="font-bebas text-2xl md:text-3xl text-white">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-gray-300 text-xs md:text-sm mb-1">
            {plan.description}
          </CardDescription>

          <span className="font-bebas text-3xl md:text-4xl text-white drop-shadow-lg">
            ${plan.price.toLocaleString("es-CO")}
          </span>
        </CardHeader>

        <CardContent className="pt-1 relative z-10">
          <img
            src={plan.image}
            alt={plan.name}
            className="w-full mb-2 rounded-lg h-52 md:h-64 object-contain"
          />

          <ul className="space-y-1 mt-0.5">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-[11px] md:text-xs">{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-4 relative z-10">
          <Button
            asChild
            className="w-full h-10 md:h-11 bg-primary text-black font-bold hover:bg-primary/90 transition-all shadow-lg"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              📱 Pedir Información
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section
      id="membresias"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/fondos/grunge.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-bebas text-4xl md:text-5xl text-white">
            ELIGE TU <span className="text-primary">MEMBRESÍA</span>
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* SOLO DOS TABS */}
          <TabsList className="grid grid-cols-2 w-full max-w-xl mx-auto mb-8 bg-black/40 backdrop-blur-sm border border-yellow-600/40 rounded-lg">
            <TabsTrigger value="regulares" className="text-xs md:text-sm text-gray-300 data-[state=active]:bg-primary data-[state=active]:text-black">
              Planes Regulares
            </TabsTrigger>

            <TabsTrigger value="estudiantes" className="text-xs md:text-sm text-gray-300 data-[state=active]:bg-primary data-[state=active]:text-black">
              Estudiantes
            </TabsTrigger>
          </TabsList>

          {/* REGULARES */}
          <TabsContent value="regulares" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {regularMemberships.map((plan) => renderMembershipCard(plan))}
            </div>
          </TabsContent>

          {/* ESTUDIANTES (CON EL MENSAJE VERDE) */}
          <TabsContent value="estudiantes" className="mt-6">
            {/* CAJA VERDE */}
            <div className="mb-6">
              <div className="bg-green-900/20 backdrop-blur-sm border border-green-600/40 rounded-lg p-4 md:p-5 text-center max-w-4xl mx-auto shadow-2xl">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  🎓 Planes Especiales para Estudiantes
                </h3>
                <p className="text-sm text-green-300 mb-1.5">
                  Disfruta de precios especiales diseñados para estudiantes.  
                  ¡Ahorra mientras te pones en forma!
                </p>
                <p className="text-xs text-green-400">
                  Se requiere presentar carnet estudiantil vigente al momento de la inscripción.
                </p>
              </div>
            </div>

            {/* LISTA DE PLANES */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {studentMemberships.map((plan) => renderMembershipCard(plan))}
            </div>

            <div className="text-center mt-5">
              <p className="text-gray-400 text-xs">
                * Los planes de estudiante requieren carnet vigente.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
