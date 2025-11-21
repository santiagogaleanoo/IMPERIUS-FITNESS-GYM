// lib/sistema-ofertas.ts
export interface ProductOffer {
  productId: string
  originalPrice: number
  currentPrice: number
  discountPercentage: number
  startDate: string
  endDate: string
  isActive: boolean
  title?: string
  description?: string
}

export interface OfferNotification {
  id: string
  type: "OFFER"
  title: string
  message: string
  productId: string
  timestamp: string
  read: boolean
}

export class OfferSystem {
  private static readonly STORAGE_KEY = "imperius_product_offers"
  private static readonly NOTIFICATION_KEY = "imperius_offer_notifications"

  // -------------------------------
  // 📍 CREAR OFERTA DESDE ADMIN
  // -------------------------------
  static createOffer(offer: Omit<ProductOffer, "isActive">): void {
    const offers = this.getAllOffers()

    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)

    const newOffer: ProductOffer = {
      ...offer,
      isActive: start <= now && end >= now,
    }

    const existingIndex = offers.findIndex(o => o.productId === offer.productId)
    if (existingIndex !== -1) {
      offers[existingIndex] = newOffer
    } else {
      offers.push(newOffer)
    }

    this.saveOffers(offers)
    this.notifyUsersAboutOffer(newOffer)
  }

  // -------------------------------
  // 📍 OBTENER OFERTA ACTIVA
  // -------------------------------
  static getActiveOffer(productId: string): ProductOffer | null {
    const offers = this.getAllOffers()
    const now = new Date()

    return (
      offers.find(offer => {
        const start = new Date(offer.startDate)
        const end = new Date(offer.endDate)

        return (
          offer.productId === productId &&
          start <= now &&
          end >= now
        )
      }) || null
    )
  }

  // -------------------------------
  // 📍 TODAS LAS OFERTAS ACTIVAS
  // -------------------------------
  static getAllActiveOffers(): ProductOffer[] {
    const offers = this.getAllOffers()
    const now = new Date()

    return offers.filter(offer => {
      const start = new Date(offer.startDate)
      const end = new Date(offer.endDate)
      return start <= now && end >= now
    })
  }

  // -------------------------------
  // 📍 ACTUALIZAR ESTADO AUTOMÁTICO
  // -------------------------------
  static updateOffersStatus(): void {
    const offers = this.getAllOffers()
    const now = new Date()
    let updated = false

    const updatedOffers = offers.map(offer => {
      const start = new Date(offer.startDate)
      const end = new Date(offer.endDate)
      const isNowActive = start <= now && end >= now

      if (offer.isActive !== isNowActive) updated = true

      return { ...offer, isActive: isNowActive }
    })

    if (updated) this.saveOffers(updatedOffers)
  }

  // -------------------------------
  // 📍 NOTIFICAR USUARIOS
  // -------------------------------
  private static notifyUsersAboutOffer(offer: ProductOffer): void {
    if (typeof window === "undefined") return

    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)
    if (start > now || end < now) return

    const users = JSON.parse(localStorage.getItem("imperius_users_database") || "[]")

    users.forEach((user: any) => {
      if (user?.id) {
        this.addUserNotification(user.id, offer)
        this.updateWishlistItemDiscount(user.id, user.email, offer)
      }
    })
  }

  private static addUserNotification(userId: string, offer: ProductOffer): void {
    const notifications = this.getUserNotifications(userId)

    const newNotification: OfferNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "OFFER",
      title: offer.title || "🎉 ¡Nuevo descuento disponible!",
      message:
        offer.description ||
        `Un producto que sigues tiene ${offer.discountPercentage}% de descuento`,
      productId: offer.productId,
      timestamp: new Date().toISOString(),
      read: false,
    }

    notifications.unshift(newNotification)
    this.saveUserNotifications(userId, notifications)
  }

  // -------------------------------
  // 📍 ACTUALIZAR LISTA DE DESEOS
  // -------------------------------
  private static updateWishlistItemDiscount(
    userId: string,
    userEmail: string,
    offer: ProductOffer,
  ): void {
    if (typeof window === "undefined") return

    const wishlistKey = `imperius_wishlist_${userId}`
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]")

    let updated = false
    let productName = ""
    let priceBefore = 0

    const updatedWishlist = wishlist.map((item: any) => {
      if (item.id === offer.productId) {
        updated = true
        const originalPrice = item.originalPrice ?? item.price

        productName = item.name
        priceBefore = originalPrice

        return {
          ...item,
          hasDiscount: true,
          originalPrice,
          price: offer.currentPrice,
          discountPercentage: offer.discountPercentage,
        }
      }
      return item
    })

    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist))

    if (!updated) return

    // 📩 INVOCACIÓN AL BACKEND (OPCIONAL)
    if (userEmail) {
      fetch("http://localhost/php/send-mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "OFFER",
          email: userEmail,
          productName,
          oldPrice: priceBefore,
          newPrice: offer.currentPrice,
          discountPercentage: offer.discountPercentage,
        }),
      }).catch(() => {})
    }
  }

  // -------------------------------
  // 📍 NOTIFICACIONES
  // -------------------------------
  static getUserNotifications(userId: string): OfferNotification[] {
    if (typeof window === "undefined") return []
    const key = `${this.NOTIFICATION_KEY}_${userId}`
    return JSON.parse(localStorage.getItem(key) || "[]")
  }

  static markNotificationAsRead(userId: string, notificationId: string): void {
    const notifications = this.getUserNotifications(userId)
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n,
    )
    this.saveUserNotifications(userId, updated)
  }

  // -------------------------------
  // 📍 ELIMINAR OFERTA
  // -------------------------------
  static removeOffer(productId: string): void {
    const offers = this.getAllOffers()
    const updated = offers.filter(o => o.productId !== productId)
    this.saveOffers(updated)
  }

  // -------------------------------
  // 📍 ESTADÍSTICAS
  // -------------------------------
  static getOfferStats() {
    const offers = this.getAllOffers()
    const now = new Date()

    const active = offers.filter(o => {
      const start = new Date(o.startDate)
      const end = new Date(o.endDate)
      return start <= now && end >= now
    })

    return {
      totalOffers: offers.length,
      activeOffers: active.length,
      expiredOffers: offers.filter(o => new Date(o.endDate) < now).length,
      upcomingOffers: offers.filter(o => new Date(o.startDate) > now).length,
      averageDiscount:
        active.length > 0
          ? active.reduce((sum, o) => sum + o.discountPercentage, 0) /
            active.length
          : 0,
    }
  }

  // -------------------------------
  // 📍 LOCALSTORAGE HELPERS
  // -------------------------------
  private static getAllOffers(): ProductOffer[] {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  }

  private static saveOffers(offers: ProductOffer[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offers))
  }

  private static saveUserNotifications(
    userId: string,
    notifications: OfferNotification[],
  ): void {
    if (typeof window === "undefined") return
    const key = `${this.NOTIFICATION_KEY}_${userId}`
    localStorage.setItem(key, JSON.stringify(notifications))
  }
}

// -------------------------------
// ⏱ AUTO-ACTUALIZACIÓN CADA HORA
// -------------------------------
if (typeof window !== "undefined") {
  OfferSystem.updateOffersStatus()
  setInterval(() => OfferSystem.updateOffersStatus(), 60 * 60 * 1000)
}
