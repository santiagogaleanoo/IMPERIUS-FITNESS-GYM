"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecuperacionContrasenaDialog } from "@/components/dialogo-recuperacion-contrasena"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register" // ✅ corregido: ahora se usa defaultTab
  onSuccess?: () => void
}

export function AuthDialog({ open, onOpenChange, onSuccess, defaultTab = "login" }: AuthDialogProps) {
  const { login, register, pendingAction } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showRecovery, setShowRecovery] = useState(false)
  const [activeMode, setActiveMode] = useState<"login" | "register">(defaultTab)

  // 🔹 Si cambia el tab por prop, lo actualizamos
  useEffect(() => {
    setActiveMode(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    if (!open) {
      setLoginData({ email: "", password: "" })
      setRegisterData({
        name: "",
        lastName: "",
        documentType: "CC",
        documentNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setError("")
      setSuccess("")
    }
  }, [open])

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      setSuccess("¡Sesión iniciada correctamente! Bienvenido de vuelta")

      setTimeout(() => {
        onOpenChange(false)
        pendingAction?.()
        onSuccess?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (registerData.documentNumber.length < 6) {
      setError("El número de documento debe tener al menos 6 dígitos")
      return
    }

    setIsLoading(true)

    try {
      await register(
        registerData.name,
        registerData.lastName,
        registerData.documentType,
        registerData.documentNumber,
        registerData.email,
        registerData.password
      )
      setSuccess("¡Cuenta creada exitosamente! Bienvenido a Imperius Fitness Gym")

      setTimeout(() => {
        onOpenChange(false)
        pendingAction?.()
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl text-center">IMPERIUS FITNESS GYM</DialogTitle>
            <DialogDescription className="text-center">
              {activeMode === "login"
                ? "Inicia sesión con tu cuenta"
                : "Regístrate para unirte a nuestra comunidad"}
            </DialogDescription>
          </DialogHeader>

          {activeMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm p-0 h-auto"
                  onClick={() => {
                    onOpenChange(false)
                    setShowRecovery(true)
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              <div className="text-center text-sm mt-4">
                ¿No tienes cuenta?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => setActiveMode("register")}
                >
                  Registrarse
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    placeholder="Juan"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input
                    type="text"
                    placeholder="Pérez"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tipo Documento</Label>
                  <Select
                    value={registerData.documentType}
                    onValueChange={(v) => setRegisterData({ ...registerData, documentType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="PAS">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    type="text"
                    placeholder="1234567890"
                    value={registerData.documentNumber}
                    onChange={(e) => setRegisterData({ ...registerData, documentNumber: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirmar Contraseña</Label>
                <Input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>

              <div className="text-center text-sm mt-4">
                ¿Ya tienes cuenta?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => setActiveMode("login")}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <RecuperacionContrasenaDialog
        open={showRecovery}
        onOpenChange={(open) => {
          setShowRecovery(open)
          if (!open) setTimeout(() => onOpenChange(true), 100)
        }}
      />
    </>
  )
}
