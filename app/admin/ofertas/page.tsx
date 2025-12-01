// app/admin/ofertas/page.tsx
"use client"

import { useEffect, useMemo, useState, FormEvent } from "react"
import { OfferSystem, type ProductOffer } from "@/lib/sistema-ofertas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// ⚠️ Lista de productos base (la misma info que tienes en seccion-tienda, resumida)
const products = [
  {
    id: "product-1",
    name: "Proteína Whey Pro",
    basePrice: 180000,
  },
  {
    id: "product-2",
    name: "Camiseta Imperius",
    basePrice: 100000,
  },
  {
    id: "product-3",
    name: "Pre-Workout Extreme",
    basePrice: 140000,
  },
  {
    id: "product-4",
    name: "Shorts Deportivos",
    basePrice: 120000,
  },
  {
    id: "product-5",
    name: "Creatina Monohidrato",
    basePrice: 112000,
  },
  {
    id: "product-6",
    name: "Guantes de Entrenamiento",
    basePrice: 80000,
  },
]

export default function AdminOfertasPage() {
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [originalPrice, setOriginalPrice] = useState<string>("")
  const [currentPrice, setCurrentPrice] = useState<string>("")
  const [discountPercentage, setDiscountPercentage] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [activeOffers, setActiveOffers] = useState<ProductOffer[]>([])
  const [expiredOffers, setExpiredOffers] = useState<ProductOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Producto actualmente seleccionado
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [selectedProductId],
  )

  // Cuando cambias de producto, rellenar precio original por defecto
  useEffect(() => {
    if (selectedProduct) {
      setOriginalPrice(String(selectedProduct.basePrice))
      // si no hay precio actual, lo igualamos al original
      setCurrentPrice((prev) => prev || String(selectedProduct.basePrice))
    } else {
      setOriginalPrice("")
      setCurrentPrice("")
    }
  }, [selectedProduct])

  // Recalcular % descuento cuando cambian precios
  useEffect(() => {
    const orig = Number(originalPrice)
    const curr = Number(currentPrice)
    if (orig > 0 && curr > 0 && curr < orig) {
      const diff = orig - curr
      const pct = Math.round((diff / orig) * 100)
      setDiscountPercentage(String(pct))
    } else if (orig > 0 && curr >= orig) {
      setDiscountPercentage("0")
    }
  }, [originalPrice, currentPrice])

  // -----------------------------
  // Helper para recalcular listas
  // -----------------------------
  const recomputeOffers = () => {
    try {
      const now = new Date()

      // Activas usando el sistema central
      const active = OfferSystem.getAllActiveOffers()

      // Todas las ofertas desde localStorage para detectar caducadas
      let all: ProductOffer[] = []
      if (typeof window !== "undefined") {
        all = JSON.parse(
          localStorage.getItem("imperius_product_offers") || "[]",
        ) as ProductOffer[]
      }

      const expired = all.filter((o) => new Date(o.endDate) < now)

      setActiveOffers(active)
      setExpiredOffers(expired)
    } catch (error) {
      console.error("Error al recalcular ofertas:", error)
    }
  }

  // Cargar ofertas al entrar + auto-actualizar
  useEffect(() => {
    // primera carga
    recomputeOffers()

    // cada 20s actualizamos estado interno del sistema y recargamos
    const interval = setInterval(() => {
      OfferSystem.updateOffersStatus()
      recomputeOffers()
    }, 20_000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!selectedProduct) {
      setMessage("Selecciona un producto")
      return
    }

    const orig = Number(originalPrice)
    const curr = Number(currentPrice)
    const pct =
      discountPercentage.trim() !== ""
        ? Number(discountPercentage)
        : orig > 0 && curr > 0
        ? Math.round(((orig - curr) / orig) * 100)
        : 0

    if (!orig || !curr || !startDate || !endDate) {
      setMessage("Faltan datos obligatorios (precios o fechas)")
      return
    }

    if (curr >= orig) {
      setMessage("El precio en oferta debe ser menor que el precio original")
      return
    }

    setLoading(true)

    try {
      OfferSystem.createOffer({
        productId: selectedProduct.id,
        originalPrice: orig,
        currentPrice: curr,
        discountPercentage: pct,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        title: title || `Oferta en ${selectedProduct.name}`,
        description:
          description ||
          `Descuento del ${pct}% en ${selectedProduct.name} por tiempo limitado.`,
      })

      // refrescar listas con la nueva oferta
      recomputeOffers()

      setMessage("✅ Oferta creada/actualizada correctamente")
    } catch (error) {
      console.error("Error creando oferta:", error)
      setMessage("❌ Ocurrió un error al crear la oferta (ver consola).")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveOffer = (productId: string) => {
    if (!confirm("¿Seguro que quieres eliminar la oferta de este producto?"))
      return

    try {
      OfferSystem.removeOffer(productId)
      recomputeOffers()
      setMessage("✅ Oferta eliminada")
    } catch (error) {
      console.error("Error eliminando oferta:", error)
      setMessage("❌ No se pudo eliminar la oferta")
    }
  }

  const handleRemoveExpiredOffer = (productId: string) => {
    if (!confirm("¿Eliminar definitivamente esta oferta caducada?")) return

    try {
      OfferSystem.removeOffer(productId)
      recomputeOffers()
      setMessage("✅ Oferta caducada eliminada")
    } catch (error) {
      console.error("Error eliminando oferta caducada:", error)
      setMessage("❌ No se pudo eliminar la oferta caducada")
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-slate-900">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de Ofertas (Admin)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Crea, administra y revisa las ofertas activas y caducadas de la
              tienda.
            </p>
          </div>
        </header>

        {message && (
          <div className="border border-yellow-400 rounded-md px-4 py-2 text-sm bg-yellow-50 text-yellow-800">
            {message}
          </div>
        )}

        {/* FORMULARIO CREAR / ACTUALIZAR OFERTA */}
        <Card className="p-6 space-y-4 bg-white border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Crear / actualizar oferta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-800">
                Producto
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value="">Selecciona un producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (base: ${p.basePrice.toLocaleString("es-CO")})
                  </option>
                ))}
              </select>
            </div>

            {/* Precios */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-800">
                  Precio original
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                  placeholder="Ej: 100000"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-800">
                  Precio en oferta
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                  placeholder="Ej: 90000"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-800">
                  % de descuento
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                  placeholder="Se calcula automático"
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-800">
                  Fecha y hora de inicio
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-800">
                  Fecha y hora de fin
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white text-slate-900"
                />
              </div>
            </div>
    
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                {loading ? "Guardando..." : "Crear / actualizar oferta"}
              </Button>
            </div>
          </form>
        </Card>

        {/* LISTA DE OFERTAS ACTIVAS */}
        <Card className="p-6 space-y-4 bg-white border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-700">
            Ofertas activas
          </h2>

          {activeOffers.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hay ofertas activas en este momento.
            </p>
          ) : (
            <div className="space-y-3">
              {activeOffers.map((offer) => {
                const product =
                  products.find((p) => p.id === offer.productId) || null
                const start = new Date(offer.startDate)
                const end = new Date(offer.endDate)

                return (
                  <div
                    key={offer.productId}
                    className="border border-emerald-200 rounded-md px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-emerald-50/40"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {product ? product.name : offer.productId}
                      </div>
                      <div className="text-sm text-slate-700">
                        <div>
                          Precio original:{" "}
                          <span className="line-through text-slate-500">
                            ${offer.originalPrice.toLocaleString("es-CO")}
                          </span>{" "}
                          | Oferta:{" "}
                          <span className="font-semibold text-emerald-700">
                            ${offer.currentPrice.toLocaleString("es-CO")}
                          </span>{" "}
                          ({offer.discountPercentage}%)
                        </div>
                        <div className="text-xs mt-1 text-slate-500">
                          Desde: {start.toLocaleString("es-CO")} <br />
                          Hasta: {end.toLocaleString("es-CO")}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOffer(offer.productId)}
                      className="border-red-400 text-red-600 hover:bg-red-50"
                    >
                      Eliminar oferta
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* LISTA DE OFERTAS CADUCADAS */}
        <Card className="p-6 space-y-4 bg-white border-slate-200 shadow-sm mb-10">
          <h2 className="text-xl font-semibold text-red-700">
            Ofertas caducadas
          </h2>

          {expiredOffers.length === 0 ? (
            <p className="text-sm text-slate-600">
              Aún no hay ofertas caducadas registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {expiredOffers.map((offer) => {
                const product =
                  products.find((p) => p.id === offer.productId) || null
                const start = new Date(offer.startDate)
                const end = new Date(offer.endDate)

                return (
                  <div
                    key={offer.productId + "_expired"}
                    className="border border-red-200 rounded-md px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-red-50/60"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {product ? product.name : offer.productId}
                      </div>
                      <div className="text-sm text-slate-700">
                        <div>
                          Último precio en oferta:{" "}
                          <span className="font-semibold text-amber-700">
                            ${offer.currentPrice.toLocaleString("es-CO")}
                          </span>{" "}
                          ({offer.discountPercentage}%)
                        </div>
                        <div className="text-xs mt-1 text-slate-500">
                          Vigencia: {start.toLocaleString("es-CO")} —{" "}
                          {end.toLocaleString("es-CO")}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveExpiredOffer(offer.productId)}
                      className="border-red-400 text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
