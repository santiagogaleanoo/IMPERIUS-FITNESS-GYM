"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, ShoppingCart, Trash2, Bell } from "lucide-react"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { AuthDialog } from "./dialogo-autenticacion"
import { useCart } from "@/contexts/contexto-carrito"
import { Badge } from "@/components/ui/badge"
import { OfferSystem } from "@/lib/sistema-ofertas"

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  category?: string
  type: "product" | "membership"
  hasDiscount?: boolean
  discountPercentage?: number
}

export function WishlistDrawer() {
  const [open, setOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const { isAuthenticated, user } = useAuth()
  const { addItem } = useCart()

  // ==================================================
  // 📌 CARGAR LISTA DE DESEOS AL INICIAR
  // ==================================================
  useEffect(() => {
    if (user && isAuthenticated) {
      loadWishlist()
    }
  }, [user, isAuthenticated])

  const getUserWishlistKey = () => (user ? `imperius_wishlist_${user.id}` : "")

  const loadWishlist = () => {
    const key = getUserWishlistKey()
    if (!key) return

    const saved = localStorage.getItem(key)

    if (!saved) return setWishlistItems([])

    const parsed: WishlistItem[] = JSON.parse(saved)

    // 🔥 Actualizar precios si hay oferta activa
    const updated = parsed.map((item) => {
      const offer = OfferSystem.getActiveOffer(item.id)

      if (!offer) return item

      return {
        ...item,
        price: offer.currentPrice,
        originalPrice: offer.originalPrice,
        discountPercentage: offer.discountPercentage,
        hasDiscount: true,
      }
    })

    setWishlistItems(updated)
  }

  const saveWishlist = (items: WishlistItem[]) => {
    const key = getUserWishlistKey()
    if (!key) return
    localStorage.setItem(key, JSON.stringify(items))
  }

  // ==================================================
  // ➕ AGREGAR A LISTA DE DESEOS
  // ==================================================
  const addToWishlistInternal = (product: Omit<WishlistItem, "hasDiscount">) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    const existing = wishlistItems.find((item) => item.id === product.id)
    if (existing) return

    const offer = OfferSystem.getActiveOffer(product.id)

    const newItem: WishlistItem = {
      ...product,
      hasDiscount: !!offer,
      price: offer ? offer.currentPrice : product.price,
      originalPrice: offer ? offer.originalPrice : product.price,
      discountPercentage: offer?.discountPercentage,
    }

    const updated = [...wishlistItems, newItem]
    setWishlistItems(updated)
    saveWishlist(updated)
  }

  // ==================================================
  // ❌ ELIMINAR DE LISTA DE DESEOS
  // ==================================================
  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter((item) => item.id !== productId)
    setWishlistItems(updated)
    saveWishlist(updated)
  }

  // ==================================================
  // 🛒 MOVER AL CARRITO
  // ==================================================
  const moveToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price, // ya con descuento si aplica
      image: item.image,
      type: item.type,
      category: item.category,
    })

    removeFromWishlist(item.id)
  }

  const wishlistCount = wishlistItems.length

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-secondary-foreground hover:text-primary">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Mi Lista de Deseos
              <Badge variant="secondary" className="ml-2">{wishlistCount}</Badge>
            </SheetTitle>
          </SheetHeader>

          {wishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tu lista de deseos está vacía</h3>
              <p className="text-muted-foreground text-center mb-4">
                Guarda tus productos favoritos aquí para comprarlos después
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg bg-card">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>

                      {/* PRECIOS */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-primary">
                          ${item.price.toLocaleString("es-CO")}
                        </span>

                        {item.originalPrice && item.originalPrice !== item.price && (
                          <span className="text-sm line-through text-muted-foreground">
                            ${item.originalPrice.toLocaleString("es-CO")}
                          </span>
                        )}

                        {item.discountPercentage && (
                          <Badge variant="destructive" className="text-xs">
                            -{item.discountPercentage}%
                          </Badge>
                        )}
                      </div>

                      {item.hasDiscount && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                          <Bell className="h-3 w-3" />
                          <span>¡En oferta!</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button size="sm" onClick={() => moveToCart(item)} className="h-8">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                        className="h-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  )
}

// ==================================================
// ✔ HOOK PARA USAR EN COMPONENTES INTERNOS
// ==================================================
export function useWishlist() {
  const { user, isAuthenticated } = useAuth()

  const addToWishlist = (product: Omit<WishlistItem, "hasDiscount">) => {
    if (!user || !isAuthenticated) return false

    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)

    const current: WishlistItem[] = saved ? JSON.parse(saved) : []

    const exists = current.some((item) => item.id === product.id)
    if (exists) return false

    const offer = OfferSystem.getActiveOffer(product.id)

    const newItem: WishlistItem = {
      ...product,
      hasDiscount: !!offer,
      price: offer ? offer.currentPrice : product.price,
      originalPrice: offer ? offer.originalPrice : product.price,
      discountPercentage: offer?.discountPercentage,
    }

    const updated = [...current, newItem]
    localStorage.setItem(key, JSON.stringify(updated))
    return true
  }

  const checkInWishlist = (id: string) => {
    if (!user) return false
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    if (!saved) return false
    return JSON.parse(saved).some((item: WishlistItem) => item.id === id)
  }

  const removeFromWishlist = (id: string) => {
    if (!user) return false
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    if (!saved) return false

    const updated = JSON.parse(saved).filter((item: WishlistItem) => item.id !== id)
    localStorage.setItem(key, JSON.stringify(updated))
    return true
  }

  const getWishlistItems = () => {
    if (!user) return []
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  }

  return { addToWishlist, checkInWishlist, removeFromWishlist, getWishlistItems }
}
