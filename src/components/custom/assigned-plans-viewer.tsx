
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, Download, Edit3, ListChecks, FileCheck, Check, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AssignedPlan {
  id: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string; 
  clientName?: string;
  location?: string;
}

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

  const handleDownload = (planId: string, planName: string) => {
    if (downloadingPlanIds.has(planId)) {
      return;
    }

    setDownloadingPlanIds(prev => new Set(prev).add(planId));
    setDownloadedPlanIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(planId);
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
    }, 2000); 
  };

  const handleAudit = (planId: string, planName: string) => {
    console.log(`Navegando para auditar el plano: ${planId} - ${planName}`);
    router.push(`/audit-scan/${planId}`);
  };

  const handleViewOrEditPlan = (planId: string, planName:string) => {
    console.log(`Viendo/Editando plano: ${planId}`);
    router.push(`/edit-plan/${planId}?name=${encodeURIComponent(planName)}`);
  };

  // Make clicking on the card itself navigate to edit plan
  const handleCardClick = (planId: string, planName: string, e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if the click was on the dropdown trigger or its items
    if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (e.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')) {
      return;
    }
    handleViewOrEditPlan(planId, planName);
  };
  
  const handleCardKeyDown = (planId: string, planName: string, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
       if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (e.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')) {
        return;
      }
      handleViewOrEditPlan(planId, planName);
    }
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
                <Card 
                    key={plan.id} 
                    className="overflow-hidden shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background rounded-xl transition-shadow duration-200 ease-in-out flex flex-col h-full group"
                    onClick={(e) => handleCardClick(plan.id, plan.name, e)}
                    onKeyDown={(e) => handleCardKeyDown(plan.id, plan.name, e)}
                    tabIndex={0} // Make card focusable
                    role="article" // More semantic role
                    aria-labelledby={`plan-title-${plan.id}`}
                 >
                  <div
                    className="relative w-full h-40 bg-muted flex items-center justify-center text-muted-foreground"
                    data-ai-hint="floor plan building" 
                  >
                    {/* <span>Previsualización del Plano</span> Removed placeholder text */}
                    {downloadingPlanIds.has(plan.id) && (
                      <div className="absolute top-2 right-2 bg-background/70 p-1.5 rounded-full">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                    )}
                    {!downloadingPlanIds.has(plan.id) && downloadedPlanIds.has(plan.id) && (
                       <div className="absolute top-2 right-2 bg-green-500/80 text-white p-1.5 rounded-full">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 id={`plan-title-${plan.id}`} className="font-semibold text-md text-card-foreground truncate flex-grow pr-2 group-hover:text-primary" title={plan.name}>
                        {plan.name}
                      </h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                            }}
                            aria-label={`Más opciones para ${plan.name}`}
                          >
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">Más opciones para {plan.name}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                           <DropdownMenuItem onClick={() => handleViewOrEditPlan(plan.id, plan.name)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Plano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAudit(plan.id, plan.name)}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Auditar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewOrEditPlan(plan.id, plan.name)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDownload(plan.id, plan.name)}
                            disabled={downloadingPlanIds.has(plan.id)}
                          >
                            {downloadingPlanIds.has(plan.id) ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : downloadedPlanIds.has(plan.id) ? (
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            {downloadingPlanIds.has(plan.id)
                              ? 'Descargando...'
                              : downloadedPlanIds.has(plan.id)
                              ? 'Descargado'
                              : 'Descargar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {plan.clientName && <p className="text-xs text-muted-foreground">Cliente: {plan.clientName}</p>}
                    {plan.location && <p className="text-xs text-muted-foreground">Ubicación: {plan.location}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Última mod.: {plan.lastModified}
                    </p>
                  </div>
                </Card>
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
