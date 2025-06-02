
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
    router.push(`/edit-plan/${planId}?name=${encodeURIComponent(planName)}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
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
        <div className="pl-10 text-left"> {/* Adjusted padding to make space for back button */}
          <CardTitle className="text-2xl font-bold text-foreground">
            Planos Asignados
          </CardTitle>
          {/* CardDescription removed to match new UI */}
        </div>
      </CardHeader>

      <CardContent className="p-0"> {/* Removed padding from CardContent for full-width list items */}
        {plans.length > 0 ? (
          <ul className="divide-y divide-border">
            {plans.map((plan, index) => (
              <li key={plan.id}>
                <button
                  onClick={() => handleViewOrEditPlan(plan.id, plan.name)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-muted/50 focus:outline-none focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  aria-label={`Ver detalles del plano ${plan.name}`}
                >
                  <div className="flex-grow">
                    <h3 className="text-md font-semibold text-card-foreground">{plan.name}</h3>
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
      </CardContent>
    </Card>
  );
}
