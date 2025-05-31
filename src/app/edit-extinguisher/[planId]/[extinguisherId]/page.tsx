
"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
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
  params: Promise<{ // params is treated as a Promise
    planId: string;
    extinguisherId: string;
  }>;
}

export default function EditExtinguisherPage({ params: paramsPromise }: EditExtinguisherPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // For potential future use or if type was passed

  const { planId, extinguisherId } = use(paramsPromise); // Unwrap the promise

  // Simulate fetching extinguisher data
  // In a real app, you'd fetch this from a DB using planId and extinguisherId
  const [initialExtinguisherData, setInitialExtinguisherData] = React.useState<Partial<ExtinguisherFormData> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const planExtinguishers = mockPlanExtinguishers[planId] || mockPlanExtinguishers[extinguisherId]; // Fallback for simple mock
      const extinguisher = planExtinguishers?.find(ext => ext.id === extinguisherId);

      if (extinguisher) {
        // Map PlanEditor's simple Extinguisher type to ExtinguisherFormData
        setInitialExtinguisherData({
          ubicacion: extinguisher.location_description,
          capacidadLibras: extinguisher.capacity,
          // 'type' from PlanEditor's mock is a general description. We'll put it in agenteExtintor for now.
          // 'modelo' would need to be fetched or was part of more detailed original data.
          agenteExtintor: extinguisher.type,
          modelo: "Modelo Desconocido", // Placeholder
          // Other fields will be empty or default as per ExtinguisherEditorForm's schema
        });
      } else {
        setError(`Extinguidor con ID ${extinguisherId} no encontrado en el plano ${planId}.`);
      }
      setLoading(false);
    }, 500);
  }, [planId, extinguisherId]);

  const handleSubmitSuccess = (data: ExtinguisherFormData) => {
    // Here you would typically send the updated data to your backend
    console.log("Datos del extinguidor guardados (simulado):", data);
    // Optionally navigate back or show further success messages
    router.back(); // Navigate back after successful submission
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

  if (!initialExtinguisherData) {
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
            initialData={initialExtinguisherData}
            onSubmitSuccess={handleSubmitSuccess}
            extinguisherId={extinguisherId}
        />
      </div>
      <Toaster />
    </div>
  );
}
