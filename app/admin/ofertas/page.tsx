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
    name: "Camiseta Imperious",
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

  // Cargar ofertas activas al entrar
  useEffect(() => {
    try {
      const offers = OfferSystem.getAllActiveOffers()
      setActiveOffers(offers)
    } catch (error) {
      console.error("Error cargando ofertas activas:", error)
    }
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

      // refrescar lista de ofertas activas
      const updated = OfferSystem.getAllActiveOffers()
      setActiveOffers(updated)

      setMessage("✅ Oferta creada/actualizada correctamente")

      // opcional: limpiar solo campos de texto
      // setSelectedProductId("")
      // setOriginalPrice("")
      // setCurrentPrice("")
      // setDiscountPercentage("")
      // setStartDate("")
      // setEndDate("")
      // setTitle("")
      // setDescription("")
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
      const updated = OfferSystem.getAllActiveOffers()
      setActiveOffers(updated)
      setMessage("✅ Oferta eliminada")
    } catch (error) {
      console.error("Error eliminando oferta:", error)
      setMessage("❌ No se pudo eliminar la oferta")
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de Ofertas (Admin)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Desde aquí puedes crear y administrar las ofertas de productos.
            </p>
          </div>
        </header>

        {message && (
          <div className="border rounded-md px-4 py-2 text-sm bg-muted">
            {message}
          </div>
        )}

        {/* FORMULARIO CREAR / ACTUALIZAR OFERTA */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Crear / actualizar oferta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Producto
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background"
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
                <label className="text-sm font-medium">
                  Precio original
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                  placeholder="Ej: 100000"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Precio en oferta
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                  placeholder="Ej: 90000"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">% de descuento</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                  placeholder="Se calcula automático"
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Fecha y hora de inicio
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Fecha y hora de fin
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                />
              </div>
            </div>

            {/* Título y descripción opcionales */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Título (opcional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background"
                placeholder="Ej: 🔥 Camiseta Imperious en oferta"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background min-h-[70px] resize-y"
                placeholder="Texto que verán los usuarios en la notificación / correo."
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Crear / actualizar oferta"}
              </Button>
            </div>
          </form>
        </Card>

        {/* LISTA DE OFERTAS ACTIVAS */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Ofertas activas</h2>

          {activeOffers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
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
                    className="border rounded-md px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium">
                        {product ? product.name : offer.productId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          Precio original:{" "}
                          <span className="line-through">
                            ${offer.originalPrice.toLocaleString("es-CO")}
                          </span>{" "}
                          | Oferta:{" "}
                          <span className="font-semibold text-green-600">
                            ${offer.currentPrice.toLocaleString("es-CO")}
                          </span>{" "}
                          ({offer.discountPercentage}%)
                        </div>
                        <div className="text-xs mt-1">
                          Desde: {start.toLocaleString("es-CO")} <br />
                          Hasta: {end.toLocaleString("es-CO")}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOffer(offer.productId)}
                    >
                      Eliminar oferta
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
