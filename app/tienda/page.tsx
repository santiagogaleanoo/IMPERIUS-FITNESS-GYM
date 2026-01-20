"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Filter, ChevronDown } from "lucide-react"
import { Header } from "@/components/encabezado"
import { Footer } from "@/components/pie-pagina"
import { ProductQuickView } from "@/components/vista-rapida-producto"
import { CalificacionEstrellas } from "@/components/calificacion-estrellas"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"
import { OfferSystem, type ProductOffer } from "@/lib/sistema-ofertas"

// 🔥 LISTA ORIGINAL DE PRODUCTOS
const allProducts = [
  {
    id: "product-1",
    name: "Proteína Whey",
    category: "Suplementos",
    subcategory: "proteina-limpia",
    price: 180000,
    image: "/whey-protein-container-black-and-gold.jpg",
    description: "Proteína de suero de alta calidad con 25g de proteína por porción",
    type: "product" as const,
    features: ["25g de proteína por porción", "Bajo en azúcar y grasa", "Fácil digestión", "Sabor chocolate premium"],
  },
  {
    id: "product-2",
    name: "Camiseta Imperius Hombre",
    category: "Ropa",
    subcategory: "ropa-hombre",
    price: 100000,
    image: "/black-athletic-t-shirt-with-gold-logo.jpg",
    description: "Camiseta deportiva de alto rendimiento con tecnología anti-sudor",
    type: "product" as const,
    features: ["Tela transpirable", "Secado rápido", "Logo bordado", "Ajuste atlético"],
  },
  {
    id: "product-3",
    name: "Pre-Entreno Hyde Xtreme",
    category: "Suplementos",
    subcategory: "pre-entreno",
    price: 140000,
    image: "/pre-workout-supplement-container-gold-and-black.jpg",
    description: "Fórmula avanzada para energía y concentración máxima",
    type: "product" as const,
    features: ["Energía explosiva", "Mayor concentración", "Sin crash", "Sabor frutal"],
  },
  {
    id: "product-4",
    name: "Shorts Deportivos Hombre",
    category: "Ropa",
    subcategory: "ropa-hombre",
    price: 120000,
    image: "/black-athletic-shorts-with-gold-details.jpg",
    description: "Shorts de entrenamiento con máxima movilidad y comodidad",
    type: "product" as const,
    features: ["Tela elástica", "Bolsillos con cierre", "Cintura ajustable", "Diseño ergonómico"],
  },
  {
    id: "product-5",
    name: "Creatina Monohidrato",
    category: "Suplementos",
    subcategory: "creatina-monohidratada",
    price: 112000,
    image: "/creatine-supplement-container-black-packaging.jpg",
    description: "Creatina pura para aumentar fuerza y masa muscular",
    type: "product" as const,
    features: ["100% pura", "Aumenta fuerza", "Mejora rendimiento", "Sin sabor"],
  },
  {
    id: "product-6",
    name: "Guantes de Entrenamiento",
    category: "Accesorios",
    subcategory: "guantes-proteccion",
    price: 80000,
    image: "/black-and-gold-gym-training-gloves.jpg",
    description: "Guantes profesionales con agarre superior y protección",
    type: "product" as const,
    features: ["Agarre antideslizante", "Acolchado premium", "Muñequera ajustable", "Durabilidad garantizada"],
  },
  {
    id: "product-7",
    name: "BCAA Energy",
    category: "Suplementos",
    subcategory: "aminoacidos",
    price: 128000,
    image: "/bcaa-supplement-powder-gold-container.jpg",
    description: "Aminoácidos esenciales para recuperación y energía",
    type: "product" as const,
    features: ["Recuperación rápida", "Reduce fatiga", "Sabor refrescante", "Sin azúcar"],
  },
  {
    id: "product-8",
    name: "Sudadera Imperius Hombre",
    category: "Ropa",
    subcategory: "ropa-hombre",
    price: 180000,
    image: "/black-athletic-hoodie-gold-logo.jpg",
    description: "Sudadera premium con capucha y logo bordado",
    type: "product" as const,
    features: ["Algodón premium", "Capucha ajustable", "Bolsillos canguro", "Logo bordado"],
  },
  {
    id: "product-9",
    name: "Shaker Premium",
    category: "Accesorios",
    subcategory: "suplementacion",
    price: 60000,
    image: "/black-gold-protein-shaker-bottle.jpg",
    description: "Shaker de alta calidad con compartimentos",
    type: "product" as const,
    features: ["700ml capacidad", "Compartimento para polvo", "A prueba de fugas", "Fácil limpieza"],
  },
  {
    id: "product-10",
    name: "Cinturón de Levantamiento",
    category: "Accesorios",
    subcategory: "levantamiento-pesas",
    price: 220000,
    image: "/black-leather-weightlifting-belt-gold-buckle.jpg",
    description: "Cinturón profesional de cuero para levantamiento",
    type: "product" as const,
    features: ["Cuero genuino", "Soporte lumbar", "Hebilla dorada", "Ajuste perfecto"],
  },
  {
    id: "product-11",
    name: "Glutamina Recovery",
    category: "Suplementos",
    subcategory: "aminoacidos",
    price: 120000,
    image: "/glutamine-supplement-black-gold-container.jpg",
    description: "Glutamina pura para recuperación muscular",
    type: "product" as const,
    features: ["Recuperación óptima", "Fortalece sistema inmune", "Sin sabor", "Fácil mezcla"],
  },
  {
    id: "product-12",
    name: "Pantalones Jogger Hombre",
    category: "Ropa",
    subcategory: "ropa-hombre",
    price: 152000,
    image: "/black-athletic-jogger-pants-gold-stripes.jpg",
    description: "Pantalones deportivos con franjas doradas",
    type: "product" as const,
    features: ["Tela elástica", "Cintura ajustable", "Bolsillos con cierre", "Diseño moderno"],
  },
  {
    id: "product-13",
    name: "Proteína Mass Gainer",
    category: "Suplementos",
    subcategory: "proteina-volumen",
    price: 210000,
    image: "/placeholder-mass-gainer.jpg",
    description: "Ganador de masa con alta concentración calórica",
    type: "product" as const,
    features: ["1200 calorías por porción", "50g de proteína", "Carbohidratos complejos", "Sabor chocolate"],
  },
  {
    id: "product-14",
    name: "Top Deportivo Mujer",
    category: "Ropa",
    subcategory: "ropa-mujer",
    price: 112000,
    image: "/black-gold-womens-sports-bra.jpg",
    description: "Top deportivo de alto soporte para mujer",
    type: "product" as const,
    features: ["Soporte alto", "Tela transpirable", "Secado rápido", "Diseño elegante"],
  },
  {
    id: "product-15",
    name: "Straps de Levantamiento",
    category: "Accesorios",
    subcategory: "levantamiento-pesas",
    price: 72000,
    image: "/black-gold-lifting-straps.jpg",
    description: "Straps profesionales para levantamiento pesado",
    type: "product" as const,
    features: ["Material resistente", "Agarre superior", "Acolchado", "Ajuste fácil"],
  },
  {
    id: "product-16",
    name: "Proteína Caseína",
    category: "Suplementos",
    subcategory: "proteina-limpia",
    price: 165000,
    image: "/placeholder-protein-casein.jpg",
    description: "Proteína de liberación prolongada para la noche",
    type: "product" as const,
    features: ["Liberación lenta", "Anticatabólico", "Sabor vainilla", "Mejora recuperación"],
  },
  {
    id: "product-17",
    name: "Creatina HCL",
    category: "Suplementos",
    subcategory: "creatina-hcl",
    price: 145000,
    image: "/placeholder-creatine-hcl.jpg",
    description: "Creatina HCl de alta absorción y sin retención de líquidos",
    type: "product" as const,
    features: ["Alta absorción", "Sin retención", "Menor dosis necesaria", "Sin sabor"],
  },
  {
    id: "product-18",
    name: "Leggings Deportivos Mujer",
    category: "Ropa",
    subcategory: "ropa-mujer",
    price: 135000,
    image: "/placeholder-womens-leggings.jpg",
    description: "Leggings de alta compresión para entrenamiento",
    type: "product" as const,
    features: ["Compresión media", "Tela transpirable", "Cintura alta", "Diseño sculpting"],
  },
  {
    id: "product-19",
    name: "Proteína Isolate",
    category: "Suplementos",
    subcategory: "proteina-limpia",
    price: 195000,
    image: "/placeholder-protein-isolate.jpg",
    description: "Proteína aislada ultra pura con 90% de proteína",
    type: "product" as const,
    features: ["90% de proteína", "Bajo en carbohidratos", "Sin lactosa", "Sabor fresa"],
  },
  {
    id: "product-20",
    name: "Banda de Resistencia",
    category: "Accesorios",
    subcategory: "accesorios-entrenamiento",
    price: 45000,
    image: "/placeholder-resistance-band.jpg",
    description: "Banda de resistencia para ejercicios funcionales",
    type: "product" as const,
    features: ["Múltiples niveles", "Material duradero", "Portátil", "Para todo el cuerpo"],
  },
]

