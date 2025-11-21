"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { useState } from "react"

// Planes regulares (disponibles para todos)
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
    features: ["Acceso al gimnasio por 7 días", "Jueves: Funcional", "Viernes: Rumba terapia"],
    popular: false,
  },
  {
    id: "membership-quincenal",
    name: "QUINCENAL",
    price: 47000,
    description: "Dos semanas de entrenamiento intenso",
    image: "/imperius-logo-quincenal.png",
    features: ["Acceso al gimnasio por 15 días", "Jueves: Funcional", "Viernes: Rumba terapia"],
    popular: false,
  },
  {
    id: "membership-mensual",
    name: "MENSUAL",
    price: 65000,
    description: "Entrena el musculo y relaja el bolsillo",
    image: "/imperius-logo-mensual.png",
    features: ["Acceso al gimnasio todo el mes", "Jueves: Funcional", "Viernes: Rumba terapia"],
    popular: true,
  },
]

// Planes para estudiantes (ahora son planes regulares sin verificación)
const studentMemberships = [
  {
    id: "membership-estudiante-quincenal",
    name: "QUINCENAL ESTUDIANTE",
    price: 37000,
    description: "Relaja tu mente entrenado tu musculo",
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

// Planes especiales
const specialMemberships = [
  {
    id: "membership-gratis",
    name: "DÍA GRATUITO",
    price: 0,
    description: "Prueba nuestras instalaciones sin compromiso",
    image: "/imperius-logo-gratis.png",
    features: ["Acceso al gimnasio por 1 día", "Conoce nuestras instalaciones"],
    popular: false,
    isFree: true,
  },
  {
    id: "membership-personalizado",
    name: "ENTRENAMIENTO PERSONALIZADO",
    price: 300000,
    description: "Máximo rendimiento con atención personalizada",
    image: "/imperius-logo-personalizado.png",
    features: [
      "Todo lo del plan Mensual",
      "Entrenamiento personalizado",
      "Plan nutricional completo",
      "Evaluaciones mensuales",
      "Seguimiento personalizado",
    ],
    popular: false,
  },
]

// Interfaces para TypeScript
interface MembershipPlan {
  id: string
  name: string
  price: number
  description: string
  image: string
  features: string[]
  popular: boolean
  isFree?: boolean
}

export function MembershipsSection() {
  const [activeTab, setActiveTab] = useState("regulares")

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (plan: MembershipPlan) => {
    const message = `Hola! Estoy interesado en la membresía ${plan.name} de $${plan.price.toLocaleString("es-CO")}. ¿Podrían darme más información?`
    return `https://wa.me/573013770036?text=${encodeURIComponent(message)}`
  }

  // Función para renderizar una tarjeta de membresía
  const renderMembershipCard = (plan: MembershipPlan) => {
    const whatsappUrl = generateWhatsAppMessage(plan)

    return (
      <Card
        key={plan.id}
        className={`relative transition-all duration-300 hover:shadow-xl ${
          plan.popular ? "border-primary border-2 shadow-xl" : "border-border hover:border-primary"
        }`}
      >
        {/* Badge de "Más Popular" */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
              MÁS POPULAR
            </span>
          </div>
        )}

        <CardHeader className="text-center pb-2">
          <CardTitle className="font-bebas text-4xl mb-1">{plan.name}</CardTitle>
          <CardDescription className="text-base mb-1">{plan.description}</CardDescription>
          <div className="mt-1 mb-0">
            {plan.isFree ? (
              <span className="font-bebas text-6xl text-primary">GRATIS</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-bebas text-6xl text-foreground">${plan.price.toLocaleString("es-CO")}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <img
            src={plan.image || "/placeholder.svg"}
            alt={`${plan.name} logo`}
            className={`w-full mb-2 rounded-lg ${
              plan.isFree || plan.name.includes("PERSONALIZADO")
                ? "h-64 object-contain"
                : "h-[22rem] object-contain"
            }`}
          />
          
          {/* Lista de características */}
          <ul className="space-y-1 mt-0.5">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-4">
          <Button
            asChild
            className="w-full h-14 text-lg font-bold transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📱 Pedir Información
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section id="membresias" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-primary" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Planes y Precios</span>
            <div className="h-1 w-12 bg-primary" />
          </div>
          <h2 className="font-bebas text-5xl md:text-7xl text-foreground mb-4 tracking-tight">
            ELIGE TU <span className="text-primary">MEMBRESÍA</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sin contratos largos. Cancela cuando quieras. Todos los planes incluyen acceso completo.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 h-14">
            <TabsTrigger value="regulares" className="text-base font-semibold">
              Planes Regulares
            </TabsTrigger>
            <TabsTrigger value="estudiantes" className="text-base font-semibold">
              Estudiantes
            </TabsTrigger>
            <TabsTrigger value="especiales" className="text-base font-semibold">
              Planes Especiales
            </TabsTrigger>
          </TabsList>

          {/* Tab de planes regulares */}
          <TabsContent value="regulares" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 max-w-7xl mx-auto">
              {regularMemberships.map((plan) => renderMembershipCard(plan))}
            </div>
          </TabsContent>

          {/* Tab de planes para estudiantes - SIMPLIFICADO */}
          <TabsContent value="estudiantes" className="mt-8">
            {/* Banner informativo */}
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🎓 Planes Especiales para Estudiantes</h3>
                <p className="text-green-700 mb-2">
                  Disfruta de precios especiales diseñados para estudiantes. ¡Ahorra mientras te pones en forma!
                </p>
                <p className="text-sm text-green-600">
                  Solo necesitas tu carnet estudiantil vigente al momento de la inscripción.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {studentMemberships.map((plan) => renderMembershipCard(plan))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                * Los planes de estudiante requieren presentar carnet estudiantil vigente al momento de la inscripción
              </p>
            </div>
          </TabsContent>

          {/* Tab de planes especiales */}
          <TabsContent value="especiales" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {specialMemberships.map((plan) => renderMembershipCard(plan))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}