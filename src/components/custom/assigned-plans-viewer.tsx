
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast"; // Kept for potential future use, but not directly used now

// Interface for Plan data
interface AssignedPlan {
  id: string;
  name: string;
  lastModified: string;
  clientName?: string;
  location?: string;
  // thumbnailUrl is no longer used in this list view
}

const mockAssignedPlans: AssignedPlan[] = [
  { id: 'plan-alpha', name: 'Plano General Fábrica A', lastModified: '2024-07-28', clientName: 'Industrias Alfa', location: 'Zona Industrial Norte' },
  { id: 'plan-beta', name: 'Oficinas Corporativas Central', lastModified: '2024-07-25', clientName: 'Global Corp', location: 'Distrito Financiero' },
  { id: 'plan-gamma', name: 'Almacén Sur Extintores', lastModified: '2024-07-22', clientName: 'Logística Segura', location: 'Parque Logístico Sur' },
];

export function AssignedPlansViewer() {
  const router = useRouter();
  const [plans, setPlans] = React.useState<AssignedPlan[]>(mockAssignedPlans);

  const handleViewOrEditPlan = (planId: string, planName: string) => {
    console.log(`Viendo/Editando plano: ${planId}`);
    // Redirect to the audit-scan component with the planId
    router.push(`/audit-scan/${planId}`);
  };

  return (
 <div className="w-full">
 <div className="relative py-6 border-b px-4 sm:px-6 lg:px-8">
 <Link href="/" passHref>
 <Button
 variant="ghost"
 size="icon"
 aria-label="Volver al Inicio"
 className="absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
 </Link>
 <h1 className="text-2xl font-bold text-foreground text-center">
 Planos Asignados
 </h1>
 </div>

 <div className="p-4 sm:p-6 lg:p-8">
 {plans.length > 0 ? (
 <ul className="divide-y divide-border">
 {plans.map((plan) => (
 <li key={plan.id}>
 <button
 onClick={() => handleViewOrEditPlan(plan.id, plan.name)}
 className="flex items-center justify-between w-full py-4 text-left hover:bg-muted/50 focus:outline-none focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md px-2 -mx-2"
 aria-label={`Ver detalles del plano ${plan.name}`}
 >
 <div className="flex-grow">
 <h3 className="text-md font-semibold text-foreground">{plan.name}</h3>
 {plan.clientName && <p className="text-sm text-muted-foreground mt-0.5">{plan.clientName}</p>}
 {plan.location && <p className="text-sm text-muted-foreground">{plan.location}</p>}
 <p className="text-xs text-muted-foreground mt-1">
 Última mod.: {plan.lastModified}
 </p>
 </div>
 <ChevronRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
 </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 px-6">
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No hay planos asignados</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando se te asignen planos, aparecerán aquí.
            </p>
          </div>
        )}
 </div>
 </div>
  );
}
// 1703180815830
