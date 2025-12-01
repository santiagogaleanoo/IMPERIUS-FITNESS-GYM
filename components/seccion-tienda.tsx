// components/seccion-tienda.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ProductQuickView } from "./vista-rapida-producto"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"
import { CalificacionEstrellas } from "./calificacion-estrellas"
import { OfferSystem, type ProductOffer } from "@/lib/sistema-ofertas"

// Solo los productos más vendidos para el carrusel
const featuredProducts = [
  {
    id: "product-1",
    name: "Proteína Whey Pro",
    category: "Suplementos",
    price: 180000,
    image: "/whey-protein-container-black-and-gold.jpg",
    description:
      "Proteína de suero de alta calidad con 25g de proteína por porción",
    type: "product" as const,
    features: [
      "25g de proteína por porción",
      "Bajo en azúcar y grasa",
      "Fácil digestión",
      "Sabor chocolate premium",
    ],
    bestseller: true,
  },
  {
    id: "product-2",
    name: "Camiseta Imperius",
    category: "Ropa",
    price: 100000,
    image: "/black-athletic-t-shirt-with-gold-logo.jpg",
    description:
      "Camiseta deportiva de alto rendimiento con tecnología anti-sudor",
    type: "product" as const,
    features: [
      "Tela transpirable",
      "Secado rápido",
      "Logo bordado",
      "Ajuste atlético",
    ],
    bestseller: true,
  },
  {
    id: "product-3",
    name: "Pre-Workout Extreme",
    category: "Suplementos",
    price: 140000,
    image: "/pre-workout-supplement-container-gold-and-black.jpg",
    description: "Fórmula avanzada para energía y concentración máxima",
    type: "product" as const,
    features: ["Energía explosiva", "Mayor concentración", "Sin crash", "Sabor frutal"],
    bestseller: true,
  },
  {
    id: "product-5",
    name: "Creatina Monohidrato",
    category: "Suplementos",
    price: 112000,
    image: "/creatine-supplement-container-black-packaging.jpg",
    description: "Creatina pura para aumentar fuerza y masa muscular",
    type: "product" as const,
    features: ["100% pura", "Aumenta fuerza", "Mejora rendimiento", "Sin sabor"],
    bestseller: true,
  },
  {
    id: "product-6",
    name: "Guantes de Entrenamiento",
    category: "Accesorios",
    price: 80000,
    image: "/black-and-gold-gym-training-gloves.jpg",
    description: "Guantes profesionales con agarre superior y protección",
    type: "product" as const,
    features: [
      "Agarre antideslizante",
      "Acolchado premium",
      "Muñequera ajustable",
      "Durabilidad garantizada",
    ],
    bestseller: true,
  },
]

