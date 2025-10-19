import { Header } from "@/components/encabezado"
import { HeroSection } from "@/components/seccion-hero"
import { MembershipsSection } from "@/components/seccion-membresias"
import { ShopSection } from "@/components/seccion-tienda"
import { FacilitiesSection } from "@/components/seccion-instalaciones"
import { CTASection } from "@/components/seccion-llamado-accion"
import { Footer } from "@/components/pie-pagina"
import { QuienesSomosSection } from "@/components/seccion-quienes-somos"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero (se deja el componente tal cual) */}
      <section id="inicio">
        <HeroSection />
      </section>

      {/* Memberships */}
      <section id="membresias">
        <MembershipsSection />
      </section>

      {/* ShopSection -> envuelto con el id "productos-destacados" */}
      <section id="productos-destacados">
        <ShopSection />
      </section>

      {/* Facilities */}
      <section id="instalaciones">
        <FacilitiesSection />
      </section>

      {/* Quienes Somos */}
      <section id="quienes-somos">
        <QuienesSomosSection />
      </section>

      {/* Contact / CTA */}
      <section id="contacto">
        <CTASection />
      </section>

      <Footer />
    </main>
  )
}