// Categorías principales
const mainCategories = [
  { value: "todos", label: "Todos los Productos" },
  { value: "Suplementos", label: "Suplementos" },
  { value: "Ropa", label: "Ropa Deportiva" },
  { value: "Accesorios", label: "Accesorios" },
]

// Subcategorías de Suplementos
const supplementSubcategories = [
  { value: "todos", label: "Todos los Suplementos" },
  { value: "proteina-limpia", label: "Proteína Limpia" },
  { value: "proteina-volumen", label: "Proteína de Volumen" },
  { value: "creatina-monohidratada", label: "Creatina Monohidratada" },
  { value: "creatina-hcl", label: "Creatina HCL" },
  { value: "pre-entreno", label: "Pre Entreno" },
  { value: "aminoacidos", label: "Aminoácidos" },
]

// Subcategorías de Ropa
const clothingSubcategories = [
  { value: "todos", label: "Toda la Ropa" },
  { value: "ropa-hombre", label: "Ropa de Hombre" },
  { value: "ropa-mujer", label: "Ropa de Mujer" },
]

// Nuevo: Subcategorías de Accesorios
const accessorySubcategories = [
  { value: "todos", label: "Todos los Accesorios" },
  { value: "guantes-proteccion", label: "Guantes y Protección" },
  { value: "suplementacion", label: "Suplementación" },
  { value: "levantamiento-pesas", label: "Levantamiento de Pesas" },
  { value: "accesorios-entrenamiento", label: "Accesorios de Entrenamiento" },
]

