"use client"

// Componente de vista rápida de producto
// Muestra detalles del producto y permite agregar al carrito o comprar directamente

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Check, CreditCard, GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/contexto-carrito"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { AuthDialog } from "./dialogo-autenticacion"
import { CheckoutDialog } from "./dialogo-pago"
import { VerificacionEstudianteDialog } from "./dialogo-verificacion-estudiante"
import { SeccionResenasProducto } from "./seccion-resenas-producto"
import { CalificacionEstrellas } from "./calificacion-estrellas"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  description?: string
  type: "product" | "membership"
  features?: string[]
  isStudent?: boolean
}

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showVerificacionEstudiante, setShowVerificacionEstudiante] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated, setPendingAction, user } = useAuth()

  if (!product) return null

  // Verificar si el producto es para estudiantes y si el usuario está verificado
  const esProductoEstudiante = product.id?.includes("estudiante") || product.isStudent
  const usuarioEsEstudiante = user?.esEstudiante || false
  const verificacionPendiente = user?.verificacionEstudiantePendiente || false

  // Obtener calificación del producto
  const { promedio, total } = calcularCalificacionPromedio(product.id)

  const handleAddToCart = () => {
    // Si no está autenticado, pedir login
    if (!isAuthenticated) {
      setPendingAction(() => () => {
        // Después del login, verificar si es producto de estudiante
        if (esProductoEstudiante && !usuarioEsEstudiante) {
          setShowVerificacionEstudiante(true)
        } else {
          agregarAlCarrito()
        }
      })
      setShowAuthDialog(true)
      return
    }

    // Si es producto de estudiante y el usuario no está verificado
    if (esProductoEstudiante && !usuarioEsEstudiante) {
      setShowVerificacionEstudiante(true)
      return
    }

    // Si todo está bien, agregar al carrito
    agregarAlCarrito()
  }

  const agregarAlCarrito = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        category: product.category,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
      setQuantity(1)
    }, 1500)
  }

  const handleBuyNow = () => {
    // Si no está autenticado, pedir login
    if (!isAuthenticated) {
      setPendingAction(() => () => {
        // Después del login, verificar si es producto de estudiante
        if (esProductoEstudiante && !usuarioEsEstudiante) {
          setShowVerificacionEstudiante(true)
        } else {
          setShowCheckout(true)
        }
      })
      setShowAuthDialog(true)
      return
    }

    // Si es producto de estudiante y el usuario no está verificado
    if (esProductoEstudiante && !usuarioEsEstudiante) {
      setShowVerificacionEstudiante(true)
      return
    }

    // Si todo está bien, ir al checkout
    setShowCheckout(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {showSuccess ? (
            // Mensaje de éxito al agregar al carrito
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/20 p-6 mb-4 animate-in zoom-in duration-300">
                <Check className="h-16 w-16 text-primary" />
              </div>
              <h3 className="font-bebas text-3xl text-center mb-2">¡AGREGADO AL CARRITO!</h3>
              <p className="text-muted-foreground text-center">Tu producto ha sido agregado exitosamente</p>
            </div>
          ) : (
            <Tabs defaultValue="detalles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="detalles">Detalles del Producto</TabsTrigger>
                <TabsTrigger value="resenas">Reseñas {total > 0 && `(${total})`}</TabsTrigger>
              </TabsList>

              <TabsContent value="detalles">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Imagen del producto */}
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                          {product.category}
                        </span>
                      </div>
                    )}
                    {/* Badge de estudiante */}
                    {esProductoEstudiante && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Estudiantes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detalles del producto */}
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <h2 className="font-bebas text-4xl mb-2">{product.name}</h2>

                      {total > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <CalificacionEstrellas calificacion={promedio} readonly tamano="md" mostrarNumero />
                          <span className="text-sm text-muted-foreground">({total} reseñas)</span>
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6">
                        {product.description ||
                          "Producto de alta calidad diseñado para maximizar tu rendimiento y ayudarte a alcanzar tus objetivos."}
                      </p>

                      <div className="mb-6">
                        <span className="font-bebas text-5xl text-primary">
                          ${product.price.toLocaleString("es-CO")}
                        </span>
                      </div>

                      {/* Alerta para productos de estudiante */}
                      {esProductoEstudiante && (
                        <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          <AlertDescription className="text-sm">
                            {usuarioEsEstudiante ? (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                ✓ Cuenta verificada como estudiante
                              </span>
                            ) : verificacionPendiente ? (
                              <span className="text-orange-600 dark:text-orange-400">
                                Tu verificación está en proceso. Te notificaremos cuando sea aprobada.
                              </span>
                            ) : (
                              <span>
                                Este plan requiere verificación de estudiante. Deberás enviar tu documentación para
                                acceder.
                              </span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Características del producto */}
                      {product.features && product.features.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">Características:</h3>
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Selector de cantidad (solo para productos físicos) */}
                      {product.type === "product" && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">Cantidad</label>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="w-full h-12 bg-transparent"
                        size="lg"
                        disabled={verificacionPendiente && esProductoEstudiante}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Agregar al Carrito
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        className="w-full h-12 font-bold"
                        size="lg"
                        disabled={verificacionPendiente && esProductoEstudiante}
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Comprar Ahora
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resenas" className="mt-0">
                <SeccionResenasProducto productoId={product.id} productoNombre={product.name} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de autenticación */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      {/* Diálogo de verificación de estudiante */}
      <VerificacionEstudianteDialog
        open={showVerificacionEstudiante}
        onOpenChange={setShowVerificacionEstudiante}
        onVerificacionEnviada={() => {
          // Actualizar el estado del usuario
          if (user) {
            const updatedUser = { ...user, verificacionEstudiantePendiente: true }
            localStorage.setItem("imperius_current_user", JSON.stringify(updatedUser))
          }
        }}
      />

      {/* Diálogo de checkout */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={[
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.type === "product" ? quantity : 1,
            image: product.image,
            type: product.type,
          },
        ]}
        onSuccess={() => {
          setShowCheckout(false)
          onOpenChange(false)
          setQuantity(1)
        }}
      />
    </>
  )
}
