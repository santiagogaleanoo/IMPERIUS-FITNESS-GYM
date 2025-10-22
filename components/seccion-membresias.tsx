"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, RefreshCw, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { ProductQuickView } from "./vista-rapida-producto"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { VerificacionEstudianteDialog } from "@/components/dialogo-verificacion-estudiante"
import { AuthDialog } from "@/components/dialogo-autenticacion" 
import { useToast } from "@/hooks/use-toast"

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
    description: "Entrena el muaculo y relaja el bolsillo ",
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
    description: "Relaja tu mente entrenado tu musculo",
    image: "/imperius-logo-quincenal-estudiantes.png",
    features: [
      "Acceso al gimnasio por 15 días",
      "Jueves: Funcional",
      "Viernes: Rumba terapia",
      "Requiere carnet estudiantil vigente",
      "Máximo grado 11",
      "Ahorras $10,000 vs plan regular",
    ],
    popular: false,
    isStudent: true,
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
      "Requiere carnet estudiantil vigente",
      "Máximo grado 11",
      "Ahorras $5,000 vs plan regular",
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

// Interfaces para TypeScript
interface MembershipPlan {
  id: string
  name: string
  price: number
  description: string
  image: string
  features: string[]
  popular: boolean
  isStudent?: boolean
  isFree?: boolean
}