export default function TiendaPage() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedSubcategory, setSelectedSubcategory] = useState("todos")
  const [showSubcategoryFilter, setShowSubcategoryFilter] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<(typeof allProducts)[0] | null>(null)
  const [calificaciones, setCalificaciones] = useState<{
    [key: string]: { promedio: number; total: number }
  }>({})
  const [showQuickView, setShowQuickView] = useState(false)
  const [offersByProduct, setOffersByProduct] = useState<{
    [productId: string]: ProductOffer
  }>({})

  // ⭐ Calificaciones solo se calculan una vez
  useEffect(() => {
    const nuevas: any = {}
    allProducts.forEach((p) => {
      const { promedio, total } = calcularCalificacionPromedio(p.id)
      nuevas[p.id] = { promedio, total }
    })
    setCalificaciones(nuevas)
  }, [])

  // 🔥 Ofertas: sincronizar automáticamente con localStorage y fechas
  useEffect(() => {
    const updateOffers = () => {
      // Actualiza estados de isActive según fechas
      OfferSystem.updateOffersStatus()
      const activeOffers = OfferSystem.getAllActiveOffers()
      const map: Record<string, ProductOffer> = {}
      activeOffers.forEach((offer) => {
        map[offer.productId] = offer
      })
      setOffersByProduct(map)
    }

    updateOffers()

    // Polling cada 20s por si cambian fechas / admin
    const interval = setInterval(updateOffers, 20_000)

    // Escuchar cambios en localStorage (cuando admin crea/borra oferta en otra pestaña)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "imperius_product_offers") {
        updateOffers()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage)
    }

    return () => {
      clearInterval(interval)
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage)
      }
    }
  }, [])

  // Filtrado de productos
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "todos") return true
    
    if (selectedCategory === "Accesorios") {
      if (selectedSubcategory === "todos") return product.category === "Accesorios"
      return (
        product.category === "Accesorios" &&
        product.subcategory === selectedSubcategory
      )
    }

    if (selectedCategory === "Suplementos") {
      if (selectedSubcategory === "todos") return product.category === "Suplementos"
      return (
        product.category === "Suplementos" &&
        product.subcategory === selectedSubcategory
      )
    }

    if (selectedCategory === "Ropa") {
      if (selectedSubcategory === "todos") return product.category === "Ropa"
      return (
        product.category === "Ropa" &&
        product.subcategory === selectedSubcategory
      )
    }

    return product.category === selectedCategory
  })

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setShowQuickView(true)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory("todos")
    setShowSubcategoryFilter(false)
  }

  const getCategoryLabel = () => {
    if (selectedCategory === "todos") return "Todos los Productos"
    
    if (selectedCategory === "Accesorios") {
      if (selectedSubcategory === "todos") return "Todos los Accesorios"
      return accessorySubcategories.find((s) => s.value === selectedSubcategory)
        ?.label
    }

    if (selectedCategory === "Suplementos") {
      if (selectedSubcategory === "todos") return "Todos los Suplementos"
      return supplementSubcategories.find((s) => s.value === selectedSubcategory)
        ?.label
    }

    if (selectedCategory === "Ropa") {
      if (selectedSubcategory === "todos") return "Toda la Ropa"
      return clothingSubcategories.find((s) => s.value === selectedSubcategory)
        ?.label
    }

    return mainCategories.find((c) => c.value === selectedCategory)?.label
  }

  const getSubcategories = () => {
    if (selectedCategory === "Suplementos") return supplementSubcategories
    if (selectedCategory === "Ropa") return clothingSubcategories
    if (selectedCategory === "Accesorios") return accessorySubcategories
    return []
  }

  const showSubcategories =
    selectedCategory === "Suplementos" || selectedCategory === "Ropa" || selectedCategory === "Accesorios"

  return (
    <>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: "url('/fondos/textura-grunge-oscuro.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.09] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 7px)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.85)" }}
        />

        <div className="relative z-10">
          <Header />

          <main className="pt-32 pb-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="font-bebas text-6xl md:text-8xl text-white mb-4 tracking-tight">
                  TIENDA <span className="text-primary">IMPERIUS</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Todo lo que necesitas para alcanzar tus objetivos
                </p>
              </div>

              {/* FILTROS */}
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Filter className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Filtrar por:</span>
                  </div>
                  {mainCategories.map((category) => (
                    <Button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      variant={
                        selectedCategory === category.value ? "default" : "outline"
                      }
                      className={
                        selectedCategory === category.value
                          ? "bg-primary text-black hover:bg-primary/90"
                          : "border-yellow-600/30 text-white hover:bg-primary hover:text-black"
                      }
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>

                {showSubcategories && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowSubcategoryFilter(!showSubcategoryFilter)
                      }
                      className="flex items-center gap-3 bg-black/50 backdrop-blur-sm border border-yellow-600/30 text-white px-6 py-3 rounded-lg hover:border-primary transition-all duration-300"
                    >
                      <span>{getCategoryLabel()}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showSubcategoryFilter ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showSubcategoryFilter && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-sm border border-yellow-600/30 rounded-lg shadow-2xl py-2 z-50">
                        {getSubcategories().map((subcategory) => (
                          <button
                            key={subcategory.value}
                            onClick={() => {
                              setSelectedSubcategory(subcategory.value)
                              setShowSubcategoryFilter(false)
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors ${
                              selectedSubcategory === subcategory.value
                                ? "bg-primary/20 text-primary"
                                : "text-white hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {subcategory.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(selectedCategory !== "todos" ||
                  selectedSubcategory !== "todos") && (
                  <div className="text-center">
                    <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                      Mostrando: {getCategoryLabel()}
                    </span>
                  </div>
                )}
              </div>

              {/* GRID DE PRODUCTOS */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => {
                  const offer = offersByProduct[product.id]
                  const displayPrice = offer ? offer.currentPrice : product.price
                  const originalPrice = offer ? offer.originalPrice : null
                  const discount = offer ? offer.discountPercentage : null

                  const c = calificaciones[product.id]
                  const rating = c?.promedio || 0
                  const total = c?.total || 0

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-yellow-600/30 hover:border-primary transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="relative overflow-hidden bg-black/70 aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-black px-3 py-1 rounded-full text-xs font-bold">
                            {product.category}
                          </span>
                        </div>

                        {product.category === "Suplementos" && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-600/80 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {product.subcategory === "proteina-limpia" &&
                                "Proteína Limpia"}
                              {product.subcategory === "proteina-volumen" &&
                                "Proteína Volumen"}
                              {product.subcategory === "creatina-monohidratada" &&
                                "Creatina Mono"}
                              {product.subcategory === "creatina-hcl" &&
                                "Creatina HCL"}
                              {product.subcategory === "pre-entreno" &&
                                "Pre Entreno"}
                              {product.subcategory === "aminoacidos" &&
                                "Aminoácidos"}
                            </span>
                          </div>
                        )}

                        {product.category === "Ropa" && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-600/80 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {product.subcategory === "ropa-hombre" && "Hombre"}
                              {product.subcategory === "ropa-mujer" && "Mujer"}
                            </span>
                          </div>
                        )}

                        {product.category === "Accesorios" && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-600/80 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {product.subcategory === "guantes-proteccion" && "Guantes"}
                              {product.subcategory === "suplementacion" && "Suplementación"}
                              {product.subcategory === "levantamiento-pesas" && "Pesas"}
                              {product.subcategory === "accesorios-entrenamiento" && "Entrenamiento"}
                            </span>
                          </div>
                        )}

                        {offer && (
                          <div className="absolute top-12 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            -{discount}%
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-white">
                          {product.name}
                        </h3>

                        <div className="flex flex-col mb-2">
                          {originalPrice && (
                            <span className="text-sm line-through text-gray-400">
                              ${originalPrice.toLocaleString("es-CO")}
                            </span>
                          )}

                          <span className="font-bebas text-3xl text-primary">
                            ${displayPrice.toLocaleString("es-CO")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalificacionEstrellas
                            calificacion={rating}
                            readonly
                            tamano="sm"
                            mostrarNumero
                          />
                          <span className="text-xs text-gray-400">
                            ({total} reseñas)
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProductClick(product)
                          }}
                          className="w-full bg-primary text-black hover:bg-primary/90 border-none"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">
                    No hay productos en esta categoría.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("todos")
                      setSelectedSubcategory("todos")
                    }}
                    className="bg-primary text-black hover:bg-primary/90"
                  >
                    Ver Todos los Productos
                  </Button>
                </div>
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <ProductQuickView
        product={selectedProduct}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  )
}
