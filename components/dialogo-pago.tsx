"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { useCart } from "@/contexts/contexto-carrito"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, total, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("contra-entrega")
  const [orderComplete, setOrderComplete] = useState(false)

  // Calcular envío (solo para productos físicos)
  const hasPhysicalProducts = items.some((item) => item.type === "product")
  const shipping = hasPhysicalProducts && total > 0 && total < 200000 ? 15000 : 0
  const finalTotal = total + shipping

  // Función para procesar el pago
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí se conectará con el sistema de pagos real
    console.log("[v0] Procesando pago con método:", paymentMethod)
    console.log("[v0] Total a pagar:", finalTotal)
    console.log("[v0] Productos:", items)

    // Simular procesamiento exitoso
    setOrderComplete(true)

    // Limpiar carrito después de 2 segundos
    setTimeout(() => {
      clearCart()
      setOrderComplete(false)
      onOpenChange(false)
    }, 3000)
  }

  // Vista de confirmación de pedido
  if (orderComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="font-bebas text-3xl text-foreground mb-2">¡PEDIDO CONFIRMADO!</h3>
            <p className="text-muted-foreground mb-4">
              Tu pedido ha sido procesado exitosamente. Pronto recibirás más información.
            </p>
            <p className="text-sm text-muted-foreground">
              Número de orden: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-3xl text-primary">FINALIZAR COMPRA</DialogTitle>
          <DialogDescription>Completa tu información para procesar el pedido</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información de Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input id="nombre" required placeholder="Juan Pérez" />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" required type="tel" placeholder="300 123 4567" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" required type="email" placeholder="correo@ejemplo.com" />
            </div>
          </div>

          {/* Dirección de envío (solo si hay productos físicos) */}
          {hasPhysicalProducts && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Dirección de Envío
              </h3>
              <div>
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input id="direccion" required placeholder="Calle 50 # 39 - 06" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" required placeholder="Bogotá" />
                </div>
                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Input id="barrio" required placeholder="Villa Alejandra" />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Método de pago */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                <RadioGroupItem value="contra-entrega" id="contra-entrega" />
                <Label htmlFor="contra-entrega" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Pago Contra Entrega</div>
                  <div className="text-sm text-muted-foreground">Paga en efectivo al recibir tu pedido</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                <RadioGroupItem value="transferencia" id="transferencia" />
                <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Transferencia Bancaria</div>
                  <div className="text-sm text-muted-foreground">Te enviaremos los datos bancarios por WhatsApp</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Resumen del pedido */}
          <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">Resumen del Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} artículos):</span>
                <span className="font-semibold">${total.toLocaleString("es-CO")}</span>
              </div>
              {hasPhysicalProducts && (
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${shipping.toLocaleString("es-CO")}`
                    )}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${finalTotal.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Confirmar Pedido
            </Button>
          </div>

          {/* Nota informativa */}
          <p className="text-xs text-muted-foreground text-center">
            Al confirmar tu pedido, recibirás un mensaje de WhatsApp con los detalles y el seguimiento.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
