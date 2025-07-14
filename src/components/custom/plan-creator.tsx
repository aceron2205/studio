
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { PlanCard, type Plan as PlanCardData } from "./plan-card"; // Import PlanCard
import { toast } from "@/hooks/use-toast"; // Import toast for placeholder actions
import { ArrowLeft, FilePlus2, Edit3, MapPin } from "lucide-react";

// Mock data for existing plans - adapted to fit PlanCardData structure more closely
const mockExistingPlans: PlanCardData[] = [
  { id: 'plan-1', name: 'Plano Edificio Central - Planta Baja', lastModified: '2024-07-15', thumbnailUrl: 'https://placehold.co/150x100.png', clientName: 'Interno', location: 'Edificio Principal' },
  { id: 'plan-2', name: 'Almacén Principal - Zona de Carga', lastModified: '2024-07-10', thumbnailUrl: 'https://placehold.co/150x100.png', clientName: 'Logística XYZ', location: 'Almacén A' },
  { id: 'plan-3', name: 'Oficinas Administrativas - Piso 2', lastModified: '2024-06-20', thumbnailUrl: 'https://placehold.co/150x100.png', clientName: 'Administración Central', location: 'Oficinas Piso 2' },
];

export function PlanCreator() {
  const router = useRouter();
  const [existingPlansData, setExistingPlansData] = React.useState<PlanCardData[]>(mockExistingPlans);

  const handleCreateNewPlan = () => {
    console.log("Iniciando creación de nuevo plano/auditoría...");
    router.push('/new-extinguisher-form');
  };

  const handleNavigateToEdit = (planId: string, planName: string) => {
    console.log(`Editando plano: ${planId}`);
    router.push(`/edit-plan/${planId}?name=${encodeURIComponent(planName)}`);
  };

  const handleAuditPlanPlaceholder = (planId: string, planName: string) => {
    toast({
      title: "Acción no disponible",
      description: `La auditoría para el plano "${planName}" se inicia desde 'Planos Asignados' o 'Iniciar Auditoría'.`,
    });
    console.log(`Intento de auditar plano: ${planId} desde PlanCreator (no aplicable aquí).`);
  };

  const handleDownloadPlanPlaceholder = (planId: string, planName: string) => {
    toast({
      title: "Acción no disponible",
      description: `La descarga del plano "${planName}" se gestiona en 'Planos Asignados'.`,
    });
    console.log(`Intento de descargar plano: ${planId} desde PlanCreator (no aplicable aquí).`);
  };


  return (
    <div className="w-full"> {/* Outer div replacing Card */}
      <header className="relative p-4 md:p-6 border-b"> {/* Header section */}
        <div className="flex items-center justify-center relative">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Volver al Inicio"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
          </Link>
          <div className="w-full text-center">
            <h1 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Planos de Ubicación
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crea un nuevo plano o continúa trabajando en uno existente.
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-8"> {/* Main content replacing CardContent */}
        <section> {/* Section for new plan */}
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Comenzar un Nuevo Plano
          </h2>
          <Button
            onClick={handleCreateNewPlan}
            className="w-full md:w-auto"
            size="lg"
          >
            <FilePlus2 className="mr-2 h-5 w-5" />
            Crear Nuevo Plano de Ubicación
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Inicia el registro detallado y la distribución de extintores para una nueva área o cliente.
          </p>
        </section>

        <Separator />

        <section> {/* Section for existing plans */}
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Continuar Plano Existente
          </h2>
          {existingPlansData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingPlansData.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isDownloading={false} // No download state managed here
                  isDownloaded={false}  // No download state managed here
                  onViewPlan={handleNavigateToEdit}
                  onAuditPlan={handleAuditPlanPlaceholder} // Placeholder action
                  onDownloadPlan={handleDownloadPlanPlaceholder} // Placeholder action
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No tienes planos visuales guardados.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
