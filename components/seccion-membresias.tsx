"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { useState } from "react"
import { ProductQuickView } from "./vista-rapida-producto"

// Planes regulares (disponibles para todos)
const regularMemberships = [
  {
    id: "membership-dia",
    name: "DÍA",
    price: 7000,
    description: "Perfecto para probar nuestras instalaciones",
    image: "/imperius-logo-dia.png",
    features: ["Acceso al gimnasio por 1 día"],
    popular: false,
  },
  {
    id: "membership-semanal",
    name: "SEMANAL",
    price: 25000,
    description: "Una semana completa de entrenamiento",
    image: "/imperius-logo-semanal.png", // Actualizar imagen del plan semanal
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
    description: "La opción más popular para resultados serios",
    image: "/imperius-logo-mensual.png",
    features: ["Acceso al gimnasio todo el mes", "Jueves: Funcional", "Viernes: Rumba terapia"],
    popular: true,
  },
]

// Planes para estudiantes (requieren carnet estudiantil)
const studentMemberships = [
  {
    id: "membership-estudiante-quincenal",
    name: "QUINCENAL ESTUDIANTE",
    price: 37000,
    description: "Plan especial para estudiantes con carnet vigente",
    image: "/imperius-logo-quincenal-estudiantes.png", // Actualizar imágenes de planes de estudiantes
    features: [
      "Acceso al gimnasio por 15 días",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
      "Requiere carnet estudiantil",
    ],
    popular: false,
    isStudent: true,
  },
  {
    id: "membership-estudiante-mensual",
    name: "MENSUAL ESTUDIANTE",
    price: 60000,
    description: "Plan mensual con descuento para estudiantes",
    image: "/imperius-logo-mensual-estudiantes.png", // Actualizar imágenes de planes de estudiantes
    features: [
      "Acceso al gimnasio todo el mes",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
      "Requiere carnet estudiantil",
    ],
    popular: true,
    isStudent: true,
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

export function MembershipsSection() {
  const [selectedMembership, setSelectedMembership] = useState<any>(null)
  const [showQuickView, setShowQuickView] = useState(false)

  // Función para manejar la selección de un plan
  const handleSelectPlan = (plan: any) => {
    setSelectedMembership({
      id: plan.id,
      name: `Membresía ${plan.name}`,
      price: plan.price,
      type: "membership" as const,
      category: "Membresía",
      description: plan.description,
      features: plan.features,
      image: plan.image,
    })
    setShowQuickView(true)
  }

  // Función para renderizar una tarjeta de membresía
  const renderMembershipCard = (plan: any) => (
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

      <CardHeader className="text-center pb-2"> {/* antes estaba pb-4 */}
  <CardTitle className="font-bebas text-4xl mb-1">{plan.name}</CardTitle> {/* antes mb-3 */}
  <CardDescription className="text-base mb-1">{plan.description}</CardDescription> {/* agregado mb-1 */}
  <div className="mt-1 mb-0"> {/* reduje el margin-top y eliminé el extra */}
    {plan.isFree ? (
      <span className="font-bebas text-6xl text-primary">GRATIS</span>
    ) : (
      <div className="flex flex-col items-center">
        <span className="font-bebas text-6xl text-foreground">${plan.price.toLocaleString("es-CO")}</span>
      </div>
    )}
  </div>
</CardHeader>

<CardContent className="pt-1"> {/* antes pt-4 */}
  <img
    src={plan.image || "/placeholder.svg"}
    alt={`${plan.name} logo`}
    className={`w-full mb-2 rounded-lg ${  // antes mb-4
      plan.isFree || plan.name.includes("PERSONALIZADO")
        ? "h-64 object-contain"
        : plan.isStudent
          ? "h-72 object-contain"
          : "h-[22rem] object-contain" /* antes era 28rem */
    }`}
  />
  {/* Lista de características */}
  <ul
  className={`space-y-1 ${
    plan.isStudent || plan.isFree || plan.name.includes("PERSONALIZADO")
      ? "mt-4"
      : "mt-0.5"
  }`}
> {/* reduje espacios entre items */}
    {plan.features.map((feature: string, index: number) => (
      <li key={index} className="flex items-start gap-2">
        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <span className="text-foreground text-sm">{feature}</span>
      </li>
    ))}
  </ul>
</CardContent>

      <CardFooter className="pt-4">
        {/* Botón especial para plan gratuito (abre WhatsApp) */}
        {plan.isFree ? (
          <Button
            asChild
            className="w-full h-14 text-lg font-bold transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a
              href="https://wa.me/573013770036?text=Hola!%20Estoy%20interesado%20en%20probar%20un%20d%C3%ADa%20gratuito%20en%20su%20gym.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n?"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir Información
            </a>
          </Button>
        ) : (
          <Button
            onClick={() => handleSelectPlan(plan)}
            className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
              plan.popular
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Seleccionar Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <>
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

          <Tabs defaultValue="regulares" className="w-full">
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

            {/* Tab de planes para estudiantes */}
            <TabsContent value="estudiantes" className="mt-8">
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

      {/* Modal de vista rápida del producto/membresía */}
      <ProductQuickView product={selectedMembership} open={showQuickView} onOpenChange={setShowQuickView} />
    </>
  )
}
