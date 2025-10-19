"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/encabezado"
import { Footer } from "@/components/pie-pagina"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

// Categorías de la galería
const categories = [
  { id: "todas", name: "Todas" },
  { id: "pesas", name: "Zona de Pesas" },
  { id: "funcional", name: "Área Funcional" },
  { id: "clases", name: "Rumba Terapia" },
  { id: "cardio", name: "Zona Cardio" },
]

// Imágenes de la galería del gimnasio
const galleryImages = [
  {
    id: 1,
    category: "pesas",
    title: "Zona de Pesas - Vista General",
    image: "/modern-gym-weight-area-with-dumbbells-and-barbells.jpg",
  },
  {
    id: 2,
    category: "pesas",
    title: "Equipamiento de Pesas",
    image: "/gym-weight-equipment-professional-machines.jpg",
  },
  {
    id: 3,
    category: "funcional",
    title: "Área Funcional",
    image: "/gym-functional-training-area-with-equipment.jpg",
  },
  {
    id: 4,
    category: "funcional",
    title: "Zona CrossFit",
    image: "/crossfit-gym-area-with-ropes-and-boxes.jpg",
  },
  {
    id: 5,
    category: "clases",
    title: "Sala de Rumba Terapia",
    image: "/gym-group-class-room-with-mirrors.jpg",
  },
  {
    id: 6,
    category: "clases",
    title: "Clase de Spinning",
    image: "/gym-spinning-class-with-bikes.jpg",
  },
  {
    id: 7,
    category: "cardio",
    title: "Zona de Cardio",
    image: "/gym-cardio-area-with-treadmills.jpg",
  },
  {
    id: 8,
    category: "cardio",
    title: "Máquinas de Cardio",
    image: "/gym-cardio-machines-elliptical-and-bikes.jpg",
  },
  {
    id: 9,
    category: "pesas",
    title: "Rack de Mancuernas",
    image: "/gym-dumbbell-rack-organized-weights.jpg",
  },
  {
    id: 10,
    category: "funcional",
    title: "Entrenamiento Funcional",
    image: "/gym-functional-training-people-exercising.jpg",
  },
  {
    id: 11,
    category: "clases",
    title: "Clase de Yoga",
    image: "/gym-yoga-class-with-mats.jpg",
  },
  {
    id: 12,
    category: "cardio",
    title: "Caminadoras Modernas",
    image: "/modern-gym-treadmills-with-screens.jpg",
  },
]

/**
 * Página de galería de fotos del gimnasio
 * Muestra imágenes de las instalaciones organizadas por categorías
 *
 * Características:
 * - Filtrado por categorías (Pesas, Funcional, Clases, Cardio)
 * - Grid responsive de imágenes
 * - Efecto hover con título de la imagen
 * - Soporte para filtro desde URL (?filter=pesas)
 */
export default function GaleriaPage() {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get("filter")
  const [selectedCategory, setSelectedCategory] = useState(filterParam || "todas")

  // Actualizar categoría seleccionada cuando cambie el parámetro de URL
  useEffect(() => {
    if (filterParam) {
      setSelectedCategory(filterParam)
    }
  }, [filterParam])

  // Filtrar imágenes según la categoría seleccionada
  const filteredImages =
    selectedCategory === "todas" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* Encabezado de navegación */}
      <Header />

      {/* Espaciador para el header fijo */}
      <div className="h-20" />

      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Encabezado de la galería */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-primary" />
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">Galería de Fotos</span>
              <div className="h-1 w-12 bg-primary" />
            </div>
            <h1 className="font-bebas text-5xl md:text-7xl text-foreground mb-4 tracking-tight">
              NUESTRAS <span className="text-primary">INSTALACIONES</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conoce cada rincón de Imperius Fitness Gym. Instalaciones de primer nivel para tu entrenamiento.
            </p>
          </div>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`font-semibold ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Grid de imágenes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border border-border hover:border-primary transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.image || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-white font-bebas text-2xl">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay imágenes */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No hay imágenes en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pie de página */}
      <Footer />
    </main>
  )
}
