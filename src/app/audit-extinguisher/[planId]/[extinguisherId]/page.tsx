"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

// Importaciones unificadas
import { ExtinguisherAuditForm, type ExtinguisherAuditFormData } from "@/components/custom/extinguisher-audit-form";
import { ExtinguisherInfoBlock } from "@/components/custom/ExtinguisherInfoBlock";
import { mockPlanExtinguishers } from "@/mocks/extinguisherMocks";
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
    setTimeout(() => {
      console.log("useEffect running with planId:", planId, "and extinguisherId:", extinguisherId);
      console.log("mockPlanExtinguishers:", mockPlanExtinguishers);
      // Ensure mock data exists for the given planId
      const planExtinguishers = mockPlanExtinguishers[planId] || [];

      // Add a mock extinguisher with id 'ext-4' to the 'current-day-5' plan's mock data
      // This is a temporary fix based on the user's error scenario.
      if (planId === 'current-day-5' && !planExtinguishers.find(ext => ext.id === 'ext-4')) {
        planExtinguishers.push({
          id: 'ext-4',
          cliente: 'Cliente del Día 5',
          edificio: 'Edificio Principal',
          ubicacion: 'Almacén Gamma - Punto Central', // Example location
          agenteExtintor: 'Polvo Químico Seco (PQS)', capacidadLibras: '20 lbs', modelo: 'Amerex B500', fabricacionDate: '01-2020', ultimoServicioDate: '08-2023', pruebaHidrostaticaDate: '08-2028', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga'
        });
      }
      const extinguisher = planExtinguishers?.find(ext => ext.id === extinguisherId);
      console.log("Found extinguisher:", extinguisher);

      if (extinguisher) {
        // Set data for the Info Block
        setInfoBlockData({
          id: extinguisher.id,
          cliente: extinguisher.cliente,
          edificio: extinguisher.edificio,
          // Mapeo correcto de los nombres de tu mock data
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
        // Set initial data for the Audit Form
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
 sello: false,
 pasador: false,
 etiqueta: false,
 correaManguera: false,
 manguera: false,
 manometro: false,
 soporte: false,
 recargaAgente: false,
 extintorCompleto: false,
          },
          articulosReemplazadosNotas: "",
          observacionesGenerales: "",
          photoEvidenceDataUrls: [],
        });
      } else {
        setError(`Extinguidor con ID ${extinguisherId} no encontrado en el plano ${planId}.`);
        // La llamada a toast ha sido comentada como solicitaste
        /* toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo encontrar el extinguidor.",
        }); */
      }
      setLoading(false);
    }, 500);
  }, [planId, extinguisherId]);

  
  const handleSubmitSuccess = (data: ExtinguisherAuditFormData) => {
    console.log("Auditoría guardada:", data);
    //toast({ title: "Auditoría Registrada" });
    router.back(); 
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };


  if (loading || !infoBlockData || !auditFormInitialData) { return <div className="flex justify-center items-center h-screen">Cargando...</div>; }
  if (error || !infoBlockData) { return <div className="flex flex-col justify-center items-center h-screen"><p className="text-destructive">{error}</p><Button onClick={() => router.back()} className="mt-4">Volver</Button></div>; }

  return (
  <div className="flex flex-col items-center justify-start min-h-screen bg-background px-4">
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