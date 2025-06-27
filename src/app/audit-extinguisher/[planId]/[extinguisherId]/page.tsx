"use client";

import * as React from "react";
import { use, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

// Importaciones unificadas
import { ExtinguisherAuditForm, type ExtinguisherAuditFormData } from "@/components/custom/extinguisher-audit-form";
import { ExtinguisherInfoBlock } from "@/components/custom/ExtinguisherInfoBlock";
import { mockClients } from "@/mocks/extinguisherMocks";
import ProcessHeader from "@/components/custom/process-header"


interface AuditExtinguisherPageProps {
  params: Promise<{
    planId: string;
    extinguisherId: string;
  }>;
}

export default function AuditExtinguisherPage({ params: paramsPromise }: AuditExtinguisherPageProps) {
  const router = useRouter();
  const { planId, extinguisherId } = use(paramsPromise);
 // const { toast } = useToast(); 

  // --- Separate State for Different Components ---
  // State for the data to display in the Info Block
  const [infoBlockData, setInfoBlockData] = React.useState<any>(null); 
  // State for the initial values for the Audit Form
  const [auditFormInitialData, setAuditFormInitialData] = React.useState<Partial<ExtinguisherAuditFormData> | null>(null);

  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // ONLY ONE setTimeout HERE.
    // 'timer' references this one setTimeout.
    const timer = setTimeout(() => {
      console.log("useEffect running with planId:", planId, "and extinguisherId:", extinguisherId);
      
      const client = mockClients.find(c => c.id === planId);
      const extinguisher = client?.['extinguisher-plan']?.find(ext => ext.id === extinguisherId);

      if (extinguisher) {
        setInfoBlockData({
          id: extinguisher.id,
          cliente: extinguisher.cliente,
          edificio: extinguisher.edificio,
          ubicacion: extinguisher.ubicacion,
          agenteExtintor: extinguisher.agenteExtintor,
          capacidadLibras: extinguisher.capacidadLibras,
          modelo: extinguisher.modelo || "N/A",
          fabricacionDate: extinguisher.fabricacionDate || "N/A",
          ultimoServicioDate: extinguisher.ultimoServicioDate || "N/A",
          pruebaHidrostaticaDate: extinguisher.pruebaHidrostaticaDate || "N/A",
          pressure_indicator: extinguisher.pressure_indicator || "N/A",
          charge_status: extinguisher.charge_status || "N/A",
        });
        setAuditFormInitialData({
          ubicacionDesignado: undefined,
          visibleSinObstrucciones: undefined,
          manometroZonaVerde: undefined,
          pasadorSelloIntactos: undefined,
          danosFisicos: undefined,
          instrucciones: undefined,
          calcomaniasPlacas: undefined,
          selloSeguridad: undefined,
          pinPasador: undefined,
          pinturaBuenEstado: undefined,
          cilindroMangueraBoquillas: undefined,
          alturaAdecuada: undefined,
          accesoLibre: undefined,
          articulosReemplazados: {
            sello: false, pasador: false, etiqueta: false,
            correaManguera: false, manguera: false, manometro: false,
            soporte: false, recargaAgente: false, extintorCompleto: false,
          },
          articulosReemplazadosNotas: "",
          observacionesGenerales: "",
          photoEvidenceDataUrls: [],
        });
        setError(null);
      } else {
        setError(`Extinguidor con ID ${extinguisherId} no encontrado en el plano/cliente con ID ${planId}.`);
      }
      setLoading(false);
    }, 0); // The delay for THIS (the only) setTimeout

    // This cleanup function refers to the 'timer' declared above.
    return () => clearTimeout(timer);
  }, [planId, extinguisherId]); 

  
  const handleSubmitSuccess = (data: ExtinguisherAuditFormData) => {
    console.log("Auditoría guardada:", data);
    //toast({ title: "Auditoría Registrada" });
    router.back(); 
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  if (loading ) { return <div className="flex justify-center items-center h-screen">Cargando...</div>; }
  if (error || !infoBlockData || !auditFormInitialData) { return <div className="flex flex-col justify-center items-center h-screen"><p className="text-destructive">{error}</p><Button onClick={() => router.back()} className="mt-4">Volver</Button></div>; }



  
  return (
  <div className="flex flex-col items-center justify-start min-h-screen bg-background">
  {/* MODIFICATION START: Removed max-w-2xl from the main container */}
  <div className="w-full">
  {/* MODIFICATION START: Removed max-w-2xl from the div containing ProcessHeader */}
  <div className="mb-6 relative flex items-center justify-center w-full">
  <Button
  variant="ghost"
  size="icon"
  aria-label="Volver"
  onClick={() => router.back()}
  className="absolute left-0 top-1/2 transform -translate-y-1/2"
  >
  <ArrowLeft className="h-5 w-5" />
  </Button>
  <ProcessHeader
  title="Auditar Extinguidor" // Using the static title here
  currentStep={currentStep}
  totalSteps={totalSteps}
 />
 </div> {/* MODIFICATION END */}
 {currentStep === 1 && (
  <ExtinguisherInfoBlock
 data={infoBlockData}
 showVencePronto={infoBlockData.pruebaHidrostaticaDate === '08-2024'} />)}
        
        {/* The ExtinguisherAuditForm should always be rendered as it contains the multi-step logic */}
        <div className="mt-6">
          <ExtinguisherAuditForm
              initialData={auditFormInitialData}
              onSubmitSuccess={handleSubmitSuccess}
              extinguisherId={extinguisherId}
              onStepChange={handleStepChange}
          />
        </div>
  
</div>
<Toaster />
</div>
  );
}