
"use client";

import Link from 'next/link';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="relative p-6 border-b">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Volver al Inicio"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="w-full text-center">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
                <SettingsIcon className="h-6 w-6" />
                Ajustes
              </CardTitle>
              <CardDescription className="mt-1">
                Configura las opciones de la aplicación.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Esta sección está en desarrollo. Aquí podrás configurar preferencias de la aplicación, notificaciones y más.
            </p>
            {/* Placeholder for future settings options */}
            <div className="mt-6 space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="font-medium">Preferencias de Usuario (Próximamente)</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="font-medium">Configuración de Notificaciones (Próximamente)</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="font-medium">Gestión de Cuenta (Próximamente)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
