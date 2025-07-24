// src/app/audit-review-sign/page.tsx
"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";


import { Client } from '@/mocks/extinguisherMocks';
import ReviewTableSign from '@/components/custom/review-table';
import { useAudit } from '@/context/audit-context';
// Removed 'toast' import as per previous decision if you removed the toast system
// If you still have a toast system, re-add `import { toast } from "@/hooks/use-toast";`
// and ensure its variant types are correct ("default" or "destructive")
// import { toast } from "@/hooks/use-toast"; // Uncomment if you still use toasts

import { Button } from "@/components/ui/button"
import ProcessHeader from "@/components/custom/process-header"
import dynamic from 'next/dynamic' // Keep dynamic for SignaturePad


// Dynamic import for SignaturePad (remains the same)
const SignaturePad = dynamic(
  () => import('@/components/custom/signature-pad').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Cargando pad de firma...</p>,
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

  // State to hold the html2pdf function once it's loaded on the client
  const [html2pdfLoaded, setHtml2pdfLoaded] = useState<any | null>(null); // State to hold the loaded html2pdf function

  // Effect to dynamically import html2pdf.js only on the client side after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html2pdf.js')
        .then(mod => {
          // Fix: Store the actual function, not the module. Wrap in an arrow function.
          setHtml2pdfLoaded(() => mod.default || mod); // <--- FIX IS HERE
          console.log("html2pdf.js loaded successfully on client.");
        })
        .catch(error => {
          console.error("Failed to load html2pdf.js on client:", error);
          // You might want to show a toast or error message here
          // toast({ title: "Error", description: "Fallo la carga del generador de PDF.", variant: "destructive" });
        });
    }
  }, []); // Empty dependency array ensures this runs once on client mount


  // Initialize signature pad visibility state
  const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false);

  // Initialize selected date state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // State to hold the client name from the input field
  const [clientNameInput, setClientNameInput] = useState<string>(client?.name || '');


  // Effect for initial data validation and redirection
  useEffect(() => {
    if (!client || !buildingName || !auditedExtinguishers) {
      router.replace('/scheduled-audits');
      return;
    }
  }, [client, buildingName, auditedExtinguishers, router]);


  // Memoized audit results for performance
  const mappedAuditResults: AuditResult[] = useMemo(() => {
    if (!client || !buildingName || !auditedExtinguishers) return [];

    return auditedExtinguishers.map(ext => ({
      extinguisherId: ext.id,
      agent: ext.agenteExtintor || 'N/A',
      capacity: ext.capacidadLibras || 'N/A',
      location: ext.ubicacion || 'N/A',
      auditStatus: 'Auditado',
      auditDate: new Date().toLocaleDateString(),
    }));
  }, [auditedExtinguishers, client, buildingName]);

  // Handler for confirming the audit and generating PDF (NOW CLIENT-SIDE)
  const handleConfirm = async () => {
    if (!clientSignature) {
      // toast({ ... }); // Re-add if you have toast system
      console.log("Firma Requerida: Por favor, proporcione una firma antes de continuar.");
      return;
    }

    // Check if html2pdf is loaded via the state
    if (!html2pdfLoaded) {
      // toast({ ... }); // Re-add if you have toast system
      console.log("Error de Carga: El generador de PDF aún no está listo. Intente de nuevo.");
      return;
    }

    // toast({ ... }); // Re-add if you have toast system
    console.log("Generando PDF... Por favor, espere. El reporte está siendo creado en su navegador.");


    try {
      const element = document.getElementById('report-content');
      if (!element) {
        throw new Error("Contenido del reporte no encontrado para generar PDF.");
      }

      const options = {
        margin: [10, 10, 10, 10], // top, left, bottom, right in mm
        filename: `Reporte_Auditoria_${client?.name || 'cliente'}_${format(selectedDate || new Date(), 'yyyyMMdd')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Use the loaded html2pdf function from state
      // It's already stored as a function, so call it directly.
      await html2pdfLoaded().set(options).from(element).save(); // <--- FIX IS HERE

      // Optional: If you need to send the PDF to Supabase Storage, you'd output it as a Blob
      // const pdfBlob = await html2pdfLoaded().set(options).from(element).outputPdf('blob');
      // console.log('PDF generated as blob (can be uploaded to Supabase Storage):', pdfBlob);
      // const { data, error } = await supabase.storage.from('audit-pdfs').upload(`report_${Date.now()}.pdf`, pdfBlob, { contentType: 'application/pdf' });
      // if (error) console.error('Supabase upload error:', error);


      // toast({ ... }); // Re-add if you have toast system
      console.log("PDF Generado: El reporte de auditoría ha sido generado exitosamente y descargado.");

      clearAuditState();
      router.push('/scheduled-audits');

    } catch (error: any) {
      console.error('Error in PDF generation (client-side):', error);
      // toast({ ... }); // Re-add if you have toast system
      console.log("Error al Generar PDF: Hubo un problema al crear el reporte en el navegador.");
    }
  };

  // Handler for cancelling the audit review
  const handleCancel = () => {
    clearAuditState();
    router.push('/scheduled-audits');
  };

  // Handler for viewing extinguisher details
  const handleViewDetails = (extinguisherId: string) => {
    console.log(`Detalles del extintor ${extinguisherId}`);
  };

  // Handler for saving audit data (simulated)
  const handleSaveAudit = (signatureDataUrl?: string) => {
    if (signatureDataUrl && signatureDataUrl !== clientSignature) {
      setClientSignature(signatureDataUrl);
      console.log("AuditReviewAndSign: clientSignature updated from Guardar button.");
    }
    // toast({ ... }); // Re-add if you have toast system
    console.log('Auditoría guardada exitosamente.');
    // Here you would also send all audit data to your Supabase backend
  };

  // Helper to get audit status
  const getAuditStatus = (extinguisherId: string) => {
    return 'Auditado';
  };

  // Helper to get audit date
  const getAuditDate = (extinguisherId: string) => {
    return new Date().toLocaleDateString();
  };

  // Handler to show the signature pad
  const handleShowSignaturePad = () => {
    console.log("AuditReviewAndSign: 'Firmar' button clicked. Setting isSignaturePadVisible to true.");
    setIsSignaturePadVisible(true);
  };

  // Handler to hide the signature pad
  const handleFinalizeSignature = () => {
    console.log("AuditReviewAndSign: 'Finalizar Firma' button clicked.");
    if (!clientSignature) {
      // toast({ ... }); // Re-add if you have toast system
      console.log("Firma Requerida: Por favor, proporcione una firma antes de finalizar.");
      return;
    }
    setIsSignaturePadVisible(false);
  };

  // Handler to show the signature pad again for editing
  const handleEditSignature = () => {
    console.log("AuditReviewAndSign: 'Editar Firma' button clicked. Setting isSignaturePadVisible to true.");
    setIsSignaturePadVisible(true);
  };

  // If essential data is missing, redirect the user
  if (!client || !buildingName || !auditedExtinguishers) {
    return null;
  }

  return (
    <>
      {/* Process Header */}
      <ProcessHeader title={title} goBack={() => router.back()} />

      {/* Main Content Container - WRAPPED FOR PDF GENERATION */}
      <div id="report-content" className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">

        {/* Client and Building Information */}
        <div className="mb-6 border-b pb-4">
          <p className="text-gray-700"><strong>Cliente:</strong> {client?.name}</p>
          <p className="text-gray-700"><strong>Dirección:</strong> {client?.direccion}</p>
          <p className="text-700"><strong>Edificio:</strong> {buildingName}</p>
        </div>

        {/* Audited Extinguishers Table */}
        <h3 className="text-xl font-semibold mb-3 text-card-foreground">Extintores auditados ({mappedAuditResults.length})</h3>
        <div id="audit-results-table-pdf">
          <ReviewTableSign
            auditResults={mappedAuditResults}
            handleViewDetails={handleViewDetails}
            handleSaveAudit={handleSaveAudit}
            getAuditStatus={getAuditStatus}
            getAuditDate={getAuditDate}
          />
        </div>

        {/* Section for Client Name Input and Date Picker */}
        <div className="mb-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Nombre del Cliente</h3>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ingrese el nombre del cliente"
              value={clientNameInput}
              onChange={(e) => setClientNameInput(e.target.value)}
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
      </div> {/* END OF #report-content div */}

      {/* Confirmation and Cancellation Buttons */}
      <div className="flex justify-between mt-6 max-w-3xl mx-auto p-6">
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
          Generar Reporte
        </Button>
      </div>
    </>
  );
}