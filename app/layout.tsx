import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/contexto-carrito"
import { AuthProvider } from "@/contexts/contexto-autenticacion"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Configuración de fuentes de Google Fonts
// Inter: Fuente principal para texto del cuerpo
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

// Bebas Neue: Fuente para títulos y encabezados (estilo deportivo)
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

// Metadatos de la página para SEO
export const metadata: Metadata = {
  title: "Imperius Fitness Gym - Transforma Tu Cuerpo",
  description:
    "Imperius Fitness Gym: El mejor gimnasio con equipamiento de última generación, entrenadores profesionales y tienda de suplementos y ropa deportiva.",
  generator: "v0.app",
}

/**
 * Layout principal de la aplicación
 * Envuelve toda la aplicación con los providers necesarios:
 * - AuthProvider: Maneja la autenticación de usuarios
 * - CartProvider: Maneja el carrito de compras
 * - Toaster: Muestra notificaciones toast
 * - Analytics: Seguimiento de Vercel Analytics
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        {/* Provider de autenticación - Maneja login, registro y sesión de usuario */}
        <AuthProvider>
          {/* Provider del carrito - Maneja productos agregados al carrito */}
          <CartProvider>
            {/* Contenido de la página */}
            {children}

            {/* Analytics de Vercel para seguimiento de visitas */}
            <Analytics />

            {/* Sistema de notificaciones toast */}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
