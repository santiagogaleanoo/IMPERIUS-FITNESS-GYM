// Este archivo maneja el almacenamiento local de usuarios
// Nombre del archivo: imperius_users_database.json (simulado en localStorage)

export interface RegisteredUser {
  id: string
  name: string
  lastName: string
  documentType: string
  documentNumber: string
  email: string
  password: string
  createdAt: string
  esEstudiante: boolean
  verificacionEstudiantePendiente: boolean
  documentosVerificacion?: {
    tipoVerificacion: "carnet" | "portal-edu" | "boletin"
    archivos: string[]
    fechaEnvio: string
  }
  preguntaSeguridad?: string
  respuestaSeguridad?: string
}

const STORAGE_KEY = "imperius_users_database"

export class UserStorage {
  static clearDatabase(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("imperius_current_user")
    localStorage.removeItem("imperius_resenas")
    console.log("[v0] ✅ Base de datos limpiada completamente")
    console.log("[v0] - Usuarios eliminados")
    console.log("[v0] - Sesión actual eliminada")
    console.log("[v0] - Reseñas eliminadas")
  }

  // Obtener todos los usuarios registrados
  static getUsers(): RegisteredUser[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // Guardar usuarios
  static saveUsers(users: RegisteredUser[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }

  // Registrar nuevo usuario
  static registerUser(
    name: string,
    lastName: string,
    documentType: string,
    documentNumber: string,
    email: string,
    password: string,
    preguntaSeguridad?: string,
    respuestaSeguridad?: string,
  ): RegisteredUser {
    const users = this.getUsers()

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Este email ya está registrado")
    }

    if (users.some((u) => u.documentNumber === documentNumber)) {
      throw new Error("Este número de documento ya está registrado")
    }

    const newUser: RegisteredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      lastName,
      documentType,
      documentNumber,
      email,
      password,
      createdAt: new Date().toISOString(),
      esEstudiante: false,
      verificacionEstudiantePendiente: false,
      preguntaSeguridad,
      respuestaSeguridad,
    }

    users.push(newUser)
    this.saveUsers(users)

    console.log(`[v0] ✅ Usuario registrado exitosamente: ${email}`)
    console.log(`[v0] Total de usuarios en la base de datos: ${users.length}`)

    return newUser
  }

  // Validar credenciales de login
  static validateLogin(email: string, password: string): RegisteredUser | null {
    const users = this.getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (user) {
      console.log(`[v0] ✅ Login exitoso para: ${email}`)
    } else {
      console.log(`[v0] ❌ Login fallido para: ${email}`)
    }

    return user || null
  }

  // Verificar si un email existe
  static emailExists(email: string): boolean {
    const users = this.getUsers()
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  static getUserByEmail(email: string): RegisteredUser | null {
    const users = this.getUsers()
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }

  static recuperarContrasena(email: string, respuestaSeguridad: string): string | null {
    const users = this.getUsers()
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.respuestaSeguridad?.toLowerCase() === respuestaSeguridad.toLowerCase(),
    )

    if (user) {
      console.log(`[v0] ✅ Contraseña recuperada para: ${email}`)
      return user.password
    }

    console.log(`[v0] ❌ Recuperación fallida para: ${email}`)
    return null
  }

  static cambiarContrasena(email: string, nuevaContrasena: string): boolean {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) return false

    users[userIndex].password = nuevaContrasena
    this.saveUsers(users)

    console.log(`[v0] ✅ Contraseña actualizada para: ${email}`)
    return true
  }

  // Exportar datos (para migración a base de datos)
  static exportData(): string {
    return JSON.stringify(this.getUsers(), null, 2)
  }

  static enviarVerificacionEstudiante(
    userId: string,
    tipoVerificacion: "carnet" | "portal-edu" | "boletin",
    archivos: string[],
  ): void {
    // Solo mostrar en consola, NO modificar el estado del usuario
    console.log("[v0] ========================================")
    console.log("[v0] SOLICITUD DE VERIFICACIÓN GUARDADA LOCALMENTE")
    console.log("[v0] (No se envía a ningún lado por ahora)")
    console.log("[v0] ========================================")
    console.log("[v0] Usuario ID:", userId)
    console.log("[v0] Tipo de verificación:", tipoVerificacion)
    console.log("[v0] Archivos:", archivos)
    console.log("[v0] ")
    console.log("[v0] Esta funcionalidad se implementará más adelante")
    console.log("[v0] para enviar a: santiagis029@gmail.com")
    console.log("[v0] ========================================")
  }

  static aprobarVerificacionEstudiante(userId: string): void {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("Usuario no encontrado")
    }

    users[userIndex].esEstudiante = true
    users[userIndex].verificacionEstudiantePendiente = false

    this.saveUsers(users)
  }

  static esUsuarioEstudiante(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    return user?.esEstudiante || false
  }
}

// Ahora se debe llamar manualmente a UserStorage.clearDatabase() cuando sea necesario
