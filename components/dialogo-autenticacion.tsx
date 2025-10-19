"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecuperacionContrasenaDialog } from "@/components/dialogo-recuperacion-contrasena"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const { login, register, pendingAction } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showRecovery, setShowRecovery] = useState(false)

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      setSuccess("¡Sesión iniciada correctamente! Bienvenido de vuelta")
      setLoginData({ email: "", password: "" })

      setTimeout(() => {
        onOpenChange(false)
        if (pendingAction) {
          pendingAction()
        }
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
        registerData.password,
      )
      setSuccess("¡Cuenta creada exitosamente! Bienvenido a Imperius Fitness Gym")
      setRegisterData({
        name: "",
        lastName: "",
        documentType: "CC",
        documentNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        onOpenChange(false)
        if (pendingAction) {
          pendingAction()
        }
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
              Inicia sesión o crea una cuenta para continuar
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Juan"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-lastName">Apellidos</Label>
                    <Input
                      id="register-lastName"
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
                    <Label htmlFor="register-documentType">Tipo Documento</Label>
                    <Select
                      value={registerData.documentType}
                      onValueChange={(value) => setRegisterData({ ...registerData, documentType: value })}
                    >
                      <SelectTrigger id="register-documentType">
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
                    <Label htmlFor="register-documentNumber">Número</Label>
                    <Input
                      id="register-documentNumber"
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
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="register-confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
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
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <RecuperacionContrasenaDialog
        open={showRecovery}
        onOpenChange={(open) => {
          setShowRecovery(open)
          if (!open) {
            // Volver a abrir el diálogo de autenticación cuando se cierre el de recuperación
            setTimeout(() => onOpenChange(true), 100)
          }
        }}
      />
    </>
  )
}
