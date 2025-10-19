// Sistema de almacenamiento de reseñas de productos
// Maneja la creación, edición, eliminación y recuperación de reseñas

export interface Resena {
  id: string
  productoId: string
  usuarioEmail: string
  usuarioNombre: string
  calificacion: number // 1-5 estrellas
  comentario: string
  fecha: string
  editado?: boolean
  respuestas?: RespuestaResena[]
}

export interface RespuestaResena {
  id: string
  usuarioEmail: string
  usuarioNombre: string
  comentario: string
  fecha: string
}

const STORAGE_KEY = "imperius_resenas"

// Obtener todas las reseñas de un producto
export function obtenerResenasPorProducto(productoId: string): Resena[] {
  if (typeof window === "undefined") return []

  try {
    const resenas = localStorage.getItem(STORAGE_KEY)
    if (!resenas) return []

    const todasLasResenas: Resena[] = JSON.parse(resenas)
    return todasLasResenas
      .filter((r) => r.productoId === productoId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    return []
  }
}

// Agregar una nueva reseña
export function agregarResena(resena: Omit<Resena, "id" | "fecha">): Resena {
  const nuevaResena: Resena = {
    ...resena,
    id: `resena_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fecha: new Date().toISOString(),
    respuestas: [],
  }

  const resenas = obtenerTodasLasResenas()
  resenas.push(nuevaResena)
  guardarResenas(resenas)

  return nuevaResena
}

// Editar una reseña existente
export function editarResena(resenaId: string, nuevoComentario: string, nuevaCalificacion: number): boolean {
  const resenas = obtenerTodasLasResenas()
  const index = resenas.findIndex((r) => r.id === resenaId)

  if (index === -1) return false

  resenas[index] = {
    ...resenas[index],
    comentario: nuevoComentario,
    calificacion: nuevaCalificacion,
    editado: true,
  }

  guardarResenas(resenas)
  return true
}

// Eliminar una reseña
export function eliminarResena(resenaId: string): boolean {
  const resenas = obtenerTodasLasResenas()
  const nuevasResenas = resenas.filter((r) => r.id !== resenaId)

  if (nuevasResenas.length === resenas.length) return false

  guardarResenas(nuevasResenas)
  return true
}

// Agregar respuesta a una reseña
export function agregarRespuesta(resenaId: string, respuesta: Omit<RespuestaResena, "id" | "fecha">): boolean {
  const resenas = obtenerTodasLasResenas()
  const index = resenas.findIndex((r) => r.id === resenaId)

  if (index === -1) return false

  const nuevaRespuesta: RespuestaResena = {
    ...respuesta,
    id: `respuesta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fecha: new Date().toISOString(),
  }

  if (!resenas[index].respuestas) {
    resenas[index].respuestas = []
  }

  resenas[index].respuestas!.push(nuevaRespuesta)
  guardarResenas(resenas)

  return true
}

// Calcular calificación promedio de un producto
export function calcularCalificacionPromedio(productoId: string): {
  promedio: number
  total: number
  distribucion: { [key: number]: number }
} {
  const resenas = obtenerResenasPorProducto(productoId)

  if (resenas.length === 0) {
    return {
      promedio: 0,
      total: 0,
      distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0)
  const promedio = suma / resenas.length

  // Calcular distribución de estrellas
  const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  resenas.forEach((r) => {
    distribucion[r.calificacion as keyof typeof distribucion]++
  })

  return {
    promedio: parseFloat(promedio.toFixed(1)), // ✅ Muestra decimales exactos (ej: 4.3, 4.4)
    total: resenas.length,
    distribucion,
  }
}


// Funciones auxiliares privadas
function obtenerTodasLasResenas(): Resena[] {
  if (typeof window === "undefined") return []

  try {
    const resenas = localStorage.getItem(STORAGE_KEY)
    return resenas ? JSON.parse(resenas) : []
  } catch (error) {
    console.error("Error al obtener todas las reseñas:", error)
    return []
  }
}

function guardarResenas(resenas: Resena[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resenas))
  } catch (error) {
    console.error("Error al guardar reseñas:", error)
  }
}
