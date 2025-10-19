"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, KeyRound, Mail } from "lucide-react"
import { UserStorage } from "@/lib/almacenamiento-usuarios"

// Componente para recuperar contraseña olvidada mediante email
interface RecuperacionContrasenaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecuperacionContrasenaDialog({ open, onOpenChange }: RecuperacionContrasenaDialogProps) {
  // Estados para el flujo de recuperación
  const [paso, setPaso] = useState<"email" | "enviado" | "cambiar">("email")
  const [email, setEmail] = useState("")
  const [nuevaContrasena, setNuevaContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [codigoVerificacion, setCodigoVerificacion] = useState("")
  const [codigoGenerado, setCodigoGenerado] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Reiniciar el diálogo al cerrar
  const handleClose = () => {
    setPaso("email")
    setEmail("")
    setNuevaContrasena("")
    setConfirmarContrasena("")
    setCodigoVerificacion("")
    setCodigoGenerado("")
    setError("")
    onOpenChange(false)
  }

  // Paso 1: Enviar código de verificación al email
  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const usuario = UserStorage.getUserByEmail(email)

      if (!usuario) {
        throw new Error("No existe una cuenta con este email")
      }

      // Generar código de 6 dígitos
      const codigo = Math.floor(100000 + Math.random() * 900000).toString()
      setCodigoGenerado(codigo)

      // Por ahora, mostrar el código en consola para desarrollo
      console.log("=".repeat(60))
      console.log("📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA")
      console.log("=".repeat(60))
      console.log(`Para: ${email}`)
      console.log(`Asunto: Recupera tu contraseña - Imperius Fitness Gym`)
      console.log("")
      console.log("Hola,")
      console.log("")
      console.log("Recibimos una solicitud para recuperar tu contraseña.")
      console.log("")
      console.log(`Tu código de verificación es: ${codigo}`)
      console.log("")
      console.log("Este código expira en 15 minutos.")
      console.log("")
      console.log("Si no solicitaste este cambio, ignora este mensaje.")
      console.log("")
      console.log("Saludos,")
      console.log("Equipo Imperius Fitness Gym")
      console.log("=".repeat(60))

      setPaso("enviado")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar código")
    } finally {
      setIsLoading(false)
    }
  }

  // Paso 2: Verificar código y cambiar contraseña
  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (codigoVerificacion !== codigoGenerado) {
      setError("Código de verificación incorrecto")
      return
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const usuario = UserStorage.getUserByEmail(email)
      if (!usuario) {
        throw new Error("Usuario no encontrado")
      }

      // Actualizar la contraseña
      const usuarios = UserStorage.getAllUsers()
      const index = usuarios.findIndex((u) => u.email === email)
      if (index !== -1) {
        usuarios[index].password = nuevaContrasena
        localStorage.setItem("imperius_users", JSON.stringify(usuarios))
      }

      setPaso("cambiar")

      // Cerrar después de 2 segundos
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bebas text-2xl">
            <KeyRound className="h-6 w-6" />
            RECUPERAR CONTRASEÑA
          </DialogTitle>
          <DialogDescription>
            {paso === "email" && "Ingresa tu email para recibir un código de verificación"}
            {paso === "enviado" && "Revisa tu email e ingresa el código de verificación"}
            {paso === "cambiar" && "¡Contraseña cambiada exitosamente!"}
          </DialogDescription>
        </DialogHeader>

        {/* Paso 1: Ingresar email */}
        {paso === "email" && (
          <form onSubmit={handleEnviarCodigo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email de tu cuenta</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Código
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Paso 2: Ingresar código y nueva contraseña */}
        {paso === "enviado" && (
          <form onSubmit={handleCambiarContrasena} className="space-y-4">
            <Alert className="bg-blue-50 text-blue-900 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                Hemos enviado un código de verificación a <strong>{email}</strong>
                <br />
                <span className="text-xs mt-1 block">
                  (En desarrollo: revisa la consola del navegador para ver el código)
                </span>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Verificación</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="123456"
                value={codigoVerificacion}
                onChange={(e) => setCodigoVerificacion(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nueva-contrasena">Nueva Contraseña</Label>
              <Input
                id="nueva-contrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar-contrasena">Confirmar Contraseña</Label>
              <Input
                id="confirmar-contrasena"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setPaso("email")} className="flex-1">
                Atrás
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Paso 3: Éxito */}
        {paso === "cambiar" && (
          <div className="space-y-4">
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </AlertDescription>
            </Alert>

            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
