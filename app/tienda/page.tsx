"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Filter } from "lucide-react"
import { Header } from "@/components/encabezado"
import { Footer } from "@/components/pie-pagina"
import { ProductQuickView } from "@/components/vista-rapida-producto"
import { CalificacionEstrellas } from "@/components/calificacion-estrellas"
import { calcularCalificacionPromedio } from "@/lib/almacenamiento-resenas"

const allProducts = [
  {
    id: "product-1",
    name: "Proteína Whey Pro",
    category: "Suplementos",
    price: 180000,
    image: "/whey-protein-container-black-and-gold.jpg",
    description: "Proteína de suero de alta calidad con 25g de proteína por porción",
    type: "product" as const,
    features: ["25g de proteína por porción", "Bajo en azúcar y grasa", "Fácil digestión", "Sabor chocolate premium"],
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
  },
  {
    id: "product-7",
    name: "BCAA Energy",
    category: "Suplementos",
    price: 128000,
    image: "/bcaa-supplement-powder-gold-container.jpg",
    description: "Aminoácidos esenciales para recuperación y energía",
    type: "product" as const,
    features: ["Recuperación rápida", "Reduce fatiga", "Sabor refrescante", "Sin azúcar"],
  },
  {
    id: "product-8",
    name: "Sudadera Imperius",
    category: "Ropa",
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
    price: 120000,
    image: "/glutamine-supplement-black-gold-container.jpg",
    description: "Glutamina pura para recuperación muscular",
    type: "product" as const,
    features: ["Recuperación óptima", "Fortalece sistema inmune", "Sin sabor", "Fácil mezcla"],
  },
  {
    id: "product-12",
    name: "Pantalones Jogger",
    category: "Ropa",
    price: 152000,
    image: "/black-athletic-jogger-pants-gold-stripes.jpg",
    description: "Pantalones deportivos con franjas doradas",
    type: "product" as const,
    features: ["Tela elástica", "Cintura ajustable", "Bolsillos con cierre", "Diseño moderno"],
  },
  {
    id: "product-13",
    name: "Multivitamínico Elite",
    category: "Suplementos",
    price: 100000,
    image: "/multivitamin-supplement-bottle-black-gold.jpg",
    description: "Complejo vitamínico completo para deportistas",
    type: "product" as const,
    features: ["Vitaminas esenciales", "Minerales completos", "Energía diaria", "60 cápsulas"],
  },
  {
    id: "product-14",
    name: "Top Deportivo Mujer",
    category: "Ropa",
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
    price: 72000,
    image: "/black-gold-lifting-straps.jpg",
    description: "Straps profesionales para levantamiento pesado",
    type: "product" as const,
    features: ["Material resistente", "Agarre superior", "Acolchado", "Ajuste fácil"],
  },
]

/**
 * Página de la tienda completa
 * Muestra todos los productos disponibles con filtros por categoría
 *
 * Características:
 * - Filtrado por categorías (Todos, Suplementos, Ropa, Accesorios)
 * - Grid responsive de productos
 * - Vista rápida del producto al hacer clic
 * - Precios en pesos colombianos (COP)
 */
export default function TiendaPage() {
  // Estado para la categoría seleccionada en el filtro
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  // Estado para el producto seleccionado en la vista rápida
  const [selectedProduct, setSelectedProduct] = useState<(typeof allProducts)[0] | null>(null)

  // Calificaciones calculadas por producto
  const [calificaciones, setCalificaciones] = useState<{ [key: string]: { promedio: number; total: number } }>({})

  useEffect(() => {
    const nuevas: { [key: string]: { promedio: number; total: number } } = {}
    allProducts.forEach((p) => {
      const { promedio, total } = calcularCalificacionPromedio(p.id)
      nuevas[p.id] = { promedio, total }
    })
    setCalificaciones(nuevas)
  }, [])

  // Estado para mostrar/ocultar el modal de vista rápida
  const [showQuickView, setShowQuickView] = useState(false)

  // Categorías disponibles para filtrar
  const categories = ["Todos", "Suplementos", "Ropa", "Accesorios"]

  // Filtrar productos según la categoría seleccionada
  const filteredProducts =
    selectedCategory === "Todos" ? allProducts : allProducts.filter((p) => p.category === selectedCategory)

  // Función para abrir la vista rápida de un producto
  const handleProductClick = (product: (typeof allProducts)[0]) => {
    setSelectedProduct(product)
    setShowQuickView(true)
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Encabezado de navegación */}
        <Header />

        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            {/* Título de la página */}
            <div className="text-center mb-12">
              <h1 className="font-bebas text-6xl md:text-8xl text-foreground mb-4 tracking-tight">
                TIENDA <span className="text-primary">IMPERIUS</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Todo lo que necesitas para alcanzar tus objetivos
              </p>
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-semibold">Filtrar por:</span>
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Grid de productos */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border hover:border-primary transition-all duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Imagen del producto */}
                  <div className="relative overflow-hidden bg-muted aspect-square">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge de categoría */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Información del producto */}
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-card-foreground">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bebas text-3xl text-primary">${product.price.toLocaleString("es-CO")}</span>
                    </div>
                    {/* Calificación - siempre mostrar estrellas */}
                    {(() => {
                      const c = calificaciones[product.id]
                      const rating = c?.promedio || 0
                      const total = c?.total || 0
                      
                      return (
                        <div className="flex items-center gap-2">
                          <CalificacionEstrellas calificacion={rating} readonly tamano="sm" mostrarNumero />
                          <span className="text-xs text-muted-foreground">
                            ({total > 0 ? `${total} reseñas` : '0 reseñas'})
                          </span>
                        </div>
                      )
                    })()}
                  </CardContent>

                  {/* Botón de acción */}
                  <CardFooter className="p-6 pt-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-semibold"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Pie de página */}
        <Footer />
      </div>

      {/* Modal de vista rápida del producto */}
      <ProductQuickView product={selectedProduct} open={showQuickView} onOpenChange={setShowQuickView} />
    </>
  )
}
