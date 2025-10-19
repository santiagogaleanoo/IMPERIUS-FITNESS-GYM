"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { UserStorage } from "@/lib/almacenamiento-usuarios"

// Interfaz que define la estructura de un usuario en la aplicación
interface User {
  id: string
  name: string
  lastName: string
  email: string
  esEstudiante: boolean
  verificacionEstudiantePendiente: boolean
}

// Interfaz que define los métodos y propiedades del contexto de autenticación
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    lastName: string,
    documentType: string,
    documentNumber: string,
    email: string,
    password: string,
    preguntaSeguridad?: string,
    respuestaSeguridad?: string,
  ) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  pendingAction: (() => void) | null
  setPendingAction: (action: (() => void) | null) => void
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // Cargar usuario guardado al iniciar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem("imperius_current_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validar credenciales contra la base de datos local
    const validUser = UserStorage.validateLogin(email, password)

    if (!validUser) {
      throw new Error("Email o contraseña incorrectos. Por favor verifica tus credenciales.")
    }

    // Crear sesión de usuario
    const userSession = {
      id: validUser.id,
      name: validUser.name,
      lastName: validUser.lastName,
      email: validUser.email,
      esEstudiante: validUser.esEstudiante,
      verificacionEstudiantePendiente: validUser.verificacionEstudiantePendiente,
    }

    setUser(userSession)
    localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
  }

  // Función para registrar nuevo usuario
  const register = async (
    name: string,
    lastName: string,
    documentType: string,
    documentNumber: string,
    email: string,
    password: string,
    preguntaSeguridad?: string,
    respuestaSeguridad?: string,
  ) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const newUser = UserStorage.registerUser(
        name,
        lastName,
        documentType,
        documentNumber,
        email,
        password,
        preguntaSeguridad,
        respuestaSeguridad,
      )

      // Crear sesión automáticamente después del registro
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        esEstudiante: newUser.esEstudiante,
        verificacionEstudiantePendiente: newUser.verificacionEstudiantePendiente,
      }

      setUser(userSession)
      localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Error al registrar usuario")
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("imperius_current_user")
    setPendingAction(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user, pendingAction, setPendingAction }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
