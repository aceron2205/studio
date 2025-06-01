
"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, FileCheck } from "lucide-react"; // Icon for the page
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ExtinguisherAuditForm, type ExtinguisherAuditFormData } from "@/components/custom/extinguisher-audit-form";

// Mock data for PlanEditor's extinguishers - this should ideally come from a service or context
// This is the same mock data used in edit-extinguisher and plan-editor for consistency
const mockPlanExtinguishers: Record<string, Array<{ id: string; type: string; capacity: string; location_description: string; model?: string; pressure_indicator?: string; charge_status?: string; last_revision_date?: string; }>> = {
  'plan-alpha': [
    { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)' },
    { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)' },
  ],
  'plan-beta': [
    { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)' },
  ],
  'plan-gamma': [
    { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga'},
    { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)'},
  ],
  // Fallback for direct extinguisher IDs if they are passed as planId in some contexts
  'ext-1': [{ id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)' }],
  'ext-2': [{ id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)' }],
  'ext-3': [{ id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)' }],
  'ext-4': [{ id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga'}],
  'ext-5': [{ id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)'}],
};


interface AuditExtinguisherPageProps {
  params: Promise<{
    planId: string;
    extinguisherId: string;
  }>;
}

export default function AuditExtinguisherPage({ params: paramsPromise }: AuditExtinguisherPageProps) {
  const router = useRouter();
  const { planId, extinguisherId } = use(paramsPromise);

  const [initialExtinguisherData, setInitialExtinguisherData] = React.useState<Partial<ExtinguisherAuditFormData> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate API call for existing extinguisher
    setTimeout(() => {
      // Try finding by planId first, then by extinguisherId if planId doesn't yield results (e.g. if itemId was extinguisherId)
      const planExtinguishers = mockPlanExtinguishers[planId] || mockPlanExtinguishers[extinguisherId];
      const extinguisher = planExtinguishers?.find(ext => ext.id === extinguisherId);

      if (extinguisher) {
        setInitialExtinguisherData({
          ubicacion: extinguisher.location_description,
          capacidadLibras: extinguisher.capacity,
          agenteExtintor: extinguisher.type,
          modelo: extinguisher.model || "Modelo Desconocido",
          indicadorPresion: extinguisher.pressure_indicator || "Pendiente",
          cargaExtintores: extinguisher.charge_status || "Pendiente Chequeo",
          // Default checklist items to "P" (Pendiente) if not present in mock
          instrucciones: "P",
          calcomaniasPlacas: "P",
          selloSeguridad: "P",
          pinPasador: "P",
          pinturaBuenEstado: "P",
          cilindroMangueraBoquillas: "P",
          alturaAdecuada: "P",
          accesoLibre: "P",
        });
      } else {
        setError(`Extinguidor con ID ${extinguisherId} no encontrado en el plano ${planId}.`);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Extinguidor con ID ${extinguisherId} no encontrado.`,
        });
      }
      setLoading(false);
    }, 500);
  }, [planId, extinguisherId]);

  const handleSubmitSuccess = (data: ExtinguisherAuditFormData) => {
    console.log("Datos de la auditoría del extinguidor guardados (simulado):", data);
    toast({
        title: "Auditoría Registrada",
        description: `La auditoría para el extinguidor ${extinguisherId} ha sido guardada.`,
        variant: "default"
    });
    router.back(); // Go back to the plan view or previous screen
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Cargando datos del extinguidor para auditoría...
      </div>
    );
  }

  if (error || !initialExtinguisherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-destructive p-4">
        <p>{error || "No se pudieron cargar los datos del extinguidor para la auditoría."}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6 relative flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver"
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
           <h1 className="text-xl font-semibold text-primary text-center px-12 truncate" title={`Auditar Extinguidor ${extinguisherId}`}>
             Auditar Extinguidor
          </h1>
        </div>
        <ExtinguisherAuditForm
            initialData={initialExtinguisherData}
            onSubmitSuccess={handleSubmitSuccess}
            extinguisherId={extinguisherId}
        />
      </div>
      <Toaster />
    </div>
  );
}
