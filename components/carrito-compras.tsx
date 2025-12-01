"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/contexto-carrito"
import { ShoppingCart, Trash2, Plus, Minus, Package, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckoutDialog } from "./dialogo-pago"
import { OfferSystem, type ProductOffer } from "@/lib/sistema-ofertas"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // 🔥 Ofertas activas por producto
  const [offersByProduct, setOffersByProduct] = useState<Record<string, ProductOffer>>({})

  useEffect(() => {
    const loadOffers = () => {
      const active = OfferSystem.getAllActiveOffers()
      const map: Record<string, ProductOffer> = {}
      active.forEach(o => {
        map[o.productId] = o
      })
      setOffersByProduct(map)
    }

    loadOffers()
    const interval = setInterval(loadOffers, 30_000) // refresca cada 30s
    return () => clearInterval(interval)
  }, [])

  // 🧮 Construimos una versión "enriquecida" de los items con el precio correcto
  const cartItems = items.map(item => {
    const offer = offersByProduct[item.id]
    const basePrice = item.originalPrice ?? item.price

    const unitPrice = offer
      ? offer.currentPrice                      // si hay oferta, usamos el precio en oferta
      : basePrice                               // si no hay oferta, usamos el precio original

    return {
      ...item,
      unitPrice,
    }
  })

  // Ahora el subtotal se calcula con unitPrice
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )

  const hasPhysicalProducts = cartItems.some(item => item.type === "product")
  const shipping =
    hasPhysicalProducts && subtotal > 0 && subtotal < 200000 ? 15000 : 0
  const finalTotal = subtotal + shipping

  const handleCheckout = () => {
    setOpen(false)
    setShowCheckout(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-secondary-foreground hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in-50">
                {itemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          {/* Encabezado */}
          <SheetHeader className="px-6 py-4 border-b bg-background relative">
            <div className="flex items-center justify-between pr-12">
              <SheetTitle className="font-bebas text-3xl text-primary flex items-center gap-2">
                <ShoppingBag className="h-7 w-7" />
                CARRITO DE COMPRAS
              </SheetTitle>
              <Badge variant="secondary" className="text-sm font-semibold">
                {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
              </Badge>
            </div>
          </SheetHeader>

          {/* Carrito vacío */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="w-32 h-32 mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bebas text-foreground mb-2">
                TU CARRITO ESTÁ VACÍO
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Explora nuestros productos y membresías para comenzar tu transformación
              </p>
              <Link href="/tienda">
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Explorar Productos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      {/* Imagen */}
                      {item.image && (
                        <div className="w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
                            {item.name}
                          </h4>
                          {item.category && (
                            <Badge variant="outline" className="mb-2 text-xs">
                              {item.category}
                            </Badge>
                          )}
                          {item.type === "membership" && (
                            <p className="text-sm text-muted-foreground">
                              Plan de membresía mensual
                            </p>
                          )}
                        </div>

                        <div className="flex items-end justify-between mt-2">
                          <div className="flex flex-col gap-2">
                            <p className="text-2xl font-bold text-primary">
                              ${item.unitPrice.toLocaleString("es-CO")}
                            </p>

                            {/* Cantidad solo para productos */}
                            {item.type === "product" && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground mr-2">
                                  Cantidad:
                                </span>
                                <div className="flex items-center border border-border rounded-md">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-none hover:bg-primary/10"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-semibold w-12 text-center border-x border-border text-foreground">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-none hover:bg-primary/10"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Eliminar */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="border-t bg-background px-6 py-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">
                      Subtotal ({itemCount} artículos):
                    </span>
                    <span className="font-semibold text-foreground">
                      ${subtotal.toLocaleString("es-CO")}
                    </span>
                  </div>

                  {hasPhysicalProducts && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Envío:
                        </span>
                        <span className="font-semibold text-foreground">
                          {shipping === 0 ? (
                            <span className="text-green-600 font-bold">
                              GRATIS
                            </span>
                          ) : (
                            `$${shipping.toLocaleString("es-CO")}`
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Envío gratis en compras superiores a $200.000
                        </p>
                      )}
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bebas text-2xl text-foreground">
                      TOTAL:
                    </span>
                    <span className="font-bebas text-3xl text-primary">
                      ${finalTotal.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-base"
                  >
                    Proceder al Pago
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={showCheckout} onOpenChange={setShowCheckout} />
    </>
  )
}
