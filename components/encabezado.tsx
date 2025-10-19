"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import Image from "next/image"
import { CartDrawer } from "@/components/carrito-compras"
import { useAuth } from "@/contexts/contexto-autenticacion"
import { AuthDialog } from "@/components/dialogo-autenticacion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const handleUneteAhora = () => {
    setIsMenuOpen(false)
    if (pathname === "/") {
      document.getElementById("membresias")?.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = "/#membresias"
    }
  }

  // Función para confirmar el cierre de sesión
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  // Función para ejecutar el cierre de sesión
  const confirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo del gimnasio */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/imperius-logo.png"
                alt="Imperius Fitness Gym"
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="text-2xl font-bebas text-primary tracking-wider">IMPERIUS FITNESS GYM</div>
            </Link>

            {/* Navegación Desktop - Centrada */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="text-secondary-foreground hover:text-primary transition-colors font-medium">
                Inicio
              </Link>
              <Link
                href="/#membresias"
                className="text-secondary-foreground hover:text-primary transition-colors font-medium"
              >
                Membresías
              </Link>
              <Link
                href="/tienda"
                className="text-secondary-foreground hover:text-primary transition-colors font-medium"
              >
                Tienda
              </Link>
              <Link
                href="/galeria"
                className="text-secondary-foreground hover:text-primary transition-colors font-medium"
              >
                Galería
              </Link>
              <Link
                href="/#contacto"
                className="text-secondary-foreground hover:text-primary transition-colors font-medium"
              >
                Contacto
              </Link>
            </nav>

            {/* Botones de acción (Carrito, Login, Únete) */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <CartDrawer />
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-secondary-foreground font-medium text-sm">Hola, {user?.name}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogoutClick}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent h-8 w-8"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowAuthDialog(true)}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-8 px-3 text-sm"
                >
                  <User className="mr-1 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              )}
            </div>

            {/* Botón de menú móvil */}
            <button className="md:hidden text-secondary-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t border-primary/20">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/#membresias"
                  className="text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Membresías
                </Link>
                <Link
                  href="/tienda"
                  className="text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tienda
                </Link>
                <Link
                  href="/galeria"
                  className="text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galería
                </Link>
                <Link
                  href="/#contacto"
                  className="text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
                {isAuthenticated ? (
                  <>
                    <div className="text-secondary-foreground font-medium">Hola, {user?.name}</div>
                    <Button
                      variant="outline"
                      onClick={handleLogoutClick}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full bg-transparent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthDialog(true)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                )}
                
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Diálogo de autenticación (Login/Registro) */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      {/* Diálogo de confirmación para cerrar sesión */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cerrar sesión? Tu carrito se guardará para cuando vuelvas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-primary hover:bg-primary/90">
              Sí, cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
