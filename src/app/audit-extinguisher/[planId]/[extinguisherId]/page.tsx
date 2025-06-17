
"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, FileCheck } from "lucide-react"; // Icon for the page
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ExtinguisherAuditForm, type ExtinguisherAuditFormData } from "@/components/custom/extinguisher-audit-form";
import { ExtinguisherInfoBlock } from "@/components/custom/ExtinguisherInfoBlock";
import { useToast } from "@/hooks/use-toast";

// Mock data for PlanEditor's extinguishers - this should ideally come from a service or context
// This is the same mock data used in edit-extinguisher and plan-editor for consistency
const mockPlanExtinguishers: Record<string, Array<{ 
  id: string; 
  type: string; 
  capacity: string; 
  location_description: string; 
  model?: string; 
  pressure_indicator?: string; 
  charge_status?: string; 
  last_revision_date?: string;
  fabricacionDate?: string;
  ultimoServicioDate?: string;
  pruebaHidrostaticaDate?: string;
}>> = {
  'plan-alpha': [
    { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', fabricacionDate: '01-2020', ultimoServicioDate: '01-2024', pruebaHidrostaticaDate: '01-2025' },
    { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', fabricacionDate: '05-2019', ultimoServicioDate: '11-2023', pruebaHidrostaticaDate: '11-2028' },
  ],
  'plan-beta': [
    { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', fabricacionDate: '02-2021', ultimoServicioDate: '03-2024', pruebaHidrostaticaDate: '03-2026' },
  ],
  'plan-gamma': [
    { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', fabricacionDate: '07-2018', ultimoServicioDate: '08-2023', pruebaHidrostaticaDate: '08-2024' }, // Example: Vence pronto this year
    { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', fabricacionDate: '03-2022', ultimoServicioDate: '05-2024', pruebaHidrostaticaDate: '05-2027'},
  ],
  // Fallback for direct extinguisher IDs if they are passed as planId in some contexts
  'ext-1': [{ id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', fabricacionDate: '01-2020', ultimoServicioDate: '01-2024', pruebaHidrostaticaDate: '01-2025' }],
  'ext-2': [{ id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', fabricacionDate: '05-2019', ultimoServicioDate: '11-2023', pruebaHidrostaticaDate: '11-2028' }],
  'ext-3': [{ id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', fabricacionDate: '02-2021', ultimoServicioDate: '03-2024', pruebaHidrostaticaDate: '03-2026' }],
  'ext-4': [{ id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', fabricacionDate: '07-2018', ultimoServicioDate: '08-2023', pruebaHidrostaticaDate: '08-2024'}], // Example: Vence pronto this year
  'ext-5': [{ id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', fabricacionDate: '03-2022', ultimoServicioDate: '05-2024', pruebaHidrostaticaDate: '05-2027'}],
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
  const { toast } = useToast(); 

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
          agenteExtintor: extinguisher.type, // This will be used to prefill 'agenteExtintor' in the form
          modelo: extinguisher.model || "Modelo Desconocido",
          fabricacionDate: extinguisher.fabricacionDate || "",
          ultimoServicioDate: extinguisher.ultimoServicioDate || "",
          pruebaHidrostaticaDate: extinguisher.pruebaHidrostaticaDate || "",
          // Audit specific fields (already in schema)
          cargaExtintores: extinguisher.charge_status || "",
          // Default checklist items to "P" (Pendiente) if not present in mock for audit specific questions
          // Radio button questions from step 1:
          ubicacionDesignado: undefined, // Default values for audit questions
          visibleSinObstrucciones: undefined,
          manometroZonaVerde: undefined,
          pasadorSelloIntactos: undefined,
          danosFisicos: undefined,
          // Select checklist items from step 2:
          instrucciones: undefined,
          calcomaniasPlacas: undefined,
          selloSeguridad: undefined,
          pinPasador: undefined,
          pinturaBuenEstado: undefined,
          cilindroMangueraBoquillas: undefined,
          alturaAdecuada: undefined,
          accesoLibre: undefined,
          photoEvidenceDataUrls: [], 
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
  }, [planId, extinguisherId, toast]);

  const handleSubmitSuccess = (data: ExtinguisherAuditFormData) => {
    console.log("Datos de la auditoría del extinguidor guardados (simulado):", data);
    toast({
        title: "Auditoría Registrada",
        description: `La auditoría para el extinguidor ${extinguisherId} ha sido guardada.`,
        variant: "default"
    });
    router.back(); 
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
        {/* Render the ExtinguisherInfoBlock component */}
        <ExtinguisherInfoBlock
          extinguisherId={extinguisherId}
          data={{
            ubicacion: initialExtinguisherData.ubicacion,
            agenteExtintor: initialExtinguisherData.agenteExtintor,
            capacidadLibras: initialExtinguisherData.capacidadLibras,
            modelo: initialExtinguisherData.modelo,
          }}
          showVencePronto={initialExtinguisherData.pruebaHidrostaticaDate === '08-2024'}
        />
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
