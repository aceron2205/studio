
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, ListChecks, Search, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast"; // Kept for potential future use

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
  { id: 'plan-delta', name: 'Planta Procesadora Delta', lastModified: '2024-07-20', clientName: 'Industrias Alfa', location: 'Complejo Industrial Este' },
  { id: 'plan-epsilon', name: 'Edificio Administrativo Epsilon', lastModified: '2024-07-18', clientName: 'Servicios Globales Ltda.', location: 'Centro Urbano' },
];

export function AssignedPlansViewer() {
  const router = useRouter();
  const [allPlans, setAllPlans] = React.useState<AssignedPlan[]>(mockAssignedPlans);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [displayedPlans, setDisplayedPlans] = React.useState<AssignedPlan[]>(allPlans);

  React.useEffect(() => {
    if (!searchTerm) {
      setDisplayedPlans(allPlans);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allPlans.filter(plan =>
      plan.name.toLowerCase().includes(lowercasedFilter) ||
      (plan.clientName && plan.clientName.toLowerCase().includes(lowercasedFilter)) ||
      (plan.location && plan.location.toLowerCase().includes(lowercasedFilter))
    );
    setDisplayedPlans(filtered);
  }, [searchTerm, allPlans]);

  const handleViewOrEditPlan = (planId: string, planName: string) => {
    console.log(`Viendo/Editando plano: ${planId}`);
    router.push(`/audit-scan/${planId}`);
  };

  const handleFilterClick = () => {
    toast({
      title: "Funcionalidad Pendiente",
      description: "Las opciones de filtro avanzado aún no están implementadas.",
    });
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

      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, cliente, ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-base md:text-sm"
              aria-label="Buscar planos"
            />
          </div>
          <Button variant="outline" onClick={handleFilterClick} className="shrink-0">
            <ListFilter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        {allPlans.length === 0 ? (
          <div className="text-center py-10">
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No hay planos asignados</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando se te asignen planos, aparecerán aquí.
            </p>
          </div>
        ) : displayedPlans.length > 0 ? (
          <ul className="divide-y divide-border">
            {displayedPlans.map((plan) => (
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
          <div className="text-center py-10">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No se encontraron planos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Intenta ajustar tu búsqueda o filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
// 1703180815830
