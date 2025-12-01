"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { useCart } from "@/contexts/contexto-carrito"

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  type: "product" | "membership"
}

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items?: CheckoutItem[] // opcional, para compras directas
  onSuccess?: () => void
}

// ENDPOINT PHP
const ORDER_ENDPOINT = "http://localhost/php/send-order.php"

// WhatsApp de la empresa (cámbialo al definitivo)
const WHATSAPP_NUMBER = "573104924160" // sin "+" y en formato internacional

export function CheckoutDialog({
  open,
  onOpenChange,
  items: externalItems,
  onSuccess,
}: CheckoutDialogProps) {
  const { items: cartItems, total, clearCart } = useCart()

  // Si recibimos items externos, usamos esos, si no, usamos el carrito
  const items = externalItems || cartItems
  const calculatedTotal = externalItems
    ? externalItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : total

  const [paymentMethod, setPaymentMethod] = useState<"contra-entrega" | "transferencia">(
    "contra-entrega",
  )
  const [orderComplete, setOrderComplete] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // -------- Estados del formulario --------
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [barrio, setBarrio] = useState("")
  const [detalles, setDetalles] = useState("")

  // Calcular envío (solo para productos físicos)
  const hasPhysicalProducts = items.some((item) => item.type === "product")
  const shipping = hasPhysicalProducts && calculatedTotal > 0 && calculatedTotal < 200000 ? 15000 : 0
  const finalTotal = calculatedTotal + shipping

  // ----------------------- Procesar Checkout -----------------------
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar contacto: al menos teléfono o correo
    if (!telefono.trim() && !email.trim()) {
      alert("Debes ingresar al menos un teléfono o un correo de contacto.")
      return
    }

    // Si hay productos físicos, validar dirección
    if (hasPhysicalProducts && (!direccion.trim() || !ciudad.trim() || !barrio.trim())) {
      alert("Por favor completa la dirección, ciudad y barrio para el envío.")
      return
    }

    setIsSending(true)

    // ID de pedido simple (como el que mostramos en el correo)
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()

    const payload = {
      orderId,
      customer: {
        name: nombre || "Sin nombre",
        phone: telefono || "Sin teléfono",
        email: email || "Sin correo",
      },
      shipping: hasPhysicalProducts
        ? {
            address: direccion || "No especificada",
            barrio: barrio || "No especificado",
            city: ciudad || "No especificada",
            details: detalles || "Sin detalles",
          }
        : {
            address: "No aplica (sin productos físicos)",
            barrio: "No aplica",
            city: "No aplica",
            details: detalles || "Sin detalles",
          },
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      summary: {
        subtotal: calculatedTotal,
        shipping,
        total: finalTotal,
      },
      paymentMethod,
    }

    try {
      const res = await fetch(ORDER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        console.error("Error al enviar pedido:", data)
        alert("Ocurrió un error al enviar el pedido. Inténtalo de nuevo.")
        setIsSending(false)
        return
      }

      // Si todo OK -> mostrar pantalla de confirmación
      setOrderComplete(true)

      // Si eligió transferencia bancaria, abrir WhatsApp en otra pestaña
      if (paymentMethod === "transferencia") {
        const msg = encodeURIComponent(
          `Hola, soy ${nombre || "un cliente"} y acabo de realizar un pedido #${orderId}. ` +
            `Quisiera que me envíen los datos para la transferencia bancaria.`,
        )
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
      }

      // Limpiar carrito si es compra normal (no externa)
      if (!externalItems) {
        clearCart()
      }

      // Cerrar dialogo luego de un momento
      setTimeout(() => {
        setOrderComplete(false)
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 2500)
    } catch (error) {
      console.error(error)
      alert("Ocurrió un error al enviar el pedido. Inténtalo de nuevo.")
    } finally {
      setIsSending(false)
    }
  }

  // ----------------- Vista de confirmación -----------------
  if (orderComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="mb-2 font-bebas text-3xl text-foreground">¡PEDIDO CONFIRMADO!</h3>
            <p className="mb-4 text-muted-foreground">
              Tu pedido ha sido procesado exitosamente. Revisa tu WhatsApp o correo para más
              información.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ----------------- Formulario principal -----------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl text-primary">FINALIZAR COMPRA</DialogTitle>
          <DialogDescription>Completa tu información para procesar el pedido</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="telefono">
                  Teléfono <span className="text-xs text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="300 123 4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">
                Correo Electrónico <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Debes ingresar al menos teléfono o correo para poder contactarte.
              </p>
            </div>
          </div>

          {/* Dirección de envío (solo productos físicos) */}
          {hasPhysicalProducts && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5" />
                Dirección de Envío
              </h3>
              <div>
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  placeholder="Calle 50 # 39 - 06"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    placeholder="Armenia"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Input
                    id="barrio"
                    placeholder="La Fachada"
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="detalles">
                  Detalles adicionales{" "}
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="detalles"
                  placeholder="Ej: es en una casa de 2 pisos, portón negro..."
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Método de pago */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "contra-entrega" | "transferencia")}
            >
              <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:border-primary">
                <RadioGroupItem value="contra-entrega" id="contra-entrega" />
                <Label htmlFor="contra-entrega" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Pago Contra Entrega</div>
                  <div className="text-sm text-muted-foreground">
                    Paga en efectivo al recibir tu pedido.
                  </div>
                </Label>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:border-primary">
                <RadioGroupItem value="transferencia" id="transferencia" />
                <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Transferencia Bancaria</div>
                  <div className="text-sm text-muted-foreground">
                    Te contactaremos por WhatsApp para enviarte los datos bancarios.
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Resumen del pedido */}
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <h3 className="text-lg font-semibold">Resumen del Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} artículos):</span>
                <span className="font-semibold">
                  {calculatedTotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              {hasPhysicalProducts && (
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      shipping.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })
                    )}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">
                  {finalTotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSending}
            >
              {isSending ? "Enviando pedido..." : "Confirmar Pedido"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Al confirmar tu pedido, nos pondremos en contacto al número o correo registrado para
            coordinar la entrega y el pago.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
