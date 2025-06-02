
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ListChecks } from "lucide-react"; // Removed icons now in PlanCard
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { PlanCard, type Plan as PlanCardData } from "./plan-card"; // Import the new PlanCard component

// Interface for AssignedPlan remains the same as PlanCardData for consistency
type AssignedPlan = PlanCardData;

const mockAssignedPlans: AssignedPlan[] = [
  { id: 'plan-alpha', name: 'Plano General Fábrica A', lastModified: '2024-07-28', thumbnailUrl: 'https://placehold.co/300x200.png', clientName: 'Industrias Alfa', location: 'Zona Industrial Norte' },
  { id: 'plan-beta', name: 'Oficinas Corporativas Central', lastModified: '2024-07-25', thumbnailUrl: 'https://placehold.co/300x200.png', clientName: 'Global Corp', location: 'Distrito Financiero' },
  { id: 'plan-gamma', name: 'Almacén Sur Extintores', lastModified: '2024-07-22', thumbnailUrl: 'https://placehold.co/300x200.png', clientName: 'Logística Segura', location: 'Parque Logístico Sur' },
];

export function AssignedPlansViewer() {
  const router = useRouter();
  const [plans, setPlans] = React.useState<AssignedPlan[]>(mockAssignedPlans);
  const [downloadedPlanIds, setDownloadedPlanIds] = React.useState<Set<string>>(new Set());
  const [downloadingPlanIds, setDownloadingPlanIds] = React.useState<Set<string>>(new Set());

  const handleDownloadPlan = (planId: string, planName: string) => {
    if (downloadingPlanIds.has(planId)) {
      return;
    }

    setDownloadingPlanIds(prev => new Set(prev).add(planId));
    setDownloadedPlanIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(planId); // Remove from downloaded if re-downloading
      return newSet;
    });

    toast({
      title: "Descarga Iniciada",
      description: `La descarga del plano ${planName} ha comenzado.`,
    });

    setTimeout(() => {
      setDownloadingPlanIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(planId);
        return newSet;
      });
      setDownloadedPlanIds(prev => new Set(prev).add(planId));
      // Optional: Add another toast for completion
      // toast({ title: "Descarga Completada", description: `El plano ${planName} ha sido descargado.` });
    }, 2000);
  };

  const handleAuditPlan = (planId: string, planName: string) => {
    console.log(`Navegando para auditar el plano: ${planId} - ${planName}`);
    router.push(`/audit-scan/${planId}`);
  };

  const handleViewOrEditPlan = (planId: string, planName:string) => {
    console.log(`Viendo/Editando plano: ${planId}`);
    router.push(`/edit-plan/${planId}?name=${encodeURIComponent(planName)}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
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
            <ListChecks className="h-6 w-6" />
            Planos Asignados
          </CardTitle>
          <CardDescription className="mt-1">
            Visualiza y gestiona los planos de ubicación de extintores asignados.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isDownloading={downloadingPlanIds.has(plan.id)}
                isDownloaded={downloadedPlanIds.has(plan.id)}
                onViewPlan={handleViewOrEditPlan}
                onAuditPlan={handleAuditPlan}
                onEditPlan={handleViewOrEditPlan} // Assuming edit and view go to the same place for now
                onDownloadPlan={handleDownloadPlan}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No hay planos asignados</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando se te asignen planos, aparecerán aquí.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
