// src/app/audit-review-sign/page.tsx
"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, ArrowLeft } from "lucide-react";


import { Client } from '@/mocks/extinguisherMocks';
import ReviewTableSign from '@/components/custom/review-table';
import { useAudit } from '@/context/audit-context';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import ProcessHeader from "@/components/custom/process-header"
import dynamic from 'next/dynamic'

// Dynamic import for SignaturePad to ensure it's client-side only
const SignaturePad = dynamic(
  () => import('@/components/custom/signature-pad').then((mod) => mod.default), // Correctly imports default export
  {
    ssr: false,
    loading: () => {
      console.log("AuditReviewAndSign: SignaturePad is loading dynamically...");
      return <p>Cargando pad de firma...</p>;
    },
    }
);

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Interface for AuditResult
export interface AuditResult {
  extinguisherId: string;
  agent: string;
  capacity: string;
  location: string;
  auditStatus: string;
  auditDate: string;
}

const title = "Resultados de Auditoria"

export default function AuditReviewAndSign() {
  const router = useRouter();
  const {
    client,
    buildingName,
    auditedExtinguishers,
    clientSignature,
    setClientSignature,
    clearAuditState
  } = useAudit();

  // Initialize signature pad visibility state
  // It starts hidden, controlled by button clicks.
  const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false);

  // Initialize selected date state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Effect for initial data validation and redirection
  useEffect(() => {
    // If essential data for the review page is missing, redirect the user
    if (!client || !buildingName || !auditedExtinguishers) {
      router.replace('/scheduled-audits');
      return; // Exit early to prevent further rendering errors
    }
  }, [client, buildingName, auditedExtinguishers, router]); // Dependencies for this effect


  // Memoized audit results for performance
  const mappedAuditResults: AuditResult[] = useMemo(() => {
    // Return empty array if essential data is missing (handled by useEffect redirect as well)
    if (!client || !buildingName || !auditedExtinguishers) return [];

    return auditedExtinguishers.map(ext => ({
      extinguisherId: ext.id,
      agent: ext.agenteExtintor || 'N/A',
      capacity: ext.capacidadLibras || 'N/A',
      location: ext.ubicacion || 'N/A',
      auditStatus: 'Auditado', // Assuming all audited extinguishers on this page are 'Auditado'
      auditDate: new Date().toLocaleDateString(), // This date reflects current date when processed
    }));
  }, [auditedExtinguishers, client, buildingName]);

  // Handler for confirming the audit and generating PDF
  const handleConfirm = async () => {
    if (!clientSignature) {
      toast({
        title: "Firma Requerida",
        description: "Por favor, proporcione una firma antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    toast({
        title: "Generando PDF...",
        description: "Por favor, espere. El reporte está siendo creado.",
        variant: "default",
        duration: 9000, // Keep toast longer for generation time
    });

    try {
        // Prepare audit data to send to the API route for PDF generation
        const auditDataToSend = {
            client: client, // Client object from context
            buildingName: buildingName, // Building name from context
            auditedExtinguishers: auditedExtinguishers, // Audited extinguishers array from context
            clientSignature: clientSignature, // Signature DataURL from context
            selectedDate: selectedDate?.toISOString(), // Selected date from Calendar
        };
        console.log("AuditReviewAndSign: Data being sent to API:", JSON.stringify(auditDataToSend, null, 2));


        // Make POST request to the server-side API route
        const response = await fetch('/api/generate-audit-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auditDataToSend),
        });

        // Handle response based on status and content type
        const contentType = response.headers.get('content-type');

        if (response.ok) {
            // SUCCESS: Expecting PDF blob if status is OK
            if (contentType && contentType.includes('application/pdf')) {
                const pdfBlob = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank'); // Opens in new tab for user to view/download

                // toast({
                //   title: "PDF Generado",
                //   description: "El reporte de auditoría ha sido generado exitosamente.",
                //   variant: "success",
                // });
            } else {
                // Unexpected successful response type (e.g., 200 OK but not PDF)
                const text = await response.text();
                console.error("API Route: Unexpected successful response type, expected PDF:", text);
                throw new Error("Respuesta inesperada del servidor al generar PDF.");
            }
        } else {
            // ERROR: Response is not OK (e.g., 400, 500)
            let errorMessage = "Error desconocido al generar PDF.";
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } else if (contentType && contentType.includes('text/html')) {
                // If it's an HTML error page (common for server crashes outside explicit API route handling)
                const htmlError = await response.text();
                console.error("API Route: Received HTML error page:", htmlError.substring(0, 500) + "..."); // Log first 500 chars
                errorMessage = "El servidor devolvió una página de error HTML inesperada. Contacte soporte.";
            } else {
                // Other non-JSON, non-HTML errors
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // After successful PDF generation and potential saving, clear state and navigate
        clearAuditState();
        router.push('/scheduled-audits');

    } catch (error: any) {
        console.error('Error in PDF generation:', error);
        toast({
          title: "Error al Generar PDF",
          description: error.message || "Hubo un problema al crear el reporte.",
          variant: "destructive",
        });
    }
  };

  // Handler for cancelling the audit review
  const handleCancel = () => {
    clearAuditState();
    router.push('/scheduled-audits');
  };

  // Handler for viewing extinguisher details (currently logs to console)
  const handleViewDetails = (extinguisherId: string) => {
    console.log(`Detalles del extintor ${extinguisherId}`);
  };

  // Handler for saving audit data (simulated, would send to backend)
  const handleSaveAudit = (signatureDataUrl?: string) => {
    // If signatureDataUrl is provided (from the SignaturePad's Guardar button), update context
    if (signatureDataUrl && signatureDataUrl !== clientSignature) {
        setClientSignature(signatureDataUrl);
        console.log("AuditReviewAndSign: clientSignature updated from Guardar button.");
    }
    toast({
      title: "Guardado",
      description: "Auditoría guardada exitosamente. (Simulado)",
      variant: "default",
    });
    console.log('Auditoría guardada exitosamente.');
  };

  // Helper to get audit status (always 'Auditado' for this page)
  const getAuditStatus = (extinguisherId: string) => {
    return 'Auditado';
  };

  // Helper to get audit date (always current date for this page)
  const getAuditDate = (extinguisherId: string) => {
    return new Date().toLocaleDateString();
  };

  // Handler to show the signature pad (triggered by "Firmar" button)
  const handleShowSignaturePad = () => {
    console.log("AuditReviewAndSign: 'Firmar' button clicked. Setting isSignaturePadVisible to true.");
    setIsSignaturePadVisible(true);
  };

  // Handler to hide the signature pad (triggered by "Finalizar Firma" button)
  const handleFinalizeSignature = () => {
    console.log("AuditReviewAndSign: 'Finalizar Firma' button clicked.");
    if (!clientSignature) { // Ensure a signature exists before finalizing
        toast({
            title: "Firma Requerida",
            description: "Por favor, proporcione una firma antes de finalizar.",
            variant: "destructive",
        });
        return;
    }
    setIsSignaturePadVisible(false); // Hide the signature pad
    // toast({
    //     title: "Firma Capturada",
    //     description: "La firma ha sido capturada y finalizada.",
    //     variant: "success",
    // });
  };

  // Handler to show the signature pad again for editing (triggered by "Editar Firma" button)
  const handleEditSignature = () => {
    console.log("AuditReviewAndSign: 'Editar Firma' button clicked. Setting isSignaturePadVisible to true.");
    setIsSignaturePadVisible(true);
    // toast({
    //   title: "Editando Firma",
    //   description: "Pad de firma visible para edición.",
    //   variant: "info",
    // });
  };

  // If essential data is missing, redirect the user
  if (!client || !buildingName || !auditedExtinguishers) {
    return null; // Return null to prevent rendering errors while redirecting
  }

  return (
    <>
      {/* Process Header */}
      <ProcessHeader title={title} goBack={() => router.back()} />

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">

        {/* Client and Building Information */}
        <div className="mb-6 border-b pb-4">
          <p className="text-gray-700"><strong>Cliente:</strong> {client?.name}</p> {/* Use optional chaining */}
          <p className="text-gray-700"><strong>Dirección:</strong> {client?.direccion}</p> {/* Use optional chaining */}
          <p className="text-700"><strong>Edificio:</strong> {buildingName}</p>
        </div>

        {/* Audited Extinguishers Table */}
        <h3 className="text-xl font-semibold mb-3 text-card-foreground">Extintores auditados ({mappedAuditResults.length})</h3>
        <ReviewTableSign
          auditResults={mappedAuditResults}
          handleViewDetails={handleViewDetails}
          handleSaveAudit={handleSaveAudit}
          getAuditStatus={getAuditStatus}
          getAuditDate={getAuditDate}
        />

        {/* Section for Client Name Input and Date Picker */}
        <div className="mb-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Nombre del Cliente</h3>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Fecha</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Seleccionar Fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Signature Pad Section - Conditional Rendering */}
        <div className="mb-6 mt-8">
          <h3 className="text-lg font-medium mb-2 text-card-foreground">Firma del cliente</h3>

          {isSignaturePadVisible ? (
            // Render SignaturePad when visible
            <div className="space-y-4">
              <SignaturePad
                onSignatureEnd={(dataUrl: string) => setClientSignature(dataUrl)}
                onClear={() => setClientSignature(null)}
                initialSignature={clientSignature || undefined}
                onSaveClick={handleSaveAudit}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleFinalizeSignature} disabled={!clientSignature} className="ml-2">
                  Finalizar Firma
                </Button>
              </div>
            </div>
          ) : (
            // Show preview or "Firmar" button when pad is hidden
            <div className="border border-gray-300 rounded-md bg-white p-4 flex flex-col items-center justify-center min-h-[150px]">
              {clientSignature ? (
                <>
                  <img src={clientSignature} alt="Firma del Cliente" className="max-w-full h-auto" style={{ maxHeight: '150px' }} />
                  <Button onClick={handleEditSignature} variant="outline" size="sm" className="mt-4">
                    Editar Firma
                  </Button>
                </>
              ) : (
                // If no signature captured yet, and pad is hidden, show "Firmar" button
                <div className="text-muted-foreground py-8 text-center">
                    <p className="mb-4">No hay firma capturada.</p>
                    <Button onClick={handleShowSignaturePad} variant="default">
                        Firmar
                    </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation and Cancellation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="px-4 py-2"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            className="px-4 py-2"
            onClick={handleConfirm}
          >
            Confirmar y generar PDF
          </Button>
        </div>
      </div>
    </>
  );
}