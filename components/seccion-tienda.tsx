"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ProductQuickView } from "./vista-rapida-producto"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"
import { CalificacionEstrellas } from "./calificacion-estrellas"

const products = [
  {
    id: "product-1",
    name: "Proteína Whey Pro",
    category: "Suplementos",
    price: 180000,
    image: "/whey-protein-container-black-and-gold.jpg",
    description: "Proteína de suero de alta calidad con 25g de proteína por porción",
    type: "product" as const,
    features: ["25g de proteína por porción", "Bajo en azúcar y grasa", "Fácil digestión", "Sabor chocolate premium"],
    bestseller: true,
  },
  {
    id: "product-2",
    name: "Camiseta Imperius",
    category: "Ropa",
    price: 100000,
    image: "/black-athletic-t-shirt-with-gold-logo.jpg",
    description: "Camiseta deportiva de alto rendimiento con tecnología anti-sudor",
    type: "product" as const,
    features: ["Tela transpirable", "Secado rápido", "Logo bordado", "Ajuste atlético"],
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
    id: "product-4",
    name: "Shorts Deportivos",
    category: "Ropa",
    price: 120000,
    image: "/black-athletic-shorts-with-gold-details.jpg",
    description: "Shorts de entrenamiento con máxima movilidad y comodidad",
    type: "product" as const,
    features: ["Tela elástica", "Bolsillos con cierre", "Cintura ajustable", "Diseño ergonómico"],
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
    features: ["Agarre antideslizante", "Acolchado premium", "Muñequera ajustable", "Durabilidad garantizada"],
    bestseller: true,
  },
]

export function ShopSection() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [calificaciones, setCalificaciones] = useState<{ [key: string]: { promedio: number; total: number } }>({})

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    const nuevasCalificaciones: { [key: string]: { promedio: number; total: number } } = {}
    products.forEach((product) => {
      const { promedio, total } = calcularCalificacionPromedio(product.id)
      nuevasCalificaciones[product.id] = { promedio, total }
    })
    setCalificaciones(nuevasCalificaciones)
  }, [])

  const handleProductClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
    setShowQuickView(true)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const getVisibleProducts = () => {
    const visible = []
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + products.length) % products.length
      visible.push({ product: products[index], offset: i })
    }
    return visible
  }

  return (
    <>
      <section id="tienda" className="py-24 bg-gradient-to-b from-background to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-primary" />
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">Más Vendidos</span>
              <div className="h-1 w-12 bg-primary" />
            </div>
            <h2 className="font-bebas text-5xl md:text-7xl text-foreground mb-4 tracking-tight">
              PRODUCTOS <span className="text-primary">DESTACADOS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Los favoritos de nuestra comunidad. Calidad premium para resultados extraordinarios.
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto mb-16">
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
              {getVisibleProducts().map(({ product, offset }) => {
                const calificacion = calificaciones[product.id] || { promedio: 0, total: 0 }
                const rating = calificacion.promedio

                return (
                  <div
                    key={product.id}
                    className="absolute transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      transform: `
                        translateX(${offset * 380}px) 
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
                    <Card className="w-[340px] md:w-[400px] overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 shadow-2xl bg-card">
                      {product.bestseller && offset === 0 && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                            <Star className="w-3 h-3 fill-current" />
                            MÁS VENDIDO
                          </div>
                        </div>
                      )}

                      <div className="relative overflow-hidden bg-muted aspect-square">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Calificación - siempre mostrar estrellas */}
                        <div className="flex items-center gap-2 mb-2">
                          <CalificacionEstrellas calificacion={rating} readonly tamano="sm" mostrarNumero />
                          <span className="text-xs text-muted-foreground">
                            ({calificacion.total > 0 ? `${calificacion.total} reseñas` : '0 reseñas'})
                          </span>
                        </div>
                        <h3 className="font-bold text-2xl mb-2 text-card-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-muted-foreground block">Precio</span>
                            <span className="font-bebas text-4xl text-primary">
                              ${product.price.toLocaleString("es-CO")}
                            </span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductClick(product)
                            }}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Comprar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-primary/90 hover:bg-primary text-primary-foreground p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-primary/90 hover:bg-primary text-primary-foreground p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-3 mb-12">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-12 h-3 bg-primary"
                    : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/tienda">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Ver Toda la Tienda
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ProductQuickView product={selectedProduct} open={showQuickView} onOpenChange={setShowQuickView} />
    </>
  )
}
