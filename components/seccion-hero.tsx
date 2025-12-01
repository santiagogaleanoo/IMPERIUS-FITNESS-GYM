"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell } from "lucide-react"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { useState } from "react"
import { AuthDialog } from "@/components/dialogo-autenticacion"

export function HeroSection() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleComienzaHoy = () => {
    if (isAuthenticated) {
      const section = document.getElementById("productos-destacados")
      if (section) section.scrollIntoView({ behavior: "smooth" })
    } else {
      setShowAuthDialog(true)
    }
  }

  const handleVerInstalaciones = () => {
    const section = document.getElementById("instalaciones")
    if (section) section.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <section
        className="
          relative
          w-full
          overflow-hidden
          section-dark
        "
        style={{
          // 🔹 Textura de fondo
          backgroundImage: "url('/fondos/grunge.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

              {/* overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ffffff08_50%,transparent_55%)] bg-[length:20px_20px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[length:30px_30px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent" />

      {/* un poco de fade arriba/abajo */}
      <div className="pointer-events-none absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-black/50" />
      <div className="pointer-events-none absolute -bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-transparent to-black/50" />
        

        {/* 🐂 Toro anclado a la derecha, tamaño controlado */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pr-4 md:pr-10 lg:pr-16 z-30">
          <img
            src="/toro-gris.png"
            alt="Imperius Bull"
            className="
              select-none
              w-[clamp(260px,42vw,880px)]
              h-auto
              opacity-85
            "
          />
        </div>

        {/* ------------ CONTENIDO ------------- */}
        <div
          className="
            container mx-auto px-4
            relative z-40
            py-16 md:py-20 lg:py-24
            min-h-[460px]
            flex items-center
          "
        >
          <div className="max-w-3xl">
            {/* Línea decorativa */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-yellow-600" />
              <div className="h-0.5 w-8 bg-yellow-500/60" />
            </div>

            <h1 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
              TRANSFORMA
              <br />
              <span className="bg-gradient-to-b from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                TU CUERPO
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed drop-shadow-lg">
              Supera tus límites cada día. Entrena con los mejores y alcanza tu máximo
              potencial. ¡Únete ahora!
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button
                onClick={handleComienzaHoy}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 text-base md:text-lg font-bold h-12 md:h-14 px-7 md:px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-yellow-400"
              >
                Comienza Hoy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleVerInstalaciones}
                className="border-2 border-gray-500 text-white hover:bg-gray-900/60 hover:border-yellow-500/50 text-base md:text-lg font-bold h-12 md:h-14 px-7 md:px-8 bg-gray-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Dumbbell className="mr-2 h-5 w-5" />
                Ver Instalaciones
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-6 border-t border-yellow-500/30">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="font-bebas text-2xl md:text-3xl text-yellow-500 mb-1 drop-shadow-lg">
                  200+
                </div>
                <div className="text-gray-300 text-xs md:text-sm group-hover:text-white transition-colors">
                  Miembros Activos
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="font-bebas text-2xl md:text-3xl text-yellow-500 mb-1 drop-shadow-lg">
                  3+
                </div>
                <div className="text-gray-300 text-xs md:text-sm group-hover:text-white transition-colors">
                  Entrenadores Pro
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="font-bebas text-xl md:text-2xl text-yellow-500 mb-1 drop-shadow-lg">
                  5AM - 9PM
                </div>
                <div className="text-gray-300 text-[11px] md:text-xs group-hover:text-white transition-colors">
                  Lunes a Viernes
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="font-bebas text-xl md:text-2xl text-yellow-500 mb-1 drop-shadow-lg">
                  8AM - 3PM
                </div>
                <div className="text-gray-300 text-[11px] md:text-xs group-hover:text-white transition-colors">
                  Sáb, Dom y Festivos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  )
}
