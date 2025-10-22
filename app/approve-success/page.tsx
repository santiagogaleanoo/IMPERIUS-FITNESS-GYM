"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/contexto-autenticacion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, RefreshCw } from "lucide-react";

export default function ApproveSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const approveStudent = async () => {
      try {
        const userId = searchParams.get("userId");
        if (!userId) throw new Error("ID de usuario no proporcionado");

        console.log(`🔐 Procesando aprobación automática para usuario: ${userId}`);

        const response = await fetch("/api/approve-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Error al aprobar estudiante");

        console.log("✅ Usuario aprobado correctamente:", data);

        refreshUser();
        setStatus("success");
        setMessage(data.message || "Tu cuenta ha sido actualizada correctamente.");

        // Redirigir a membresías tras 5 segundos
        setTimeout(() => {
          router.push("/#membresias");
        }, 5000);
      } catch (error) {
        console.error("❌ Error durante aprobación:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Error desconocido al procesar la verificación"
        );
      }
    };

    approveStudent();
  }, [router, refreshUser, searchParams]);

  const handleRedirect = () => router.push("/#membresias");
  const handleRetry = () => window.location.reload();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Procesando Verificación</CardTitle>
            <CardDescription>Estamos actualizando tu cuenta a estudiante...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Por favor espera un momento...</p>
            <div className="animate-pulse text-sm text-muted-foreground mt-2">
              Verificando credenciales...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Error en la Verificación</CardTitle>
            <CardDescription>No pudimos procesar tu solicitud</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
            </Button>
            <Button variant="outline" onClick={handleRedirect}>
              Volver a Membresías
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">¡Verificación Exitosa!</CardTitle>
          <CardDescription>Tu cuenta ha sido actualizada correctamente</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-green-800 mb-2">🎓 Ahora eres un estudiante verificado</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Acceso a planes estudiantiles con descuento</li>
              <li>• Membresía Quincenal: $37,000</li>
              <li>• Membresía Mensual: $60,000</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Serás redirigido automáticamente a la sección de membresías en 5 segundos...
          </p>
          <Button onClick={handleRedirect} className="w-full">
            Ir a Membresías Ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
