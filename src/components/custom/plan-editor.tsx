
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Save, Eye, Building, Tag, Thermometer, BatteryCharging, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ExtinguisherActionsDropdown } from "./extinguisher-actions-dropdown";
import { ScannerInterface } from "./scanner-interface"; // Import ScannerInterface

interface Extinguisher {
  id: string;
  type: string;
  capacity: string;
  location_description: string;
  model?: string;
  pressure_indicator?: string;
  charge_status?: string;
  last_revision_date?: string; // Simulate as string for display
  map_coordinates?: { x: number; y: number };
}

interface PlanEditorProps {
  planId: string;
  planName: string;
}

// Updated mock data with more details
const componentMockExtinguishers: Extinguisher[] = [
  { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', last_revision_date: '2024-01-15', map_coordinates: { x: 50, y: 100 } },
  { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', last_revision_date: '2023-11-20', map_coordinates: { x: 150, y: 200 } },
  { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', last_revision_date: '2024-03-10', map_coordinates: { x: 250, y: 150 } },
  { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', last_revision_date: '2023-08-01', map_coordinates: { x: 300, y: 50 } },
  { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', last_revision_date: '2024-05-05', map_coordinates: { x: 350, y: 100 } },
];

// Mock data for scannable extinguishers to be added
const mockKnownScannableExtinguishers: Record<string, Partial<Extinguisher>> = {
  'NEW-SCAN-001': {
    type: 'PQS Especial Scan',
    capacity: '12 kg',
    location_description: 'Nueva Ubicación (escaneada)',
    model: 'ScanModel-Y2K',
    pressure_indicator: 'En Rojo',
    charge_status: 'Requiere Revisión',
    last_revision_date: '2023-01-01',
  },
  'NEW-SCAN-002': {
    type: 'CO2 Scan',
    capacity: '10 kg',
    location_description: 'Área de Pruebas (escaneada)',
    model: 'ScanCO2-Pro',
    pressure_indicator: 'N/A',
    charge_status: 'Cargado (Reciente)',
    last_revision_date: new Date().toISOString().split('T')[0],
  },
};


export function PlanEditor({ planId, planName: initialPlanName }: PlanEditorProps) {
  const router = useRouter();
  const [currentPlanName, setCurrentPlanName] = React.useState(initialPlanName);

  const [extinguishers, setExtinguishers] = React.useState<Extinguisher[]>(() => {
    if (planId === 'new') {
      return [];
    }
    // Check if planId directly matches an extinguisher ID (for viewing a single extinguisher as if it's a "plan")
    const singleExtinguisherAsPlan = componentMockExtinguishers.find(ext => ext.id === planId);
    if (singleExtinguisherAsPlan) {
      return [singleExtinguisherAsPlan];
    }

    // Fallback to known plan IDs
    if (planId === 'plan-alpha') return componentMockExtinguishers.filter(ext => ['ext-1', 'ext-2'].includes(ext.id));
    if (planId === 'plan-beta') return componentMockExtinguishers.filter(ext => ['ext-3'].includes(ext.id));
    if (planId === 'plan-gamma') return componentMockExtinguishers.filter(ext => ['ext-4', 'ext-5'].includes(ext.id));
    
    // These seem like audit IDs being treated as plan IDs
    if (planId === 'current-day-5') return componentMockExtinguishers.filter(ext => ['ext-1', 'ext-2'].includes(ext.id));
    if (planId === 'current-day-15') return componentMockExtinguishers.filter(ext => ['ext-3'].includes(ext.id));
    if (planId === 'current-today') return componentMockExtinguishers.filter(ext => ['ext-4', 'ext-5',].includes(ext.id));
    if (planId === 'sep-audit-1') return componentMockExtinguishers.filter(ext => ['ext-1'].includes(ext.id));

    console.warn(`PlanEditor: Mock data for planId "${planId}" not explicitly defined or matched. Displaying a default set or empty.`);
    return [];
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

  const handleAuditExtinguisher = (extinguisherId: string) => {
    console.log(`Navegando para auditar extinguidor: ${extinguisherId} desde plano ${planId}`);
    router.push(`/audit-extinguisher/${planId}/${extinguisherId}`);
  };

  const handleEditExtinguisher = (extinguisherId: string) => {
    console.log(`Editando extinguidor: ${extinguisherId} desde plan ${planId}`);
    router.push(`/edit-extinguisher/${planId}/${extinguisherId}`);
  };

  const handleCodeScannedToAdd = (code: string) => {
    const newExtId = `ext-scan-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const knownData = mockKnownScannableExtinguishers[code.toUpperCase()] || mockKnownScannableExtinguishers[code];
  
    let newExtinguisher: Extinguisher;
  
    if (knownData) {
      newExtinguisher = {
        id: newExtId,
        type: knownData.type || 'Tipo Desconocido',
        capacity: knownData.capacity || 'N/A',
        location_description: knownData.location_description || 'Ubicación Pendiente',
        model: knownData.model,
        pressure_indicator: knownData.pressure_indicator,
        charge_status: knownData.charge_status,
        last_revision_date: knownData.last_revision_date,
        map_coordinates: { x: Math.floor(Math.random() * 300) + 50, y: Math.floor(Math.random() * 150) + 50 } 
      };
      toast({
        title: "Extinguidor Añadido desde Escaneo",
        description: `Se añadió ${newExtinguisher.type} (${code}) al plano.`,
      });
    } else {
      newExtinguisher = {
        id: newExtId,
        type: `Nuevo (Código: ${code})`,
        capacity: 'Por definir',
        location_description: 'Pendiente de definir ubicación',
        map_coordinates: { x: Math.floor(Math.random() * 300) + 50, y: Math.floor(Math.random() * 150) + 50 }
      };
      toast({
        title: "Extinguidor Nuevo Añadido",
        description: `Se añadió un extinguidor para el código ${code}. Complete sus detalles.`,
        variant: "default" 
      });
    }
    setExtinguishers(prev => [...prev, newExtinguisher]);
  };

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    value ? (
      <div className="flex items-start text-sm">
        <Icon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
        <span className="font-medium text-muted-foreground">{label}:&nbsp;</span>
        <span className="text-foreground break-words">{value}</span>
      </div>
    ) : null
  );

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
            <Eye className="h-6 w-6" />
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
        <Card className="mb-6 p-4 shadow-sm">
          <CardHeader className="p-2 pb-3">
            <CardTitle className="text-lg text-primary">Escanear Extintor</CardTitle>
            <CardDescription className="text-sm">
              Use el escaner o ingrese el codigo aqui para buscar el extintor.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <ScannerInterface
              onCodeScanned={handleCodeScannedToAdd}
              showCamera={true} 
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-card-foreground">
            Extintores en este Plano ({extinguishers.length})
          </h3>
          <div className="flex space-x-2">
            <Button onClick={handleAddExtinguisher} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Manualmente
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
                <AccordionTrigger className="p-4 hover:no-underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[state=open]:border-b w-full">
                  <div className="flex-grow pr-2 text-left overflow-hidden">
                    <p className="font-semibold text-card-foreground truncate" title={`${ext.type} - ${ext.capacity}`}>{ext.type} - {ext.capacity}</p>
                    <p className="text-sm text-muted-foreground truncate" title={ext.location_description}>{ext.location_description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/30">
                  <div className="space-y-3 mb-4">
                    <DetailItem icon={Tag} label="ID Extinguidor" value={ext.id} />
                    <DetailItem icon={Building} label="Ubicación Detallada" value={ext.location_description} />
                    <DetailItem icon={Tag} label="Tipo Agente" value={ext.type} />
                    <DetailItem icon={Tag} label="Capacidad" value={ext.capacity} />
                    <DetailItem icon={Tag} label="Modelo" value={ext.model} />
                    <DetailItem icon={Thermometer} label="Indicador Presión" value={ext.pressure_indicator} />
                    <DetailItem icon={BatteryCharging} label="Estado Carga" value={ext.charge_status} />
                    <DetailItem icon={Calendar} label="Última Revisión" value={ext.last_revision_date} />
                  </div>
                  <div className="flex justify-end">
                    <ExtinguisherActionsDropdown
                      extinguisherId={ext.id}
                      extinguisherType={`${ext.type} (${ext.capacity})`}
                      onAudit={handleAuditExtinguisher}
                      onEdit={handleEditExtinguisher}
                      onDelete={handleDeleteExtinguisher}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aún no hay extintores agregados a este plano. Haga clic en "Agregar Manualmente" o use el escáner de arriba para registrar uno.
          </p>
        )}

        <Separator className="my-8"/>

        <div className="text-center">
          <Button onClick={handleSavePlan} size="lg">
            <Save className="mr-2 h-5 w-5" />
            Guardar Cambios al Plano
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

