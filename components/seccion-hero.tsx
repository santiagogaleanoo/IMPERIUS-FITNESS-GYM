"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Users } from "lucide-react"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { useState } from "react"
import { AuthDialog } from "@/components/dialogo-autenticacion"

export function HeroSection() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleComienzaHoy = () => {
    if (isAuthenticated) {
      // Si ya está autenticado, ir a membresías
      document.getElementById("membresias")?.scrollIntoView({ behavior: "smooth" })
    } else {
      // Si no está autenticado, abrir diálogo de registro
      setShowAuthDialog(true)
    }
  }

  const handleUneteAhora = () => {
    document.getElementById("membresias")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <section id="inicio" className="relative min-h-screen flex items-center bg-secondary overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/muscular-person-training-intensely-in-modern-gym-w.jpg"
            alt="Gym Training"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-primary" />
            </div>

            <h1 className="font-bebas text-6xl md:text-8xl lg:text-9xl text-secondary-foreground leading-none mb-6 tracking-tight">
              TRANSFORMA
              <br />
              <span className="text-primary">TU CUERPO</span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary-foreground/80 mb-8 max-w-2xl leading-relaxed">
              Supera tus límites cada día. Entrena con los mejores y alcanza tu máximo potencial. ¡Únete ahora!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleComienzaHoy}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold h-14 px-8"
              >
                Comienza Hoy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("instalaciones")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-muted-foreground/30 text-secondary-foreground hover:bg-muted text-lg font-bold h-14 px-8 bg-transparent"
              >
                <Dumbbell className="mr-2 h-5 w-5" />
                Ver Instalaciones
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-primary/20">
              <div>
                <div className="font-bebas text-3xl md:text-4xl text-primary mb-1">200+</div>
                <div className="text-secondary-foreground/70 text-sm md:text-base">Miembros Activos</div>
              </div>
              <div>
                <div className="font-bebas text-3xl md:text-4xl text-primary mb-1">3+</div>
                <div className="text-secondary-foreground/70 text-sm md:text-base">Entrenadores Pro</div>
              </div>
              {/* Horario entre semana */}
              <div>
                <div className="font-bebas text-2xl md:text-3xl text-primary mb-1">5AM - 9PM</div>
                <div className="text-secondary-foreground/70 text-xs md:text-sm">Lunes a Viernes</div>
              </div>
              {/* Horario fines de semana y festivos */}
              <div>
                <div className="font-bebas text-2xl md:text-3xl text-primary mb-1">8AM - 3PM</div>
                <div className="text-secondary-foreground/70 text-xs md:text-sm">Sáb, Dom y Festivos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  )
}
