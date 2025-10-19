// Sección de reseñas de producto
// Muestra todas las reseñas, permite agregar nuevas y gestionar las existentes

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Edit2, Trash2, Send, MoreVertical } from "lucide-react"
import { CalificacionEstrellas } from "./calificacion-estrellas"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { AuthDialog } from "./dialogo-autenticacion"
import {
  obtenerResenasPorProducto,
  agregarResena,
  editarResena,
  eliminarResena,
  agregarRespuesta,
  calcularCalificacionPromedio,
  type Resena,
} from "@/lib/almacenamiento-resenas"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SeccionResenasProductoProps {
  productoId: string
  productoNombre: string
}

export function SeccionResenasProducto({ productoId, productoNombre }: SeccionResenasProductoProps) {
  const [resenas, setResenas] = useState<Resena[]>([])
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState("")
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [respondiendoId, setRespondiendoId] = useState<string | null>(null)
  const [textoRespuesta, setTextoRespuesta] = useState("")
  const { isAuthenticated, user } = useAuth()

  // Cargar reseñas al montar el componente
  useEffect(() => {
    cargarResenas()
  }, [productoId])

  const cargarResenas = () => {
    const resenasProducto = obtenerResenasPorProducto(productoId)
    setResenas(resenasProducto)
  }

  const { promedio, total } = calcularCalificacionPromedio(productoId)

  const handleSubmitResena = () => {
    if (!isAuthenticated || !user) {
      setShowAuthDialog(true)
      return
    }

    if (!comentario.trim()) {
      alert("Por favor escribe un comentario")
      return
    }

    if (editandoId) {
      // Editar reseña existente
      editarResena(editandoId, comentario, calificacion)
      setEditandoId(null)
    } else {
      // Agregar nueva reseña
      agregarResena({
        productoId,
        usuarioEmail: user.email,
        usuarioNombre: user.name || user.email.split("@")[0],
        calificacion,
        comentario,
      })
    }

    setComentario("")
    setCalificacion(5)
    cargarResenas()
  }

  const handleEditarResena = (resena: Resena) => {
    setEditandoId(resena.id)
    setComentario(resena.comentario)
    setCalificacion(resena.calificacion)
    // Scroll al formulario
    document.getElementById("formulario-resena")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleEliminarResena = (resenaId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      eliminarResena(resenaId)
      cargarResenas()
    }
  }

  const handleCancelarEdicion = () => {
    setEditandoId(null)
    setComentario("")
    setCalificacion(5)
  }

  const handleResponder = (resenaId: string) => {
    if (!isAuthenticated || !user) {
      setShowAuthDialog(true)
      return
    }

    if (!textoRespuesta.trim()) {
      alert("Por favor escribe una respuesta")
      return
    }

    agregarRespuesta(resenaId, {
      usuarioEmail: user.email,
      usuarioNombre: user.name || user.email.split("@")[0],
      comentario: textoRespuesta,
    })

    setTextoRespuesta("")
    setRespondiendoId(null)
    cargarResenas()
  }

  const obtenerIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Resumen de calificaciones */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bebas text-primary mb-2">{promedio > 0 ? promedio.toFixed(1) : "0.0"}</div>
          <CalificacionEstrellas calificacion={promedio} readonly tamano="lg" />
          <div className="text-sm text-muted-foreground mt-2">{total} reseñas</div>
        </div>
        <div className="flex-1">
          <h3 className="font-bebas text-2xl mb-2">Reseñas de {productoNombre}</h3>
          <p className="text-muted-foreground text-sm">
            Comparte tu experiencia y ayuda a otros clientes a tomar la mejor decisión
          </p>
        </div>
      </div>

      {/* Formulario para agregar/editar reseña */}
      <Card id="formulario-resena" className="p-6">
        <h3 className="font-semibold text-lg mb-4">{editandoId ? "Editar tu reseña" : "Escribe una reseña"}</h3>

        {!isAuthenticated && (
          <Alert className="mb-4">
            <AlertDescription>
              Debes iniciar sesión para escribir una reseña.{" "}
              <button onClick={() => setShowAuthDialog(true)} className="text-primary font-medium underline">
                Iniciar sesión
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tu calificación</label>
            <CalificacionEstrellas
              calificacion={calificacion}
              onCalificacionChange={setCalificacion}
              tamano="lg"
              readonly={!isAuthenticated}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tu comentario</label>
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comparte tu experiencia con este producto..."
              rows={4}
              disabled={!isAuthenticated}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmitResena} disabled={!isAuthenticated || !comentario.trim()}>
              {editandoId ? "Actualizar Reseña" : "Publicar Reseña"}
            </Button>
            {editandoId && (
              <Button variant="outline" onClick={handleCancelarEdicion}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        <h3 className="font-bebas text-2xl">Todas las Reseñas ({total})</h3>

        {resenas.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aún no hay reseñas para este producto. ¡Sé el primero en compartir tu opinión!
            </p>
          </Card>
        ) : (
          resenas.map((resena) => (
            <Card key={resena.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {obtenerIniciales(resena.usuarioNombre)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Header de la reseña */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{resena.usuarioNombre}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <CalificacionEstrellas calificacion={resena.calificacion} readonly tamano="sm" />
                        <span className="text-xs text-muted-foreground">
                          {formatearFecha(resena.fecha)}
                          {resena.editado && " (editado)"}
                        </span>
                      </div>
                    </div>

                    {/* Menú de opciones (solo para el autor) */}
                    {user && user.email === resena.usuarioEmail && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditarResena(resena)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEliminarResena(resena.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Comentario */}
                  <p className="text-sm leading-relaxed mb-3">{resena.comentario}</p>

                  {/* Botón de responder */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRespondiendoId(respondiendoId === resena.id ? null : resena.id)}
                    className="h-8 text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Responder
                  </Button>

                  {/* Formulario de respuesta */}
                  {respondiendoId === resena.id && (
                    <div className="mt-3 pl-4 border-l-2 border-primary/20">
                      <Textarea
                        value={textoRespuesta}
                        onChange={(e) => setTextoRespuesta(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        rows={2}
                        className="resize-none mb-2"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleResponder(resena.id)}>
                          <Send className="h-3 w-3 mr-1" />
                          Enviar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRespondiendoId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Respuestas */}
                  {resena.respuestas && resena.respuestas.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
                      {resena.respuestas.map((respuesta) => (
                        <div key={respuesta.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-muted text-xs">
                              {obtenerIniciales(respuesta.usuarioNombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{respuesta.usuarioNombre}</span>
                              <span className="text-xs text-muted-foreground">{formatearFecha(respuesta.fecha)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{respuesta.comentario}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  )
}
