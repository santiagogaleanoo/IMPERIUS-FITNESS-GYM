"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { UserStorage } from "@/lib/almacenamiento-usuarios-simple"

// Interfaz que define la estructura de un usuario
interface User {
  id: string
  name: string
  lastName: string
  email: string
  esEstudiante: boolean
  verificacionEstudiantePendiente: boolean
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

  // ✅ MÉTODO MEJORADO: Forzar actualización inmediata del usuario
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
          esEstudiante: updatedUser.esEstudiante,
          verificacionEstudiantePendiente: updatedUser.verificacionEstudiantePendiente,
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
      }
    }
  };

  // 🔁 ACTUALIZA LOS DATOS DEL USUARIO - SOLO LOCAL (SIN PHP)
  const refreshUser = async () => {
    console.log("🔄 Sincronizando datos del usuario desde localStorage...");

    const savedUser = localStorage.getItem("imperius_current_user")
    if (!savedUser) return
    
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
          esEstudiante: localUser.esEstudiante,
          verificacionEstudiantePendiente: localUser.verificacionEstudiantePendiente,
        }

        // Actualizar siempre para asegurar sincronización
        setUser(refreshedUser)
        localStorage.setItem("imperius_current_user", JSON.stringify(refreshedUser))
        
        console.log("✅ Usuario sincronizado desde localStorage:", {
          id: localUser.id,
          esEstudiante: localUser.esEstudiante,
          pendiente: localUser.verificacionEstudiantePendiente
        });
      } else {
        console.warn("⚠️ Usuario no encontrado en localStorage, ID:", userData.id);
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
      // Sincronizar inmediatamente al cargar
      setTimeout(() => refreshUser(), 1000)
    }
  }, [])

  // ✅ SISTEMA MEJORADO DE SINCRONIZACIÓN EN TIEMPO REAL
  useEffect(() => {
    // 1. Intervalo de sincronización cada 5 segundos (menos frecuente)
    const syncInterval = setInterval(() => {
      if (user && user.verificacionEstudiantePendiente) {
        console.log("⏳ Verificando estado de verificación...")
        refreshUser()
      }
    }, 5000) // cada 5 segundos

    // 2. Escuchar mensajes de aprobación desde ventanas PHP
    const handleMessage = (event: MessageEvent) => {
      console.log("📨 Mensaje recibido:", event.data)
      
      if (event.data.type === "ESTUDIANTE_VERIFICADO" || event.data.type === "APPROVE_USER") {
        const userId = event.data.userId
        console.log("✅ Mensaje de aprobación recibido para usuario:", userId)
        
        // Verificar si es el usuario actual
        const currentUser = localStorage.getItem("imperius_current_user")
        if (currentUser) {
          const userData = JSON.parse(currentUser)
          if (userData.id === userId) {
            console.log("🎯 Es el usuario actual, actualizando estado...")
            
            // Actualizar estado local inmediatamente
            UserStorage.aprobarVerificacionEstudiante(userId)
            
            // Forzar actualización de la interfaz
            setTimeout(() => {
              forceRefreshUser()
              refreshUser()
            }, 500)
            
            // Mostrar notificación
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('showToast', {
                detail: {
                  title: "🎉 ¡Verificación aprobada!",
                  description: "Ahora puedes acceder a los descuentos estudiantiles",
                  type: "success"
                }
              }))
            }
          }
        }
      }
    }

    // 3. BroadcastChannel para comunicación entre pestañas
    let broadcastChannel: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('estudiante_verificacion')
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'USUARIO_VERIFICADO') {
          console.log("📡 Mensaje broadcast recibido:", event.data)
          const userId = event.data.userId
          
          const currentUser = localStorage.getItem("imperius_current_user")
          if (currentUser) {
            const userData = JSON.parse(currentUser)
            if (userData.id === userId) {
              UserStorage.aprobarVerificacionEstudiante(userId)
              setTimeout(() => {
                forceRefreshUser()
                refreshUser()
              }, 500)
            }
          }
        }
      }
    }

    // 4. Escuchar evento de cambio de almacenamiento (localStorage)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "imperius_users_database" || event.key === "imperius_current_user") {
        console.log("💾 Cambio detectado en localStorage, actualizando...")
        setTimeout(() => {
          forceRefreshUser()
        }, 1000)
      }
    }

    // 5. Escuchar evento personalizado de cambio de usuario
    const handleUserStateChange = (event: CustomEvent) => {
      console.log("🔔 Evento de cambio de usuario recibido")
      setUser(event.detail)
    }

    // Registrar event listeners
    window.addEventListener("message", handleMessage)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener('userStateChanged', handleUserStateChange as EventListener)

    // Cleanup
    return () => {
      clearInterval(syncInterval)
      window.removeEventListener("message", handleMessage)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener('userStateChanged', handleUserStateChange as EventListener)
      if (broadcastChannel) {
        broadcastChannel.close()
      }
    }
  }, [user])

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const validUser = UserStorage.validateLogin(email, password)
    if (!validUser) throw new Error("Email o contraseña incorrectos.")

    const userSession: User = {
      id: validUser.id,
      name: validUser.name,
      lastName: validUser.lastName,
      email: validUser.email,
      esEstudiante: validUser.esEstudiante,
      verificacionEstudiantePendiente: validUser.verificacionEstudiantePendiente,
    }

    setUser(userSession)
    localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
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
      esEstudiante: newUser.esEstudiante,
      verificacionEstudiantePendiente: newUser.verificacionEstudiantePendiente,
    }

    setUser(userSession)
    localStorage.setItem("imperius_current_user", JSON.stringify(userSession))
  }

  const logout = () => {
    console.log("🚪 Cerrando sesión...")
    setUser(null)
    localStorage.removeItem("imperius_current_user")
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
        forceRefreshUser
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