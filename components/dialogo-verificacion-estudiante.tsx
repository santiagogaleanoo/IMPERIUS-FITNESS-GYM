"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { UserStorage } from "@/lib/almacenamiento-usuarios"

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
  const { user, refreshUser, forceRefreshUser } = useAuth()
  const { toast } = useToast()
  const [selectedOption, setSelectedOption] = useState<"carnet" | "portal-edu" | "boletin">("carnet")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Manejar subida de archivos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
  }

  // Convertir archivos a Base64 para almacenamiento local
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // ✅ FUNCIÓN MEJORADA: Envío principal con mejor manejo de estado
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar la verificación",
        variant: "destructive",
      })
      return
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Documentos requeridos",
        description: "Por favor sube los documentos necesarios para la verificación",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("========================================")
      console.log("📤 INICIANDO ENVÍO DE VERIFICACIÓN")
      console.log("========================================")
      console.log("Usuario:", user.email)
      console.log("Tipo de verificación:", selectedOption)
      console.log("Archivos:", uploadedFiles.length)

      // 1️⃣ GUARDAR LOCALMENTE PRIMERO (RESPALDO INMEDIATO)
      const archivosBase64: string[] = []
      for (const file of uploadedFiles) {
        const base64 = await convertToBase64(file)
        archivosBase64.push(base64)
      }

      console.log("📁 Guardando en localStorage...")
      UserStorage.enviarVerificacionEstudiante(user.id, selectedOption, archivosBase64)
      
      // ✅ ACTUALIZACIÓN INMEDIATA DEL ESTADO LOCAL
      forceRefreshUser()
      refreshUser()

      console.log("✅ Estado local actualizado: VERIFICACIÓN PENDIENTE")

      // 2️⃣ ENVIAR AL SERVIDOR PHP (EN SEGUNDO PLANO)
      let phpSuccess = false
      try {
        console.log("📧 Enviando correo al administrador...")
        
        const formData = new FormData()
        formData.append("userId", user.id)
        formData.append("email", user.email)
        formData.append("nombre", `${user.name} ${user.lastName}`)
        formData.append("tipoVerificacion", selectedOption)
        uploadedFiles.forEach((file) => formData.append("archivos", file))

        const response = await fetch("http://localhost/php/send-mail.php", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          console.log("✅ PHP respondió:", result)
          phpSuccess = result.success === true
        } else {
          console.warn("⚠️ PHP respondió con error:", response.status, response.statusText)
        }
      } catch (fetchError) {
        console.warn("⚠️ Error de conexión con PHP:", fetchError)
        // NO ES CRÍTICO - EL SISTEMA LOCAL SIGUE FUNCIONANDO
      }

      // 3️⃣ NOTIFICAR AL USUARIO
      if (phpSuccess) {
        toast({
          title: "✅ Verificación enviada",
          description: "Tu solicitud ha sido enviada correctamente. Revisa tu correo para más información.",
          duration: 5000,
        })
      } else {
        toast({
          title: "⚠️ Verificación guardada localmente",
          description: "Tu solicitud se guardó correctamente, pero el correo podría no haberse enviado.",
          variant: "default",
        })
      }

      // 4️⃣ ACTUALIZAR INTERFAZ Y CERRAR DIÁLOGO
      onVerificacionEnviada?.()
      
      // Forzar actualización final
      setTimeout(() => {
        forceRefreshUser()
        refreshUser()
      }, 1000)

      // Cerrar diálogo y limpiar
      onOpenChange(false)
      setUploadedFiles([])

      console.log("========================================")
      console.log("✅ PROCESO DE VERIFICACIÓN COMPLETADO")
      console.log("========================================")

    } catch (error) {
      console.error("❌ Error crítico en verificación:", error)
      toast({
        title: "❌ Error inesperado",
        description: "Hubo un problema, pero tu solicitud se guardó localmente.",
        variant: "destructive",
      })
      
      // Aún así cerrar el diálogo
      onOpenChange(false)
      setUploadedFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ FUNCIÓN MEJORADA: Limpiar cuando se cierre el diálogo
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Limpiar archivos cuando se cierra
      setUploadedFiles([])
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Verificación de Estudiante</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Verifica tu condición de estudiante para acceder a descuentos especiales
          </DialogDescription>
        </DialogHeader>

        {/* Tabs de opciones */}
        <Tabs
          defaultValue="carnet"
          className="w-full"
          onValueChange={(value) => setSelectedOption(value as "carnet" | "portal-edu" | "boletin")}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="carnet">Carnet Estudiantil</TabsTrigger>
            <TabsTrigger value="portal-edu">Portal Educativo</TabsTrigger>
            <TabsTrigger value="boletin">Boletín de Notas</TabsTrigger>
          </TabsList>

          {/* CARNET */}
          <TabsContent value="carnet">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">🎓</span>
                  </div>
                  Carnet Estudiantil
                </CardTitle>
                <CardDescription>
                  Sube una foto o escaneo de tu carnet estudiantil vigente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carnet-files">Documentos (JPG, PNG, PDF) *</Label>
                  <Input
                    id="carnet-files"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo 5 archivos. El carnet debe ser vigente y legible.
                  </p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800">Archivos seleccionados:</p>
                    <ul className="text-sm text-green-700 mt-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>✅ {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PORTAL EDUCATIVO */}
          <TabsContent value="portal-edu">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">💻</span>
                  </div>
                  Portal Educativo
                </CardTitle>
                <CardDescription>
                  Sube una captura de pantalla de tu portal estudiantil donde se vea tu nombre y fecha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portal-files">Capturas (JPG, PNG) *</Label>
                  <Input
                    id="portal-files"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Debe incluir tu nombre completo y fecha actual
                  </p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800">Archivos seleccionados:</p>
                    <ul className="text-sm text-green-700 mt-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>✅ {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOLETÍN */}
          <TabsContent value="boletin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">📊</span>
                  </div>
                  Boletín de Notas
                </CardTitle>
                <CardDescription>
                  Sube tu boletín de notas más reciente que acredite tu condición de estudiante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="boletin-files">Boletín (JPG, PNG, PDF) *</Label>
                  <Input
                    id="boletin-files"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Debe ser del período académico actual o más reciente
                  </p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800">Archivos seleccionados:</p>
                    <ul className="text-sm text-green-700 mt-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>✅ {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botones */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || uploadedFiles.length === 0}
            className="min-w-32 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </div>
            ) : (
              "📤 Enviar Verificación"
            )}
          </Button>
        </div>

        {/* Aviso final MEJORADO */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>⚠️ Importante:</strong> Una vez enviada tu solicitud:
          </p>
          <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
            <li>Aparecerá como <strong>"Verificación Pendiente"</strong></li>
            <li>Podrás ver los planes estudiantiles pero <strong>no comprarlos</strong> hasta la aprobación</li>
            <li>Te notificaremos por correo cuando sea aprobada</li>
            <li>Usa el botón <strong>"Verificar Estado"</strong> para actualizar tu estado</li>
          </ul>
        </div>

        {/* Estado actual del usuario */}
        {user && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800">Estado actual:</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-700">
                {user.esEstudiante ? "✅ Estudiante Verificado" : 
                 user.verificacionEstudiantePendiente ? "⏳ Verificación Pendiente" : "❌ No Verificado"}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  forceRefreshUser()
                  refreshUser()
                }}
                className="text-xs"
              >
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}