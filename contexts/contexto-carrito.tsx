"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/contexto-autenticacion"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  type: "product" | "membership"
  category?: string
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const userCartKey = `imperius_cart_${user.id}`
      const savedCart = localStorage.getItem(userCartKey)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      } else {
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [user])

  useEffect(() => {
    if (user && items.length >= 0) {
      const userCartKey = `imperius_cart_${user.id}`
      localStorage.setItem(userCartKey, JSON.stringify(items))
    }
  }, [items, user])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id)
      if (existingItem) {
        toast({
          title: "Cantidad actualizada",
          description: `${item.name} - Cantidad: ${existingItem.quantity + 1}`,
          duration: 2000,
        })
        return currentItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      toast({
        title: "Producto agregado",
        description: `${item.name} se agregó al carrito`,
        duration: 2000,
      })
      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
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
