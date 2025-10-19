// Componente de calificación con estrellas
// Permite mostrar y seleccionar calificaciones de 1 a 5 estrellas

"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalificacionEstrellasProps {
  calificacion: number
  onCalificacionChange?: (calificacion: number) => void
  readonly?: boolean
  tamano?: "sm" | "md" | "lg"
  mostrarNumero?: boolean
}

export function CalificacionEstrellas({
  calificacion,
  onCalificacionChange,
  readonly = false,
  tamano = "md",
  mostrarNumero = false,
}: CalificacionEstrellasProps) {
  const tamanos = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (valor: number) => {
    if (!readonly && onCalificacionChange) {
      onCalificacionChange(valor)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((estrella) => (
        <button
          key={estrella}
          type="button"
          onClick={() => handleClick(estrella)}
          disabled={readonly}
          className={cn("transition-all", !readonly && "hover:scale-110 cursor-pointer", readonly && "cursor-default")}
        >
          <Star
            className={cn(
              tamanos[tamano],
              estrella <= calificacion ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground",
            )}
          />
        </button>
      ))}
      {mostrarNumero && <span className="ml-2 text-sm font-medium">{calificacion.toFixed(1)}</span>}
    </div>
  )
}
