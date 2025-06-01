
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Save, MapPin, Trash2, Edit3, FileCheck, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Extinguisher {
  id: string;
  type: string;
  capacity: string;
  location_description: string;
  map_coordinates?: { x: number; y: number };
}

interface PlanEditorProps {
  planId: string;
  planName: string;
}

const mockExtinguishers: Extinguisher[] = [
  { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', map_coordinates: { x: 50, y: 100 } },
  { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', map_coordinates: { x: 150, y: 200 } },
  { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', map_coordinates: { x: 250, y: 150 } },
];

export function PlanEditor({ planId, planName: initialPlanName }: PlanEditorProps) {
  const router = useRouter();
  const [currentPlanName, setCurrentPlanName] = React.useState(initialPlanName);
  const [extinguishers, setExtinguishers] = React.useState<Extinguisher[]>(() => {
    if (planId === 'new') return [];

    const singleExtinguisherAsPlan = mockExtinguishers.find(ext => ext.id === planId);
    if (singleExtinguisherAsPlan) {
      return [singleExtinguisherAsPlan];
    }
    return mockExtinguishers;
  });

  const handleAddExtinguisher = () => {
    console.log("Navegando para agregar nuevo extintor al plano:", planId);
    router.push(`/edit-extinguisher/${planId}/new`);
  };

  const handleSavePlan = () => {
    console.log("Guardando plano:", planId, "Nombre:", currentPlanName, "Extintores:", extinguishers);
    toast({
        title: "Plano Guardado",
        description: `El plano "${currentPlanName}" ha sido guardado con ${extinguishers.length} extintores.`,
    });
  };

  const handleDeleteExtinguisher = (extinguisherId: string) => {
    setExtinguishers(prev => prev.filter(ext => ext.id !== extinguisherId));
    console.log(`Extinguidor ${extinguisherId} eliminado/dado de baja del plano ${planId}`);
    toast({
        title: "Extinguidor Eliminado",
        description: `El extinguidor ha sido eliminado del plano. (Simulado)`,
        variant: "destructive",
    });
  };

  const handleAuditExtinguisher = (extinguisherId: string, extinguisherType: string) => {
    console.log(`Navegando para auditar extinguidor: ${extinguisherId} (${extinguisherType})`);
    router.push(`/audit-scan/${extinguisherId}`);
  };

  const handleEditExtinguisher = (extinguisherId: string, extinguisherType: string) => {
    console.log(`Editando extinguidor: ${extinguisherId} (${extinguisherType}) desde plan ${planId}`);
    router.push(`/edit-extinguisher/${planId}/${extinguisherId}?type=${encodeURIComponent(extinguisherType)}`);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="relative p-6 border-b">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Volver"
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            {planId === 'new' ? 'Creando Nuevo Plano' : 'Ver Plano'}
          </CardTitle>
          <Input
            value={currentPlanName}
            onChange={(e) => setCurrentPlanName(e.target.value)}
            placeholder="Nombre del Plano"
            className="mt-2 max-w-md mx-auto text-center text-lg"
            aria-label="Nombre del Plano"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-card-foreground">
            Extintores en este Plano ({extinguishers.length})
          </h3>
          <div className="flex space-x-2">
            <Button onClick={handleAddExtinguisher} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>

        {extinguishers.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {extinguishers.map((ext) => (
              <AccordionItem
                value={ext.id}
                key={ext.id}
                className="border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow overflow-hidden"
              >
                <AccordionTrigger className="p-4 hover:no-underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[state=open]:border-b">
                  <div className="flex-grow pr-2 text-left overflow-hidden">
                    <p className="font-semibold text-card-foreground truncate" title={`${ext.type} - ${ext.capacity}`}>{ext.type} - {ext.capacity}</p>
                    <p className="text-sm text-muted-foreground truncate" title={ext.location_description}>{ext.location_description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/30">
                  <div className="flex justify-end">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Acciones <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAuditExtinguisher(ext.id, ext.type)}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Auditar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditExtinguisher(ext.id, ext.type)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Dar de baja
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará el extinguidor "{ext.type}" de este plano. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteExtinguisher(ext.id)}>
                            Confirmar Baja
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aún no hay extintores agregados a este plano. Haga clic en "Agregar" para registrar uno.
          </p>
        )}

        <Separator className="my-8"/>

        <div className="text-center">
          <Button onClick={handleSavePlan} size="lg">
            <Save className="mr-2 h-5 w-5" />
            Guardar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
