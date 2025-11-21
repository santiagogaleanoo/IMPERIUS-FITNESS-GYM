"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { OfferSystem } from "@/lib/sistema-ofertas"

export interface CartItem {
  id: string
  name: string
  price: number // SIEMPRE precio final (con descuento si aplica)
  quantity: number
  image?: string
  type: "product" | "membership"
  category?: string
  originalPrice?: number // precio original para mostrar tachado
  discountPercentage?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface PendingToast {
  title: string
  description: string
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [pendingToast, setPendingToast] = useState<PendingToast | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  // ==================================================
  // 📌 CARGAR CARRITO DEL USUARIO
  // ==================================================
  useEffect(() => {
    if (user) {
      const key = `imperius_cart_${user.id}`
      const saved = localStorage.getItem(key)
      if (saved) {
        setItems(JSON.parse(saved))
      } else {
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [user])

  // ==================================================
  // 📌 GUARDAR CARRITO DEL USUARIO
  // ==================================================
  useEffect(() => {
    if (user) {
      const key = `imperius_cart_${user.id}`
      localStorage.setItem(key, JSON.stringify(items))
    }
  }, [items, user])

  // ==================================================
  // 📌 EJECUTAR TOAST FUERA DEL RENDER
  // ==================================================
  useEffect(() => {
    if (pendingToast) {
      toast({
        title: pendingToast.title,
        description: pendingToast.description,
        duration: 2000,
      })
      setPendingToast(null)
    }
  }, [pendingToast, toast])

  // ==================================================
  // 📌 FUNCIÓN: AGREGAR AL CARRITO
  // ==================================================
  const addItem = (item: Omit<CartItem, "quantity">) => {
    let toastToShow: PendingToast | null = null

    setItems((current) => {
      const existing = current.find((i) => i.id === item.id)

      // Si ya existe → solo aumentar cantidad
      if (existing) {
        toastToShow = {
          title: "Cantidad actualizada",
          description: `${item.name} - Cantidad: ${existing.quantity + 1}`,
        }

        return current.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }

      // COMPROBAR SI ESTE PRODUCTO TIENE OFERTA
      const offer = OfferSystem.getActiveOffer(item.id)

      const finalItem: CartItem = {
        ...item,
        quantity: 1,
        price: offer ? offer.currentPrice : item.price,
        originalPrice: offer ? offer.originalPrice : item.price,
        discountPercentage: offer ? offer.discountPercentage : undefined,
      }

      toastToShow = {
        title: "Producto agregado",
        description: `${item.name} se agregó al carrito`,
      }

      return [...current, finalItem]
    })

    // Ejecutar toast fuera del setState
    if (toastToShow) setPendingToast(toastToShow)
  }

  // ==================================================
  // 📌 ELIMINAR PRODUCTO
  // ==================================================
  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  // ==================================================
  // 📌 ACTUALIZAR CANTIDAD
  // ==================================================
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id)

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    )
  }

  // ==================================================
  // 📌 LIMPIAR CARRITO
  // ==================================================
  const clearCart = () => setItems([])

  // ==================================================
  // 📌 TOTALES
  // ==================================================
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
