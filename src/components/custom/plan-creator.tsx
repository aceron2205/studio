
"use client";

import * as React from "react";
import { ArrowLeft, FilePlus2, Edit3, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// Mock data for existing plans
const mockExistingPlans = [
  { id: 'plan-1', name: 'Plano Edificio Central - Planta Baja', lastModified: '2024-07-15', thumbnailUrl: 'https://placehold.co/150x100.png' },
  { id: 'plan-2', name: 'Almacén Principal - Zona de Carga', lastModified: '2024-07-10', thumbnailUrl: 'https://placehold.co/150x100.png' },
  { id: 'plan-3', name: 'Oficinas Administrativas - Piso 2', lastModified: '2024-06-20', thumbnailUrl: 'https://placehold.co/150x100.png' },
];

export function PlanCreator() {
  const [existingPlans, setExistingPlans] = React.useState(mockExistingPlans);

  const handleCreateNewPlan = () => {
    console.log("Iniciando creación de nuevo plano...");
    // Navigate to plan editor or open modal
  };

  const handleEditPlan = (planId: string) => {
    console.log(`Editando plano: ${planId}`);
    // Navigate to plan editor with specific plan loaded
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="relative p-6">
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
            <MapPin className="h-6 w-6" />
            Planos de Ubicación
          </CardTitle>
          <CardDescription className="mt-1">
            Crea un nuevo plano o continúa trabajando en uno existente.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-card-foreground">
            Comenzar un Nuevo Diseño
          </h3>
          <Button
            onClick={handleCreateNewPlan}
            className="w-full md:w-auto"
            size="lg"
          >
            <FilePlus2 className="mr-2 h-5 w-5" />
            Crear Nuevo Plano
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Inicia el diseño de la distribución de extintores para una nueva área o edificio.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-6 text-card-foreground">
            Continuar Plano Existente
          </h3>
          {existingPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative w-full h-32 sm:h-36">
                    <Image
                      src={plan.thumbnailUrl}
                      alt={`Previsualización de ${plan.name}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint="map blueprint"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-semibold text-md text-card-foreground truncate" title={plan.name}>
                      {plan.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Última modificación: {plan.lastModified}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleEditPlan(plan.id)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar Plano
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No tienes planos guardados. ¡Crea uno nuevo para empezar!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
