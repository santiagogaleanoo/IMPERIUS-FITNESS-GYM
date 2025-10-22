import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria (solo para entorno servidor)
let serverUsers: any[] = [];

/**
 * Obtiene los usuarios disponibles.
 * En el servidor usa la variable en memoria.
 * En el cliente usa localStorage (solo si se ejecutara del lado del cliente).
 */
function getUsers() {
  if (typeof window === 'undefined') {
    return serverUsers;
  }

  const data = localStorage.getItem("imperius_users_database");
  return data ? JSON.parse(data) : [];
}

/**
 * Guarda los usuarios modificados.
 */
function saveUsers(users: any[]) {
  if (typeof window === 'undefined') {
    serverUsers = [...users];
    return;
  }

  localStorage.setItem("imperius_users_database", JSON.stringify(users));
}

/**
 * ✅ POST: Aprobar automáticamente a un estudiante
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log(`🔐 Iniciando aprobación del usuario con ID: ${userId}`);

    const users = getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = users[userIndex];

    // Actualizar el estado del usuario
    const updatedUser = {
      ...user,
      esEstudiante: true,
      verificacionEstudiantePendiente: false,
      fechaVerificacion: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    console.log(`✅ Usuario ${user.email} aprobado exitosamente.`);

    return NextResponse.json({
      success: true,
      message: 'Usuario aprobado como estudiante exitosamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        esEstudiante: updatedUser.esEstudiante,
        verificacionEstudiantePendiente: updatedUser.verificacionEstudiantePendiente,
        fechaVerificacion: updatedUser.fechaVerificacion,
      },
    });
  } catch (error) {
    console.error('❌ Error en aprobación:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * 🔍 GET opcional: permite verificar el estado del usuario por URL (para test)
 * Ejemplo: /api/approve-student?userId=123
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Parámetro userId requerido' }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find((u: any) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
