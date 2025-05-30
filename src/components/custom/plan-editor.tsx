
"use client";

import * as React from "react";
import { ArrowLeft, PlusCircle, Save, MapPin, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";

interface Extinguisher {
  id: string;
  type: string; // e.g., PQS ABC, CO2, Agua
  capacity: string; // e.g., 10 lbs, 5 kg
  location_description: string; // User-defined description of where it is on the plan
  map_coordinates?: { x: number; y: number }; // Optional coordinates on a visual plan
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
  const [currentPlanName, setCurrentPlanName] = React.useState(initialPlanName);
  const [extinguishers, setExtinguishers] = React.useState<Extinguisher[]>(
    planId === 'new' ? [] : mockExtinguishers // Load mock data if not a new plan
  );

  const handleAddExtinguisher = () => {
    console.log("Agregar nuevo extintor al plano:", planId);
    // Logic to add a new extinguisher (e.g., open a modal or add a new row)
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
    // Logic to save plan details and extinguishers
    alert(`Plano "${currentPlanName}" guardado con ${extinguishers.length} extintores.`);
  };
  
  const handleDeleteExtinguisher = (extinguisherId: string) => {
    setExtinguishers(prev => prev.filter(ext => ext.id !== extinguisherId));
    console.log(`Extinguidor ${extinguisherId} eliminado`);
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="relative p-6 border-b">
        <Link href="/create-plan" passHref>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver a Crear Plan"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            {planId === 'new' ? 'Creando Nuevo Plano' : 'Editor de Plano'}
          </CardTitle>
          <Input 
            value={currentPlanName}
            onChange={(e) => setCurrentPlanName(e.target.value)}
            placeholder="Nombre del Plano"
            className="mt-2 max-w-md mx-auto text-center text-lg"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-card-foreground">
            Extintores en este Plano
          </h3>
          <Button onClick={handleAddExtinguisher} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Extinguidor
          </Button>
        </div>

        {extinguishers.length > 0 ? (
          <div className="space-y-4">
            {extinguishers.map((ext) => (
              <Card key={ext.id} className="p-4 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-card-foreground">{ext.type} - {ext.capacity}</p>
                    <p className="text-sm text-muted-foreground">{ext.location_description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteExtinguisher(ext.id)}
                    aria-label={`Eliminar extinguidor ${ext.type}`}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {/* Placeholder for map icon/interaction */}
                {/* <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="mr-2 h-3 w-3" /> Ver/Editar en Mapa
                  </Button>
                </div> */}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aún no hay extintores agregados a este plano.
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
