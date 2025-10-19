"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { UserStorage } from "@/lib/almacenamiento-usuarios"
import { useAuth } from "@/contexts/contexto-autenticacion"

/**
 * Componente: Diálogo de Verificación de Estudiante
 *
 * Este componente permite a los usuarios enviar documentación para verificar
 * su condición de estudiante y acceder a planes con descuento.
 *
 * Tipos de verificación aceptados:
 * - Carnet estudiantil vigente
 * - Captura de pantalla del portal .edu
 * - Boletín de notas reciente
 */

interface VerificacionEstudianteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerificacionEnviada?: () => void
}

export function VerificacionEstudianteDialog({
  open,
  onOpenChange,
  onVerificacionEnviada,
}: VerificacionEstudianteDialogProps) {
  const { user } = useAuth()
  const [tipoVerificacion, setTipoVerificacion] = useState<"carnet" | "portal-edu" | "boletin">("carnet")
  const [archivos, setArchivos] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState("")

  // Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files))
      setError("")
    }
  }

  const handleEnviarVerificacion = async () => {
    if (!user) {
      setError("Debes iniciar sesión para enviar la verificación")
      return
    }

    if (archivos.length === 0) {
      setError("Debes subir al menos un archivo")
      return
    }

    setEnviando(true)
    setError("")

    try {
      // Simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Guardar localmente (NO envía a ningún lado)
      const archivosUrls = archivos.map((file) => `local/${file.name}`)
      UserStorage.enviarVerificacionEstudiante(user.id, tipoVerificacion, archivosUrls)

      setEnviado(true)

      // Notificar al componente padre
      if (onVerificacionEnviada) {
        onVerificacionEnviada()
      }

      // Cerrar el diálogo después de 3 segundos
      setTimeout(() => {
        onOpenChange(false)
        setEnviado(false)
        setArchivos([])
      }, 3000)
    } catch (err) {
      setError("Error al guardar la verificación. Por favor intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bebas">Verificación de Estudiante</DialogTitle>
          <DialogDescription>
            Envía tu documentación para acceder a los planes con descuento para estudiantes
          </DialogDescription>
        </DialogHeader>

        {enviado ? (
          // Mensaje de éxito
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold text-center">¡Documentación Guardada!</h3>
            <p className="text-center text-muted-foreground">
              Tu solicitud ha sido guardada. Esta funcionalidad se implementará próximamente para enviar las
              verificaciones.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Tipo de verificación */}
            <div className="space-y-3">
              <Label>Tipo de Verificación</Label>
              <RadioGroup value={tipoVerificacion} onValueChange={(v: any) => setTipoVerificacion(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carnet" id="carnet" />
                  <Label htmlFor="carnet" className="font-normal cursor-pointer">
                    Carnet Estudiantil Vigente (Foto clara de ambos lados)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portal-edu" id="portal-edu" />
                  <Label htmlFor="portal-edu" className="font-normal cursor-pointer">
                    Captura de Pantalla del Portal .edu (Mostrando datos y fecha)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boletin" id="boletin" />
                  <Label htmlFor="boletin" className="font-normal cursor-pointer">
                    Boletín de Notas Reciente (Último semestre)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Subir archivos */}
            <div className="space-y-3">
              <Label>Subir Documentos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Haz clic para subir archivos</p>
                  <p className="text-xs text-muted-foreground">Formatos: JPG, PNG, PDF (máx. 5MB)</p>
                </label>
              </div>

              {/* Lista de archivos seleccionados */}
              {archivos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Archivos seleccionados:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {archivos.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">Información importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Los documentos deben estar vigentes y legibles</li>
                <li>Las capturas de pantalla deben mostrar claramente tu nombre y la fecha</li>
                <li>Esta funcionalidad se implementará próximamente</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onOpenChange(false)}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleEnviarVerificacion}
                disabled={enviando || archivos.length === 0}
              >
                {enviando ? "Guardando..." : "Guardar Documentación"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
