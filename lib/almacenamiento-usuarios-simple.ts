// almacenamiento-usuarios-simple.ts
// Este archivo maneja el almacenamiento local de usuarios
// VERSIÓN CORREGIDA - Flujo de verificación estudiantil

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

export class UserStorage {
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

  // ✅ MÉTODO MEJORADO - Marcar verificación pendiente y guardar documentos
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
      console.log(`✅ Verificación marcada como PENDIENTE para usuario: ${userId}`);
      console.log(`📄 Tipo de verificación: ${tipoVerificacion}`);
      console.log(`📎 Archivos: ${archivos.length}`);
    } else {
      console.log(`⚠️ Usuario no encontrado: ${userId}`);
    }
  }

  // ✅ MÉTODO MEJORADO - Aprobar verificación de estudiante
  static aprobarVerificacionEstudiante(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("Usuario no encontrado");
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

    console.log(`✅ USUARIO VERIFICADO COMO ESTUDIANTE: ${userId}`);
    console.log(`🎓 Ahora tiene acceso a descuentos estudiantiles`);
  }

  // ✅ MÉTODO MEJORADO - Rechazar verificación de estudiante
  static rechazarVerificacionEstudiante(userId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("Usuario no encontrado");
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

    console.log(`❌ Verificación RECHAZADA para usuario: ${userId}`);
  }

  // Obtener usuario por email
  static getUserByEmail(email: string): RegisteredUser | null {
    const users = this.getUsers()
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }

  // Obtener usuario por ID
  static getUserById(userId: string): RegisteredUser | null {
    const users = this.getUsers()
    return users.find((u) => u.id === userId) || null
  }

  // Verificar si es estudiante
  static esUsuarioEstudiante(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    return user?.esEstudiante || false
  }

  // Verificar si tiene verificación pendiente
  static tieneVerificacionPendiente(userId: string): boolean {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    return user?.verificacionEstudiantePendiente || false
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

    console.log(`✅ Usuario registrado exitosamente: ${email}`)
    console.log(`Total de usuarios en la base de datos: ${users.length}`)

    return newUser
  }

  // Validar credenciales de login
  static validateLogin(email: string, password: string): RegisteredUser | null {
    const users = this.getUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (user) {
      console.log(`✅ Login exitoso para: ${email}`)
      console.log(`🎓 Estado estudiante: ${user.esEstudiante}`)
      console.log(`⏳ Verificación pendiente: ${user.verificacionEstudiantePendiente}`)
    } else {
      console.log(`❌ Login fallido para: ${email}`)
    }

    return user || null
  }

  // Cambiar contraseña
  static cambiarContrasena(email: string, nuevaContrasena: string): boolean {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) return false

    users[userIndex].password = nuevaContrasena
    this.saveUsers(users)

    console.log(`✅ Contraseña actualizada para: ${email}`)
    return true
  }

  // Sincronizar contraseña desde PHP
  static actualizarContrasenaDesdePHP(email: string, nuevaContrasena: string): boolean {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      console.log(`⚠️ Usuario ${email} no encontrado en localStorage, pero se actualizó en PHP`);
      
      // Crear usuario básico si no existe
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
      console.log(`✅ Usuario creado en localStorage: ${email}`);
      return true;
    }

    users[userIndex].password = nuevaContrasena;
    this.saveUsers(users);

    console.log(`✅ Contraseña sincronizada en localStorage para: ${email}`);
    return true;
  }

  // ✅ MÉTODO NUEVO - Enviar verificación de estudiante (COMPLETO)
  static enviarVerificacionEstudiante(
    userId: string,
    tipoVerificacion: "carnet" | "portal-edu" | "boletin",
    archivos: string[],
  ): void {
    console.log("========================================")
    console.log("📤 ENVIANDO SOLICITUD DE VERIFICACIÓN")
    console.log("========================================")
    console.log("Usuario ID:", userId)
    console.log("Tipo de verificación:", tipoVerificacion)
    console.log("Archivos:", archivos)
    
    // ✅ MARCAR COMO PENDIENTE INMEDIATAMENTE
    this.marcarVerificacionPendiente(userId, tipoVerificacion, archivos);
    
    console.log("✅ Estado actualizado: VERIFICACIÓN PENDIENTE")
    console.log("========================================")
  }

  // ✅ MÉTODO MEJORADO: Limpiar base de datos COMPLETAMENTE
  static clearDatabase(): void {
    if (typeof window === "undefined") return
    
    // Limpiar TODOS los datos
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("imperius_current_user")
    localStorage.removeItem("imperius_resenas")
    
    console.log("========================================")
    console.log("🗑️  BASE DE DATOS COMPLETAMENTE REINICIADA")
    console.log("========================================")
    console.log("✅ Todos los usuarios eliminados")
    console.log("✅ Sesiones activas eliminadas")
    console.log("✅ Verificaciones de estudiantes reseteadas")
    console.log("✅ Reseñas eliminadas")
    console.log("========================================")
    console.log("🎯 Estado actual: Base de datos VACÍA")
    console.log("🎯 Listo para empezar pruebas desde CERO")
    console.log("========================================")
  }

  // ✅ MÉTODO MEJORADO: Resetear solo verificaciones (mantener usuarios)
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
    console.log(`✅ ${users.length} usuarios actualizados`)
    console.log("✅ Todos marcados como NO estudiantes")
    console.log("✅ Verificaciones pendientes eliminadas")
    console.log("========================================")
  }

  // Exportar datos
  static exportData(): string {
    return JSON.stringify(this.getUsers(), null, 2)
  }

  // Verificar si email existe
  static emailExists(email: string): boolean {
    const users = this.getUsers()
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  // Recuperar contraseña
  static recuperarContrasena(email: string, respuestaSeguridad: string): string | null {
    const users = this.getUsers()
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.respuestaSeguridad?.toLowerCase() === respuestaSeguridad.toLowerCase(),
    )

    if (user) {
      console.log(`✅ Contraseña recuperada para: ${email}`)
      return user.password
    }

    console.log(`❌ Recuperación fallida para: ${email}`)
    return null
  }

  // ✅ MÉTODO MEJORADO: Obtener información completa del usuario
  static getUsuarioCompleto(userId: string): RegisteredUser | null {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId) || null
    
    if (user) {
      console.log(`👤 Información usuario ${userId}:`);
      console.log(`   - Estudiante: ${user.esEstudiante}`);
      console.log(`   - Verificación pendiente: ${user.verificacionEstudiantePendiente}`);
      console.log(`   - Fecha verificación: ${user.fechaVerificacion || 'N/A'}`);
    }
    
    return user;
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
}

export default UserStorage;