export function MembershipsSection() {
  const { user, refreshUser, forceRefreshUser } = useAuth()
  const { toast } = useToast()
  const [selectedMembership, setSelectedMembership] = useState<any>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [lastUserState, setLastUserState] = useState<string>("")

  // Verificar si el usuario es estudiante
  const isStudent = user?.esEstudiante || false
  const hasPendingVerification = user?.verificacionEstudiantePendiente || false

  // ✅ EFECTO PARA DETECTAR CAMBIOS EN EL ESTADO DEL USUARIO
  useEffect(() => {
    const currentState = JSON.stringify({
      esEstudiante: user?.esEstudiante,
      verificacionPendiente: user?.verificacionEstudiantePendiente
    })
    
    if (lastUserState !== currentState) {
      console.log("🔔 Cambio detectado en estado del usuario:", {
        anterior: lastUserState,
        nuevo: currentState
      })
      
      setLastUserState(currentState)
      
      // Si la verificación fue aprobada, mostrar notificación
      if (lastUserState && user?.esEstudiante && !user?.verificacionEstudiantePendiente) {
        toast({
          title: "🎉 ¡Verificación aprobada!",
          description: "Ahora puedes acceder a los descuentos estudiantiles",
          duration: 5000,
        })
      }
    }
  }, [user, lastUserState, toast])

  // ✅ ESCUCHAR EVENTOS DE ACTUALIZACIÓN
  useEffect(() => {
    const handleUserStateChange = () => {
      console.log("🔄 Actualizando membresías por evento...")
      forceRefreshUser()
    }

    const handleShowToast = (event: CustomEvent) => {
      toast({
        title: event.detail.title,
        description: event.detail.description,
        variant: event.detail.type === "success" ? "default" : "destructive",
      })
    }

    window.addEventListener('userStateChanged', handleUserStateChange as EventListener)
    window.addEventListener('showToast', handleShowToast as EventListener)

    return () => {
      window.removeEventListener('userStateChanged', handleUserStateChange as EventListener)
      window.removeEventListener('showToast', handleShowToast as EventListener)
    }
  }, [forceRefreshUser, toast])

  // Función para manejar la selección de un plan
  const handleSelectPlan = (plan: MembershipPlan) => {
    // Verificar si es un plan de estudiante y el usuario no está verificado
    if (plan.isStudent && !isStudent && !hasPendingVerification) {
      if (!user) {
        setShowAuthDialog(true);
        setAuthMode("login");
        return;
      }
      setShowVerificationDialog(true)
      return
    }

    // Si tiene verificación pendiente, mostrar mensaje
    if (plan.isStudent && !isStudent && hasPendingVerification) {
      toast({
        title: "⏳ Verificación en proceso",
        description: "Tu solicitud está siendo revisada. Podrás comprar cuando sea aprobada.",
        variant: "default",
      })
      return
    }

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

  // ✅ FUNCIÓN MEJORADA: Actualizar el estado del estudiante
  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    console.log("🔄 Actualizando estado de estudiante...")
    
    try {
      await refreshUser()
      await forceRefreshUser()
      
      // Verificar si hubo cambios
      if (user?.esEstudiante) {
        toast({
          title: "✅ ¡Verificación aprobada!",
          description: "Ahora puedes acceder a los descuentos estudiantiles",
          duration: 5000,
        })
      } else if (!user?.verificacionEstudiantePendiente) {
        toast({
          title: "ℹ️ Estado actualizado",
          description: "Tu verificación aún está en proceso o fue rechazada",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Función para renderizar una tarjeta de membresía
  const renderMembershipCard = (plan: MembershipPlan) => {
    // Determinar el estado del botón para planes estudiantiles
    let buttonText = "Seleccionar Plan"
    let buttonVariant = plan.popular ? "default" : "secondary"
    let isButtonDisabled = false
    let showVerificationStatus = false
    let showStudentVerified = false

    if (plan.isStudent) {
      if (isStudent) {
        // Usuario ya verificado como estudiante
        buttonText = "Comprar con Descuento"
        buttonVariant = "default"
        showStudentVerified = true
      } else if (hasPendingVerification) {
        // Verificación pendiente
        buttonText = "⏳ Esperando Verificación"
        isButtonDisabled = true
        showVerificationStatus = true
      } else {
        // No verificado, puede solicitar verificación
        buttonText = "Seleccionar Plan"
        buttonVariant = "default"
      }
    }

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

        {/* Badge de verificación pendiente */}
        {showVerificationStatus && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              VERIFICACIÓN PENDIENTE
            </span>
          </div>
        )}

        {/* Badge de estudiante verificado */}
        {showStudentVerified && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Check className="h-3 w-3" />
              ESTUDIANTE VERIFICADO
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
                {plan.isStudent && isStudent && (
                  <span className="text-sm text-green-600 font-semibold mt-1">
                    ¡Descuento estudiantil activado!
                  </span>
                )}
                {plan.isStudent && !isStudent && !hasPendingVerification && (
                  <span className="text-sm text-blue-600 font-semibold mt-1">
                    ¡Ahorra ${plan.name.includes("QUINCENAL") ? "10,000" : "5,000"}!
                  </span>
                )}
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
                : plan.isStudent
                  ? "h-72 object-contain"
                  : "h-[22rem] object-contain"
            }`}
          />
          
          {/* Lista de características */}
          <ul
            className={`space-y-1 ${
              plan.isStudent || plan.isFree || plan.name.includes("PERSONALIZADO")
                ? "mt-4"
                : "mt-0.5"
            }`}
          >
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Mensaje de estado de verificación */}
          {showVerificationStatus && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Verificación en proceso</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Tu solicitud está siendo revisada. Te notificaremos cuando sea aprobada.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualizando...' : 'Verificar Estado'}
              </Button>
            </div>
          )}

          {/* Mensaje de estudiante verificado */}
          {showStudentVerified && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">¡Estudiante verificado!</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Ya puedes disfrutar de los descuentos estudiantiles.
              </p>
            </div>
          )}
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
              disabled={isButtonDisabled}
              className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
                isButtonDisabled 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : buttonVariant === "default"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {buttonText}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

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

            {/* Tab de planes para estudiantes - MEJORADO */}
            <TabsContent value="estudiantes" className="mt-8">
              {/* Banner informativo según estado */}
              {!isStudent && (
                <div className="mb-8">
                  {hasPendingVerification ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center max-w-4xl mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Clock className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-blue-800">Verificación en Proceso</h3>
                      </div>
                      <p className="text-blue-700 mb-4">
                        Tu solicitud de verificación estudiantil está siendo revisada. 
                        Podrás acceder a estos planes una vez sea aprobada.
                      </p>
                      <div className="flex justify-center gap-4 flex-wrap">
                        <Button 
                          variant="outline" 
                          onClick={handleRefreshStatus}
                          disabled={isRefreshing}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          {isRefreshing ? 'Actualizando...' : 'Verificar Estado Ahora'}
                        </Button>
                        <Button 
                          onClick={() => setShowVerificationDialog(true)}
                          variant="secondary"
                        >
                          📤 Reenviar Documentos
                        </Button>
                      </div>
                      <p className="text-sm text-blue-600 mt-3">
                        💡 <strong>Consejo:</strong> Si acabas de ser aprobado, haz clic en "Verificar Estado Ahora"
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center max-w-4xl mx-auto">
                      <h3 className="text-xl font-semibold text-green-800 mb-3">🎓 Descuentos Especiales para Estudiantes</h3>
                      <p className="text-green-700 mb-2">
                        Verifica tu condición de estudiante para acceder a precios especiales.
                      </p>
                      <p className="text-sm text-green-600">
                        Solo necesitas tu carnet estudiantil vigente o documento que acredite tu condición.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Banner de estudiante verificado */}
              {isStudent && (
                <div className="mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-green-800">¡Estudiante Verificado! 🎉</h3>
                    </div>
                    <p className="text-green-700 mb-2">
                      Ya puedes acceder a todos los descuentos estudiantiles.
                    </p>
                    <p className="text-sm text-green-600">
                      Disfruta de precios especiales en nuestras membresías.
                    </p>
                  </div>
                </div>
              )}

              {/* SIEMPRE mostrar las membresías estudiantiles */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {studentMemberships.map((plan) => renderMembershipCard(plan))}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  * Los planes de estudiante requieren presentar carnet estudiantil vigente al momento de la inscripción
                </p>
                {!isStudent && !hasPendingVerification && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => {
                        if (!user) {
                          setShowAuthDialog(true);
                          setAuthMode("login");
                          return;
                        }
                        setShowVerificationDialog(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      🎓 Verificar como Estudiante
                    </Button>
                    {!user && (
                      <p className="text-sm text-muted-foreground mt-2">
                        * Debes iniciar sesión para verificar tu condición de estudiante
                      </p>
                    )}
                  </div>
                )}
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

      {/* Diálogo de verificación de estudiante */}
      <VerificacionEstudianteDialog 
        open={showVerificationDialog} 
        onOpenChange={setShowVerificationDialog} 
      />

      {/* Diálogo de autenticación */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
        defaultTab={authMode} 
      />
    </>
  )
}