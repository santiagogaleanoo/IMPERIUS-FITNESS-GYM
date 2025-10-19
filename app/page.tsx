import { Header } from "@/components/encabezado"
import { HeroSection } from "@/components/seccion-hero"
import { MembershipsSection } from "@/components/seccion-membresias"
import { ShopSection } from "@/components/seccion-tienda"
import { FacilitiesSection } from "@/components/seccion-instalaciones"
import { CTASection } from "@/components/seccion-llamado-accion"
import { Footer } from "@/components/pie-pagina"

/**
 * Página principal del sitio web de Imperius Fitness Gym
 *
 * Estructura de la página:
 * 1. Header: Navegación principal con logo, menú y carrito
 * 2. HeroSection: Sección principal con imagen de fondo y llamado a la acción
 * 3. MembershipsSection: Planes de membresía disponibles (Día, Quincenal, Mensual, etc.)
 * 4. ShopSection: Carrusel de productos más vendidos
 * 5. FacilitiesSection: Servicios e instalaciones del gimnasio
 * 6. CTASection: Llamado a la acción para contactar por WhatsApp
 * 7. Footer: Información de contacto, horarios y redes sociales
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Encabezado con navegación, logo y carrito de compras */}
      <Header />

      {/* Sección hero con imagen principal y estadísticas del gym */}
      <HeroSection />

      {/* Sección de planes de membresía con precios y características */}
      <MembershipsSection />

      {/* Carrusel 3D de productos destacados de la tienda */}
      <ShopSection />

      {/* Tarjetas de instalaciones y servicios del gimnasio */}
      <FacilitiesSection />

      {/* Sección de contacto con botón de WhatsApp */}
      <CTASection />

      {/* Pie de página con información de contacto y enlaces */}
      <Footer />
    </main>
  )
}
