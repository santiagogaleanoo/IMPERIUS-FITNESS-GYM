// almacenamiento-usuarios.ts - VERSIÓN CORREGIDA
// Base de datos local para el sistema de verificación estudiantil

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
  fechaVerificacion?: string
  documentosVerificacion?: {
    tipoVerificacion: "carnet" | "portal-edu" | "boletin"
    archivos: string[]
    fechaEnvio: string
  }
  preguntaSeguridad?: string
  respuestaSeguridad?: string
}

const STORAGE_KEY = "imperius_users_database"

// Declaración global para TypeScript
declare global {
  interface Window {
    UserStorage: typeof UserStorage;
    debugUsers: () => void;
  }
}

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

  static getAllUsers(): RegisteredUser[] {
    return this.getUsers()
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
      console.log(`[v0] 🎓 Estado estudiante: ${user.esEstudiante}`)
      console.log(`[v0] ⏳ Verificación pendiente: ${user.verificacionEstudiantePendiente}`)
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

  // ✅ NUEVO MÉTODO: Sincronizar contraseña desde PHP
  static actualizarContrasenaDesdePHP(email: string, nuevaContrasena: string): boolean {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      console.log(`[v0] ⚠️ Usuario ${email} no encontrado en localStorage, pero se actualizó en PHP`);
      
      // Opcional: Crear usuario básico si no existe
      const nuevoUsuario: RegisteredUser = {
        id: `user_php_${Date.now()}`,
        name: "Usuario",
        lastName: "Recuperación",
        documentType: "CC",
        documentNumber: "000000",
        email: email,
        password: nuevaContrasena,
        createdAt: new Date().toISOString(),
        esEstudiante: false,
        verificacionEstudiantePendiente: false,
      }
      
      users.push(nuevoUsuario);
      this.saveUsers(users);
      console.log(`[v0] ✅ Usuario creado en localStorage: ${email}`);
      return true;
    }

    users[userIndex].password = nuevaContrasena;
    this.saveUsers(users);

    console.log(`[v0] ✅ Contraseña sincronizada en localStorage para: ${email}`);
    return true;
  }

  // ✅ MÉTODO CORREGIDO: Marcar verificación como pendiente
  static marcarVerificacionPendiente(
    userId: string, 
    tipoVerificacion: "carnet" | "portal-edu" | "boletin",
    archivos: string[] = []
  ): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].verificacionEstudiantePendiente = true;
      users[userIndex].documentosVerificacion = {
        tipoVerificacion,
        archivos,
        fechaEnvio: new Date().toISOString()
      };
      this.saveUsers(users);
      console.log(`[v0] ✅ Verificación marcada como pendiente para usuario: ${userId}`);
    }
  }

  // ✅ MÉTODO CORREGIDO: Aprobar verificación de estudiante
  static aprobarVerificacionEstudiante(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      console.warn(`[v0] ⚠️ Usuario no encontrado: ${userId}`);
      return;
    }

    users[userIndex].esEstudiante = true;
    users[userIndex].verificacionEstudiantePendiente = false;
    users[userIndex].fechaVerificacion = new Date().toISOString();

    this.saveUsers(users);
    
    // Actualizar también el usuario en sesión si está activo
    const currentUser = localStorage.getItem("imperius_current_user");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.id === userId) {
        userData.esEstudiante = true;
        userData.verificacionEstudiantePendiente = false;
        userData.fechaVerificacion = users[userIndex].fechaVerificacion;
        localStorage.setItem("imperius_current_user", JSON.stringify(userData));
      }
    }

    console.log(`[v0] ✅ Usuario verificado como estudiante: ${userId}`);
    
    // Disparar evento personalizado para notificar a la aplicación
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userVerificationUpdated', {
        detail: { userId, approved: true }
      }));
    }
  }

  // ✅ MÉTODO CORREGIDO: Rechazar verificación de estudiante
  static rechazarVerificacionEstudiante(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      console.warn(`[v0] ⚠️ Usuario no encontrado: ${userId}`);
      return;
    }

    users[userIndex].verificacionEstudiantePendiente = false;
    users[userIndex].documentosVerificacion = undefined;
    
    this.saveUsers(users);

    // Actualizar también el usuario en sesión si está activo
    const currentUser = localStorage.getItem("imperius_current_user");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.id === userId) {
        userData.verificacionEstudiantePendiente = false;
        localStorage.setItem("imperius_current_user", JSON.stringify(userData));
      }
    }

    console.log(`[v0] ❌ Verificación rechazada para usuario: ${userId}`);
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
    console.log("[v0] ========================================")
    console.log("[v0] 📤 ENVIANDO SOLICITUD DE VERIFICACIÓN")
    console.log("[v0] ========================================")
    console.log("[v0] Usuario ID:", userId)
    console.log("[v0] Tipo de verificación:", tipoVerificacion)
    console.log("[v0] Archivos:", archivos.length)
    
    // ✅ MARCAR COMO PENDIENTE INMEDIATAMENTE
    this.marcarVerificacionPendiente(userId, tipoVerificacion, archivos);
    
    console.log("[v0] ✅ Estado actualizado: VERIFICACIÓN PENDIENTE")
    console.log("[v0] ========================================")
  }

  static esUsuarioEstudiante(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    return user?.esEstudiante || false
  }

  // ✅ MÉTODO CORREGIDO: Verificar si un usuario tiene verificación pendiente
  static tieneVerificacionPendiente(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    return user?.verificacionEstudiantePendiente || false
  }

  // ✅ MÉTODO CORREGIDO: Obtener información completa del usuario
  static getUsuarioCompleto(userId: string): RegisteredUser | null {
    const users = this.getUsers()
    return users.find((u) => u.id === userId) || null
  }

  // ✅ MÉTODO NUEVO: Obtener usuario por ID
  static getUserById(userId: string): RegisteredUser | null {
    return this.getUsuarioCompleto(userId);
  }

  // ✅ MÉTODO NUEVO: Resetear solo verificaciones (mantener usuarios)
  static resetearSoloVerificaciones(): void {
    const users = this.getUsers();
    
    const usersActualizados = users.map(user => ({
      ...user,
      esEstudiante: false,
      verificacionEstudiantePendiente: false,
      fechaVerificacion: undefined,
      documentosVerificacion: undefined
    }));

    this.saveUsers(usersActualizados);
    
    // Actualizar usuario en sesión si existe
    const currentUser = localStorage.getItem("imperius_current_user");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      userData.esEstudiante = false;
      userData.verificacionEstudiantePendiente = false;
      localStorage.setItem("imperius_current_user", JSON.stringify(userData));
    }
    
    console.log("========================================")
    console.log("🔄 VERIFICACIONES DE ESTUDIANTES RESETEADAS")
    console.log("========================================")
  }

  // ✅ MÉTODO NUEVO: Ver estadísticas de la base de datos
  static obtenerEstadisticas() {
    const users = this.getUsers();
    return {
      totalUsuarios: users.length,
      estudiantes: users.filter(u => u.esEstudiante).length,
      verificacionesPendientes: users.filter(u => u.verificacionEstudiantePendiente).length,
      usuariosRegulares: users.filter(u => !u.esEstudiante && !u.verificacionEstudiantePendiente).length
    };
  }

  // ✅ MÉTODO NUEVO: Forzar actualización del estado del usuario
  static forceRefreshUserState(userId: string): void {
    const user = this.getUsuarioCompleto(userId);
    if (user) {
      const currentUser = localStorage.getItem("imperius_current_user");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.esEstudiante = user.esEstudiante;
        userData.verificacionEstudiantePendiente = user.verificacionEstudiantePendiente;
        localStorage.setItem("imperius_current_user", JSON.stringify(userData));
        console.log("🔄 Estado del usuario actualizado forzadamente");
      }
    }
  }

  // ✅ MÉTODO NUEVO: Debugging rápido
  static debug(): void {
    if (typeof window === 'undefined') return;
    
    console.log("🔍 DEBUG - UserStorage");
    console.log("========================");
    
    const users = this.getUsers();
    const currentUser = localStorage.getItem("imperius_current_user");
    
    console.log(`📊 Total usuarios: ${users.length}`);
    console.log(`🎓 Estudiantes: ${users.filter(u => u.esEstudiante).length}`);
    console.log(`⏳ Pendientes: ${users.filter(u => u.verificacionEstudiantePendiente).length}`);
    console.log(`👤 Usuario actual:`, currentUser ? JSON.parse(currentUser) : "No hay sesión");
    console.log("========================");
  }
}

