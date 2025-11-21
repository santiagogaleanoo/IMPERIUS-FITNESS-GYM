"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Check, CreditCard, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/contexto-carrito"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { AuthDialog } from "./dialogo-autenticacion"
import { CheckoutDialog } from "./dialogo-pago"
import { SeccionResenasProducto } from "./seccion-resenas-producto"
import { CalificacionEstrellas } from "./calificacion-estrellas"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"
import { useWishlist } from "@/components/lista-deseos"
import { OfferSystem } from "@/lib/sistema-ofertas"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  category?: string
  description?: string
  type: "product" | "membership"
  features?: string[]
}

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {

  // =======================================
  // ESTADOS — deben ir SIEMPRE arriba
  // =======================================
  const [quantity, setQuantity] = useState(1)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [rating, setRating] = useState({ promedio: 0, total: 0 })

  const { addItem } = useCart()
  const { isAuthenticated, setPendingAction } = useAuth()
  const { addToWishlist, checkInWishlist } = useWishlist()

  // =======================================
  // ⭐ CALIFICACIONES SEGURAS
  // =======================================
  useEffect(() => {
    if (!product) {
      setRating({ promedio: 0, total: 0 })
      return
    }

    const res = calcularCalificacionPromedio(product.id)
    setRating({ promedio: res.promedio, total: res.total })
  }, [product])

  // =======================================
  // ⭐ WISHLIST SINCRONIZADO
  // =======================================
  useEffect(() => {
    if (!product) return setIsInWishlist(false)
    setIsInWishlist(checkInWishlist(product.id))
  }, [product, checkInWishlist])

  // =======================================
  // ⭐ OFERTAS ACTIVAS
  // =======================================
  const activeOffer = product ? OfferSystem.getActiveOffer(product.id) : null

  const displayPrice = activeOffer
    ? activeOffer.currentPrice
    : product?.price ?? 0

  const originalPrice = activeOffer ? activeOffer.originalPrice : null
  const discountPercentage = activeOffer ? activeOffer.discountPercentage : null

  if (!product) return null

  // =======================================
  // 🛒 AGREGAR AL CARRITO
  // =======================================
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setPendingAction(() => agregarAlCarrito)
      setShowAuthDialog(true)
      return
    }
    agregarAlCarrito()
  }

  const agregarAlCarrito = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: displayPrice,
        image: product.image,
        type: product.type,
        category: product.category
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
      setQuantity(1)
    }, 1500)
  }

  // =======================================
  // 💳 COMPRAR AHORA
  // =======================================
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setPendingAction(() => () => setShowCheckout(true))
      setShowAuthDialog(true)
      return
    }
    setShowCheckout(true)
  }

  // =======================================
  // ❤ AGREGAR A WISHLIST
  // =======================================
  const handleAddToWishlist = () => {
    if (!isAuthenticated) return setShowAuthDialog(true)

    const added = addToWishlist({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image,
      type: product.type,
      category: product.category
    })

    if (added) setIsInWishlist(true)
  }

  // =======================================
  // 🖼 RENDER
  // =======================================
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">

          {/* Requerido por Radix */}
          <VisuallyHidden>
            <DialogTitle>{product.name}</DialogTitle>
          </VisuallyHidden>

          {/* ======================== */}
          {/* ✔ VISTA DE ÉXITO         */}
          {/* ======================== */}
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/20 p-6 mb-4 animate-in zoom-in duration-300">
                <Check className="h-16 w-16 text-primary" />
              </div>
              <h3 className="font-bebas text-3xl">¡AGREGADO AL CARRITO!</h3>
              <p className="text-muted-foreground">Tu producto ha sido agregado exitosamente</p>
            </div>
          ) : (

            // ========================
            // ✔ CONTENIDO DEL MODAL
            // ========================
            <Tabs defaultValue="detalles" className="w-full">

              {/* TABS */}
              <TabsList className={`grid w-full ${product.type === "product" ? "grid-cols-2" : "grid-cols-1"} mb-6`}>
                <TabsTrigger value="detalles">Detalles</TabsTrigger>

                {product.type === "product" && (
                  <TabsTrigger value="resenas">
                    Reseñas {rating.total > 0 ? `(${rating.total})` : ""}
                  </TabsTrigger>
                )}
              </TabsList>

              {/* ======================== */}
              {/* TAB — DETALLES           */}
              {/* ======================== */}
              <TabsContent value="detalles">
                <div className="grid md:grid-cols-2 gap-8">

                  {/* Imagen */}
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col">

                    <h2 className="font-bebas text-4xl mb-2">{product.name}</h2>

                    {/* ⭐ Rating */}
                    {product.type === "product" && (
                      <div className="flex items-center gap-2 mb-4">
                        <CalificacionEstrellas
                          calificacion={rating.promedio}
                          readonly
                          tamano="md"
                          mostrarNumero
                        />
                        <span className="text-sm text-muted-foreground">
                          ({rating.total} reseñas)
                        </span>
                      </div>
                    )}

                    {/* 💰 Precios */}
                    <div className="mb-6">
                      {originalPrice && (
                        <div className="text-lg text-muted-foreground line-through">
                          ${originalPrice.toLocaleString("es-CO")}
                        </div>
                      )}

                      <span className="font-bebas text-5xl text-primary">
                        ${displayPrice.toLocaleString("es-CO")}
                      </span>

                      {discountPercentage && (
                        <span className="ml-3 text-sm font-semibold text-green-600">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Cantidad */}
                    {product.type === "product" && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Cantidad</label>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="text-xl font-semibold w-12 text-center">
                            {quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity((p) => p + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleAddToWishlist}
                        variant="outline"
                        className="w-full h-12"
                        disabled={isInWishlist}
                      >
                        <Heart
                          className={`mr-2 h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {isInWishlist ? "En Lista de Deseos" : "Agregar a Deseos"}
                      </Button>

                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="w-full h-12"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Agregar al Carrito
                      </Button>

                      <Button
                        onClick={handleBuyNow}
                        className="w-full h-12 font-bold"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Comprar Ahora
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ======================== */}
              {/* TAB — RESEÑAS           */}
              {/* ======================== */}
              {product.type === "product" && (
                <TabsContent value="resenas">
                  <SeccionResenasProducto
                    productoId={product.id}
                    productoNombre={product.name}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOGOS */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        onSuccess={() => {
          setShowCheckout(false)
          onOpenChange(false)
          setQuantity(1)
        }}
      />
    </>
  )
}
