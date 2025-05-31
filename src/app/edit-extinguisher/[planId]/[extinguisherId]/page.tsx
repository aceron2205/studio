
"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ExtinguisherEditorForm, type ExtinguisherFormData } from "@/components/custom/extinguisher-editor-form";

// Mock data for PlanEditor's extinguishers - this should ideally come from a service
const mockPlanExtinguishers: Record<string, Array<{ id: string; type: string; capacity: string; location_description: string }>> = {
  'plan-alpha': [
    { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción' },
    { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte' },
  ],
  'plan-beta': [
    { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera' },
  ],
   'plan-gamma': [
    { id: 'ext-4', type: 'Polvo Químico Seco (ABC)', capacity: '20 lbs', location_description: 'Almacén principal' },
  ],
   'ext-1': [ { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción' } ],
   'ext-2': [ { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte' } ],
   'ext-3': [ { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera' } ],
};


interface EditExtinguisherPageProps {
  params: Promise<{ 
    planId: string;
    extinguisherId: string;
  }>;
}

export default function EditExtinguisherPage({ params: paramsPromise }: EditExtinguisherPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const { planId, extinguisherId } = use(paramsPromise); 
  const isNewExtinguisher = extinguisherId === "new";

  const [initialExtinguisherData, setInitialExtinguisherData] = React.useState<Partial<ExtinguisherFormData> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isNewExtinguisher) {
      setInitialExtinguisherData({}); // Empty data for a new extinguisher
      setLoading(false);
      return;
    }

    // Simulate API call for existing extinguisher
    setTimeout(() => {
      const planExtinguishers = mockPlanExtinguishers[planId] || mockPlanExtinguishers[extinguisherId]; 
      const extinguisher = planExtinguishers?.find(ext => ext.id === extinguisherId);

      if (extinguisher) {
        setInitialExtinguisherData({
          ubicacion: extinguisher.location_description,
          capacidadLibras: extinguisher.capacity,
          agenteExtintor: extinguisher.type,
          modelo: "Modelo Desconocido", 
        });
      } else {
        setError(`Extinguidor con ID ${extinguisherId} no encontrado en el plano ${planId}.`);
      }
      setLoading(false);
    }, 500);
  }, [planId, extinguisherId, isNewExtinguisher]);

  const handleSubmitSuccess = (data: ExtinguisherFormData) => {
    console.log(isNewExtinguisher ? "Datos del nuevo extinguidor guardados (simulado):" : "Datos del extinguidor actualizados (simulado):", data);
    router.back(); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Cargando datos del extinguidor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-destructive p-4">
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  if (!initialExtinguisherData && !isNewExtinguisher) { // Allow new extinguisher to proceed with null/empty initialData
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-destructive p-4">
        <p>No se pudieron cargar los datos del extinguidor.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver"
            onClick={() => router.back()}
            className="absolute left-4 top-4 sm:left-6 sm:top-6 md:left-8 md:top-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <ExtinguisherEditorForm
            initialData={initialExtinguisherData || {}} // Ensure initialData is at least an empty object
            onSubmitSuccess={handleSubmitSuccess}
            extinguisherId={extinguisherId}
            isNew={isNewExtinguisher}
        />
      </div>
      <Toaster />
    </div>
  );
}
