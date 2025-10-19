"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"
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
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isApartadosDropdownOpen, setIsApartadosDropdownOpen] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsApartadosDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Confirmación de cierre de sesión
  const handleLogoutClick = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
  }

  // Navegación a secciones del home
  const navigateToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    setIsApartadosDropdownOpen(false)

    if (sectionId === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = `/#${sectionId}`
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {/* Menú desplegable Apartados */}
              <div ref={dropdownRef} className="relative">
                <button
                  className="flex items-center gap-1 text-secondary-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsApartadosDropdownOpen(!isApartadosDropdownOpen)}
                >
                  Apartados
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isApartadosDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isApartadosDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-secondary border border-primary/20 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => navigateToSection("inicio")}
                      className="block w-full text-left px-4 py-2 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Menú Principal
                    </button>
                    <button
                      onClick={() => navigateToSection("productos-destacados")}
                      className="block w-full text-left px-4 py-2 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Productos Destacados
                    </button>
                    <button
                      onClick={() => navigateToSection("instalaciones")}
                      className="block w-full text-left px-4 py-2 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Nuestras Instalaciones
                    </button>
                    <button
                      onClick={() => navigateToSection("quienes-somos")}
                      className="block w-full text-left px-4 py-2 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Quiénes Somos
                    </button>
                  </div>
                )}
              </div>

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

            {/* Botones de acción */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <CartDrawer />
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-secondary-foreground font-medium text-sm">
                    Hola, {user?.name}
                  </span>
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAuthMode("login")
                      setShowAuthDialog(true)
                    }}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-8 px-3 text-sm"
                  >
                    <User className="mr-1 h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("register")
                      setShowAuthDialog(true)
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-8 px-3 text-sm"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>

            {/* Botón menú móvil */}
            <button
              className="md:hidden text-secondary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t border-primary/20">
              <nav className="flex flex-col gap-4">
                <div className="border-b border-primary/20 pb-2">
                  <div className="text-secondary-foreground font-medium mb-2">Apartados</div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigateToSection("inicio")}
                      className="text-secondary-foreground hover:text-primary transition-colors text-left"
                    >
                      Menú Principal
                    </button>
                    <button
                      onClick={() => navigateToSection("productos-destacados")}
                      className="text-secondary-foreground hover:text-primary transition-colors text-left"
                    >
                      Productos Destacados
                    </button>
                    <button
                      onClick={() => navigateToSection("instalaciones")}
                      className="text-secondary-foreground hover:text-primary transition-colors text-left"
                    >
                      Nuestras Instalaciones
                    </button>
                    <button
                      onClick={() => navigateToSection("quienes-somos")}
                      className="text-secondary-foreground hover:text-primary transition-colors text-left"
                    >
                      Quiénes Somos
                    </button>
                  </div>
                </div>

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
                    <div className="text-secondary-foreground font-medium">
                      Hola, {user?.name}
                    </div>
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
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAuthMode("login")
                        setShowAuthDialog(true)
                        setIsMenuOpen(false)
                      }}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                    >
                      Iniciar Sesión
                    </Button>

                    <Button
                      onClick={() => {
                        setAuthMode("register")
                        setShowAuthDialog(true)
                        setIsMenuOpen(false)
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    >
                      Registrarse
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Diálogo de autenticación */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab={authMode} />

      {/* Confirmación de cierre de sesión */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar sesión? Tu carrito se guardará para cuando vuelvas.
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
