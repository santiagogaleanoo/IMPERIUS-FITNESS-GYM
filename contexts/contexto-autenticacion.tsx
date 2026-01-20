"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { UserStorage } from "@/lib/almacenamiento-usuarios"

// Interfaz simplificada
interface User {
  id: string
  name: string
  lastName: string
  email: string
}

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
    respuestaSeguridad?: string
  ) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  pendingAction: (() => void) | null
  setPendingAction: (action: (() => void) | null) => void
  refreshUser: () => Promise<void>
  forceRefreshUser: () => void
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // ✅ MÉTODO SIMPLIFICADO
  const forceRefreshUser = () => {
    console.log("🔄 Forzando actualización completa del usuario...");
    const savedUser = localStorage.getItem("imperius_current_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Buscar usuario actualizado en la base de datos local
      const updatedUser = UserStorage.getUsuarioCompleto(userData.id);
      
      if (updatedUser) {
        const refreshedUser: User = {
          id: updatedUser.id,
          name: updatedUser.name,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        };
        
        // Solo actualizar si hay cambios
        if (JSON.stringify(user) !== JSON.stringify(refreshedUser)) {
          setUser(refreshedUser);
          localStorage.setItem("imperius_current_user", JSON.stringify(refreshedUser));
          console.log("✅ Estado del usuario actualizado forzadamente:", refreshedUser);
          
          // Disparar evento personalizado para notificar a otros componentes
          window.dispatchEvent(new CustomEvent('userStateChanged', {
            detail: refreshedUser
          }));
        }
      } else {
        console.warn("⚠️ Usuario no encontrado en localStorage durante forceRefresh");
      }
    } else {
      console.log("ℹ️ No hay usuario en sesión para forzar actualización");
    }
  };

  // 🔁 ACTUALIZA LOS DATOS DEL USUARIO - SOLO LOCAL (SIN PHP)
  const refreshUser = async () => {
    console.log("🔄 Sincronizando datos del usuario desde localStorage...");

    const savedUser = localStorage.getItem("imperius_current_user")
    if (!savedUser) {
      console.log("ℹ️ No hay usuario en sesión para refrescar");
      return;
    }
    
    const userData = JSON.parse(savedUser)

    try {
      // ✅ SOLUCIÓN: Usar solo localStorage, no hacer fetch a PHP
      const localUser = UserStorage.getUserById(userData.id)
      
      if (localUser) {
        const refreshedUser: User = {
          id: localUser.id,
          name: localUser.name,
          lastName: localUser.lastName,
          email: localUser.email,
        }

        // Actualizar siempre para asegurar sincronización
        setUser(refreshedUser)
        localStorage.setItem("imperius_current_user", JSON.stringify(refreshedUser))
        
        console.log("✅ Usuario sincronizado desde localStorage:", {
          id: localUser.id,
          nombre: `${localUser.name} ${localUser.lastName}`,
          email: localUser.email
        });
      } else {
        console.warn("⚠️ Usuario no encontrado en localStorage, ID:", userData.id);
        // Si el usuario no existe en la base de datos, cerrar sesión
        setUser(null);
        localStorage.removeItem("imperius_current_user");
      }

    } catch (error) {
      console.error("❌ Error en refreshUser:", error)
      // En caso de error, mantener el usuario actual
      console.log("🔄 Usando datos de sesión actual debido a error");
    }
  }

  // 🧠 Carga inicial del usuario
  useEffect(() => {
    const savedUser = localStorage.getItem("imperius_current_user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      console.log("👤 Usuario cargado desde localStorage:", userData.email);
      // Sincronizar inmediatamente al cargar
      setTimeout(() => refreshUser(), 1000)
    }
  }, [])

  // ✅ SISTEMA SIMPLIFICADO DE SINCRONIZACIÓN EN TIEMPO REAL
  useEffect(() => {
    console.log("🔧 Configurando sistema de sincronización básica...");

    // 1. Escuchar evento de cambio de almacenamiento (localStorage) - Sincronización entre pestañas
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "imperius_users_database" || event.key === "imperius_current_user") {
        console.log("💾 Cambio detectado en localStorage, actualizando...")
        // Esperar un poco para asegurar que los cambios se hayan completado
        setTimeout(() => {
          forceRefreshUser()
          refreshUser()
        }, 1000)
      }
    }

    // 2. Escuchar evento personalizado de cambio de usuario
    const handleUserStateChange = (event: CustomEvent) => {
      console.log("🔔 Evento de cambio de usuario recibido")
      setUser(event.detail)
    }

    // Registrar event listeners
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener('userStateChanged', handleUserStateChange as EventListener)

    // Cleanup
    return () => {
      console.log("🧹 Limpiando listeners de sincronización...");
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener('userStateChanged', handleUserStateChange as EventListener)
    }
  }, [user, forceRefreshUser, refreshUser])

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    console.log("🔐 Intentando login para:", email);
    await new Promise((resolve) => setTimeout(resolve, 800))
    const validUser = UserStorage.validateLogin(email, password)
    if (!validUser) throw new Error("Email o contraseña incorrectos.")

    const userSession: User = {
      id: validUser.id,
      name: validUser.name,
      lastName: validUser.lastName,
      email: validUser.email,
    }

    setUser(userSession)
    localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
    console.log("✅ Login exitoso, usuario establecido en sesión");
    await refreshUser()
  }

  // Registrar usuario
  const register = async (
    name: string,
    lastName: string,
    documentType: string,
    documentNumber: string,
    email: string,
    password: string,
    preguntaSeguridad?: string,
    respuestaSeguridad?: string
  ) => {
    console.log("📝 Registrando nuevo usuario:", email);
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newUser = UserStorage.registerUser(
      name,
      lastName,
      documentType,
      documentNumber,
      email,
      password,
      preguntaSeguridad,
      respuestaSeguridad
    )

    const userSession: User = {
      id: newUser.id,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
    }

    setUser(userSession)
    localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
    console.log("✅ Registro exitoso, usuario establecido en sesión");
  }

  const logout = () => {
    console.log("🚪 Cerrando sesión...")
    setUser(null)
    localStorage.removeItem("imperius_current_user")
    console.log("✅ Sesión cerrada correctamente");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        pendingAction,
        setPendingAction,
        refreshUser,
        forceRefreshUser,
        // ELIMINADO: checkVerificationStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}