// ===========================================
// DEBUGGING: Hacer UserStorage global para pruebas
// ===========================================
if (typeof window !== 'undefined') {
  // @ts-ignore - Ignorar error de TypeScript para asignación global
  window.UserStorage = UserStorage;
  
  // @ts-ignore - Ignorar error de TypeScript para asignación global
  window.debugUsers = function() {
    const users = JSON.parse(localStorage.getItem("imperius_users_database") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("imperius_current_user") || "null");
    
    console.log("🔍 DEBUG RÁPIDO - SISTEMA DE USUARIOS");
    console.log("========================================");
    console.log("📊 Total usuarios:", users.length);
    console.log("🎓 Estudiantes verificados:", users.filter((u: any) => u.esEstudiante).length);
    console.log("⏳ Verificaciones pendientes:", users.filter((u: any) => u.verificacionEstudiantePendiente).length);
    console.log("👤 Usuario actual:", currentUser);
    console.log("========================================");
    
    users.forEach((user: any, index: number) => {
      console.log(`👤 Usuario ${index + 1}:`, {
        id: user.id,
        email: user.email,
        nombre: `${user.name} ${user.lastName}`,
        esEstudiante: user.esEstudiante,
        verificacionPendiente: user.verificacionEstudiantePendiente,
        fechaVerificacion: user.fechaVerificacion || 'No verificada'
      });
    });
  };
  
  console.log("✅ UserStorage cargado correctamente");
}

export default UserStorage;