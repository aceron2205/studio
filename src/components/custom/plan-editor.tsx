
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Save, MapPin, Trash2, Edit3, MoreVertical, FileCheck } from "lucide-react";
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
  const [extinguishers, setExtinguishers] = React.useState<Extinguisher[]>(
    planId === 'new' ? [] : mockExtinguishers 
  );

  const handleAddExtinguisher = () => {
    console.log("Agregar nuevo extintor al plano:", planId);
    const newExtinguisher: Extinguisher = {
      id: `ext-${Date.now()}`,
      type: 'Nuevo Extintor',
      capacity: 'N/A',
      location_description: 'Ubicación pendiente',
    };
    setExtinguishers(prev => [...prev, newExtinguisher]);
  };

  const handleSavePlan = () => {
    console.log("Guardando cambios del plano:", planId, "Nombre:", currentPlanName, "Extintores:", extinguishers);
    alert(`Plano "${currentPlanName}" guardado con ${extinguishers.length} extintores.`);
  };
  
  const handleDeleteExtinguisher = (extinguisherId: string) => {
    setExtinguishers(prev => prev.filter(ext => ext.id !== extinguisherId));
    console.log(`Extinguidor ${extinguisherId} eliminado/dado de baja`);
  };

  const handleAuditExtinguisher = (extinguisherId: string, extinguisherType: string) => {
    console.log(`Auditando extinguidor: ${extinguisherId} (${extinguisherType})`);
    // Logic for auditing an extinguisher
  };

  const handleEditExtinguisher = (extinguisherId: string, extinguisherType: string) => {
    console.log(`Editando extinguidor: ${extinguisherId} (${extinguisherType})`);
    // Logic for editing an extinguisher, e.g., open a modal or navigate
  };

  const handleGeneralEdit = () => {
    console.log("Botón Editar general presionado. Implementar lógica para editar detalles del plano, no de los extintores individuales.");
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
              Agregar Extinguidor
            </Button>
            <Button onClick={handleGeneralEdit} size="sm" variant="outline" aria-label="Editar detalles generales del plano">
              <Edit3 className="mr-2 h-4 w-4" />
              Editar Plano
            </Button>
          </div>
        </div>

        {extinguishers.length > 0 ? (
          <div className="space-y-4">
            {extinguishers.map((ext) => (
              <Card key={ext.id} className="p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-2 overflow-hidden">
                    <p className="font-semibold text-card-foreground truncate" title={`${ext.type} - ${ext.capacity}`}>{ext.type} - {ext.capacity}</p>
                    <p className="text-sm text-muted-foreground truncate" title={ext.location_description}>{ext.location_description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0 -mr-2 -mt-1 sm:mt-0"> {/* Adjust margin for better alignment */}
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Más opciones para {ext.type}</span>
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
                      <DropdownMenuItem 
                        onClick={() => handleDeleteExtinguisher(ext.id)} 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Dar de baja
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aún no hay extintores agregados a este plano. Haga clic en "Agregar Extinguidor".
          </p>
        )}
        
        <Separator className="my-8"/>

        <div className="text-center">
          <Button onClick={handleSavePlan} size="lg">
            <Save className="mr-2 h-5 w-5" />
            Guardar Cambios del Plano
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

    