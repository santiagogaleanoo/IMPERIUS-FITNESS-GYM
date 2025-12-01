"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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

  const getUserWishlistKey = useCallback(
    () => (user ? `imperius_wishlist_${user.id}` : ""),
    [user],
  )

  // --------------------------------------------------
  // Cargar wishlist desde localStorage + aplicar ofertas
  // --------------------------------------------------
  const loadWishlist = useCallback(() => {
    if (!user || !isAuthenticated || typeof window === "undefined") {
      setWishlistItems([])
      return
    }

    const key = getUserWishlistKey()
    if (!key) return

    const saved = localStorage.getItem(key)
    if (!saved) {
      setWishlistItems([])
      return
    }

    const parsed: WishlistItem[] = JSON.parse(saved)

    // 🔥 Aquí se vuelven a consultar las ofertas activas
    const updated = parsed.map((item) => {
      const offer = OfferSystem.getActiveOffer(item.id)
      if (!offer) {
        return {
          ...item,
          hasDiscount: false,
          discountPercentage: undefined,
          // si en localStorage quedó guardado el precio con oferta,
          // pero la oferta ya terminó, volvemos al original si existe:
          price: item.originalPrice ?? item.price,
        }
      }

      return {
        ...item,
        hasDiscount: true,
        price: offer.currentPrice,
        originalPrice: offer.originalPrice ?? item.originalPrice ?? item.price,
        discountPercentage: offer.discountPercentage,
      }
    })

    setWishlistItems(updated)
  }, [user, isAuthenticated, getUserWishlistKey])

  const saveWishlist = (items: WishlistItem[]) => {
    if (typeof window === "undefined") return
    const key = getUserWishlistKey()
    if (!key) return
    localStorage.setItem(key, JSON.stringify(items))

    if (typeof window !== "undefined" && user) {
      window.dispatchEvent(
        new CustomEvent("imperius:wishlist-updated", {
          detail: { userId: user.id },
        }),
      )
    }
  }

  // Cargar al iniciar sesión / cambiar usuario
  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  // Escuchar cuando otra parte actualice la wishlist (add / remove / OfferSystem)
  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (event: Event) => {
      const ev = event as CustomEvent<{ userId: string }>
      if (!user) return
      if (!ev.detail || ev.detail.userId !== user.id) return
      loadWishlist()
    }

    window.addEventListener("imperius:wishlist-updated", handler)
    return () => {
      window.removeEventListener("imperius:wishlist-updated", handler)
    }
  }, [user, loadWishlist])

  // 🔁 Refresco periódico para pillar nuevas ofertas sin recargar
  useEffect(() => {
    if (typeof window === "undefined") return
    const id = setInterval(() => {
      // actualiza estados de las ofertas en localStorage
      OfferSystem.updateOffersStatus()
      // y vuelve a aplicar ofertas a los productos de la wishlist
      loadWishlist()
    }, 15 * 1000) // cada 15 segundos

    return () => clearInterval(id)
  }, [loadWishlist])

  // ==========================================
  // ➕ AGREGAR A WISHLIST (usado dentro del drawer)
  // ==========================================
  const addToWishlistInternal = (product: Omit<WishlistItem, "hasDiscount">) => {
    if (!isAuthenticated || !user) {
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

  // ==========================================
  // ❌ ELIMINAR DE WISHLIST
  // ==========================================
  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter((item) => item.id !== productId)
    setWishlistItems(updated)
    saveWishlist(updated)
  }

  // ==========================================
  // 🛒 MOVER AL CARRITO
  // ==========================================
  const moveToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price, // ya con descuento si lo tiene
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
          <Button
            variant="ghost"
            size="icon"
            className="relative text-secondary-foreground hover:text-primary"
          >
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
              <Badge variant="secondary" className="ml-2">
                {wishlistCount}
              </Badge>
            </SheetTitle>
          </SheetHeader>

          {wishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Tu lista de deseos está vacía
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Guarda tus productos favoritos aquí para comprarlos después
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 border rounded-lg bg-card"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {item.name}
                      </h4>

                      {/* PRECIOS */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-primary">
                          ${item.price.toLocaleString("es-CO")}
                        </span>

                        {item.originalPrice &&
                          item.originalPrice !== item.price && (
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
                      <Button
                        size="sm"
                        onClick={() => moveToCart(item)}
                        className="h-8"
                      >
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
// HOOK para usar en otros componentes (cards, etc.)
// ==================================================
export function useWishlist() {
  const { user, isAuthenticated } = useAuth()

  const addToWishlist = (product: Omit<WishlistItem, "hasDiscount">) => {
    if (!user || !isAuthenticated || typeof window === "undefined") return false

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

    window.dispatchEvent(
      new CustomEvent("imperius:wishlist-updated", {
        detail: { userId: user.id },
      }),
    )

    return true
  }

  const checkInWishlist = (id: string) => {
    if (!user || typeof window === "undefined") return false
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    if (!saved) return false
    return JSON.parse(saved).some((item: WishlistItem) => item.id === id)
  }

  const removeFromWishlist = (id: string) => {
    if (!user || typeof window === "undefined") return false
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    if (!saved) return false

    const updated = JSON.parse(saved).filter(
      (item: WishlistItem) => item.id !== id,
    )
    localStorage.setItem(key, JSON.stringify(updated))

    window.dispatchEvent(
      new CustomEvent("imperius:wishlist-updated", {
        detail: { userId: user.id },
      }),
    )

    return true
  }

  const getWishlistItems = () => {
    if (!user || typeof window === "undefined") return []
    const key = `imperius_wishlist_${user.id}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  }

  return { addToWishlist, checkInWishlist, removeFromWishlist, getWishlistItems }
}