export function ShopSection() {
  const [selectedProduct, setSelectedProduct] =
    useState<(typeof featuredProducts)[0] | null>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [calificaciones, setCalificaciones] = useState<{
    [key: string]: { promedio: number; total: number }
  }>({})
  const [offersByProduct, setOffersByProduct] = useState<{
    [productId: string]: ProductOffer
  }>({})

  // Carrusel automático
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Cargar calificaciones
  useEffect(() => {
    const nuevasCalificaciones: {
      [key: string]: { promedio: number; total: number }
    } = {}
    featuredProducts.forEach((product) => {
      const { promedio, total } = calcularCalificacionPromedio(product.id)
      nuevasCalificaciones[product.id] = { promedio, total }
    })
    setCalificaciones(nuevasCalificaciones)
  }, [])

  // 🔥 Cargar y refrescar ofertas activas desde OfferSystem
  useEffect(() => {
    const loadOffers = () => {
      try {
        const activeOffers = OfferSystem.getAllActiveOffers()
        const map: { [productId: string]: ProductOffer } = {}
        activeOffers.forEach((offer) => {
          map[offer.productId] = offer
        })
        setOffersByProduct(map)
      } catch (error) {
        console.error("Error al cargar ofertas activas:", error)
      }
    }

    loadOffers()

    // refrescar cada 20 segundos para que se quiten/activen sin recargar
    const interval = setInterval(loadOffers, 1_000)
    return () => clearInterval(interval)
  }, [])

  // ⭐ Sincronizar el carrusel con las ofertas activas
  useEffect(() => {
    const productIdsWithOffer = Object.keys(offersByProduct)

    // Si no hay ofertas, no tocamos el carrusel (se sigue moviendo normal)
    if (productIdsWithOffer.length === 0) {
      return
    }

    // Producto actualmente centrado
    const currentProduct = featuredProducts[currentIndex]
    const currentHasOffer =
      currentProduct && offersByProduct[currentProduct.id]

    // Si el producto centrado ya tiene oferta, no hacemos nada
    if (currentHasOffer) {
      return
    }

    // Buscar el primer producto destacado que tenga oferta
    const firstOfferId = productIdsWithOffer[0]
    const newIndex = featuredProducts.findIndex(
      (p) => p.id === firstOfferId,
    )

    if (newIndex !== -1) {
      setCurrentIndex(newIndex)
      // Opcional: volvemos a activar el autoplay para que
      // siga rotando empezando desde el producto en oferta
      setIsAutoPlaying(true)
    }
  }, [offersByProduct, currentIndex])

  const handleProductClick = (product: (typeof featuredProducts)[0]) => {
    setSelectedProduct(product)
    setShowQuickView(true)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const getVisibleProducts = () => {
    const visible: { product: (typeof featuredProducts)[0]; offset: number }[] = []
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + featuredProducts.length) % featuredProducts.length
      visible.push({ product: featuredProducts[index], offset: i })
    }
    return visible
  }

  return (
    <>
      <section
        id="tienda"
        className="relative py-20 md:py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/fondos/fondo-tienda-ladrillo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Capa oscura para contraste */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Difuminado con sección anterior */}
        <div className="pointer-events-none absolute -top-40 left-0 right-0 h-40 section-fade-light-to-dark z-10" />

        <div className="container mx-auto px-4 relative z-20">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-1 w-10 bg-primary" />
              <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
                Más Vendidos
              </span>
              <div className="h-1 w-10 bg-primary" />
            </div>
            <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white mb-3 tracking-tight">
              PRODUCTOS <span className="text-primary">DESTACADOS</span>
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Los favoritos de nuestra comunidad. Calidad premium para resultados extraordinarios.
            </p>
          </div>

          {/* Carrusel 3D */}
          <div className="relative max-w-7xl mx-auto mb-12 md:mb-16">
            <div className="relative h-[450px] md:h-[600px] flex items-center justify-center perspective-1000">
              {getVisibleProducts().map(({ product, offset }) => {
                const calificacion =
                  calificaciones[product.id] || { promedio: 0, total: 0 }
                const rating = calificacion.promedio

                const activeOffer = offersByProduct[product.id]
                const displayPrice = activeOffer
                  ? activeOffer.currentPrice
                  : product.price
                const originalPrice = activeOffer
                  ? activeOffer.originalPrice
                  : null
                const discount = activeOffer
                  ? activeOffer.discountPercentage
                  : null

                return (
                  <div
                    key={product.id}
                    className="absolute transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      transform: `
                        translateX(${offset * 360}px)
                        translateZ(${offset === 0 ? 0 : -200}px)
                        scale(${offset === 0 ? 1 : 0.75})
                        rotateY(${offset * -15}deg)
                      `,
                      opacity: offset === 0 ? 1 : 0.4,
                      zIndex: offset === 0 ? 20 : 10 - Math.abs(offset),
                      pointerEvents: offset === 0 ? "auto" : "none",
                    }}
                    onClick={() => offset === 0 && handleProductClick(product)}
                  >
                    <Card className="w-[320px] md:w-[380px] overflow-hidden border-2 border-yellow-600/30 hover:border-primary transition-all duration-300 shadow-2xl bg-black/50 backdrop-blur-sm">
                      {product.bestseller && offset === 0 && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-primary text-black px-4 py-1.5 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            MÁS VENDIDO
                          </div>
                        </div>
                      )}

                      <div className="relative overflow-hidden bg-black/70 aspect-square">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 space-x-2">
                          <span className="bg-primary/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-bold">
                            {product.category}
                          </span>
                          {discount && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CalificacionEstrellas
                            calificacion={rating}
                            readonly
                            tamano="sm"
                            mostrarNumero
                          />
                          <span className="text-[11px] text-gray-400">
                            {calificacion.total > 0
                              ? `(${calificacion.total} reseñas)`
                              : "(0 reseñas)"}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg md:text-xl mb-1.5 text-white">
                          {product.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-300 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-gray-400 block">
                              Precio
                            </span>
                            <span className="font-bebas text-3xl md:text-4xl text-primary">
                              ${displayPrice.toLocaleString("es-CO")}
                            </span>
                            {originalPrice && originalPrice !== displayPrice && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 line-through">
                                  ${originalPrice.toLocaleString("es-CO")}
                                </span>
                                {typeof discount === "number" && discount > 0 && (
                                  <span className="text-[11px] font-semibold text-green-500">
                                    -{discount}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductClick(product)
                            }}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 px-4"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Comprar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            {/* Flechas */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-primary/90 hover:bg-primary text-black p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-primary/90 hover:bg-primary text-black p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Puntos del carrusel */}
          <div className="flex justify-center gap-3 mb-10 md:mb-12">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-10 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-yellow-600/30 hover:bg-yellow-600/50"
                }`}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>

          {/* Botón ver tienda completa */}
          <div className="text-center">
            <Link href="/tienda">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-bold text-base md:text-lg px-7 md:px-8 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Ver Toda la Tienda
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ProductQuickView
        product={selectedProduct}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  )
}
