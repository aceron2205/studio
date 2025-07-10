// src/app/audit-review-sign/page.tsx
"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from "date-fns"; // <--- NEW: Import format for dates
import { Calendar as CalendarIcon, Loader2, ArrowLeft } from "lucide-react";


import { Client } from '@/mocks/extinguisherMocks';
// SignaturePad is imported but used dynamically. Keep the component import for type hinting.
import { SignaturePad as SignaturePadComponent } from '@/components/custom/signature-pad'; // Renamed to avoid conflict with dynamic import variable
import ReviewTableSign from '@/components/custom/review-table';
import { useAudit } from '@/context/audit-context';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import ProcessHeader from "@/components/custom/process-header"
import dynamic from 'next/dynamic'

// Dynamic import for SignaturePad to ensure it's client-side only
const SignaturePad = dynamic(
  () => import('@/components/custom/signature-pad').then((mod) => mod.SignaturePad),
  { ssr: false }
);

import { Calendar } from "@/components/ui/calendar"; // <--- NEW: Calendar component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // <--- NEW: Popover components
import { cn } from "@/lib/utils";

// Interface for AuditResult (can be defined here or in a shared types file)
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

  // FIX: Initial state for signature pad visibility is now FALSE
  const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false); // <--- CHANGE TO FALSE

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // <--- NEW STATE
  
  useEffect(() => {
    if (!client || !buildingName || !auditedExtinguishers) {
      router.replace('/scheduled-audits');
    }
    // If there's an existing signature when the page loads, hide the pad initially
    // This provides a consistent UX where if a signature is already present, the pad isn't immediately shown.
    if (clientSignature) {
        setIsSignaturePadVisible(false);
    }
  }, [client, buildingName, auditedExtinguishers, router, clientSignature]);

   if (!client || !buildingName || !auditedExtinguishers) {
    return null;
  }
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

  const handleConfirm = () => {
    if (!clientSignature) {
      toast({
        title: "Firma Requerida",
        description: "Por favor, proporcione una firma antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    // It's assumed the signature is already captured and the pad is hidden if finalized
    console.log("Audit confirmed with signature:", clientSignature);
    toast({
      title: "Auditoría Confirmada",
      description: "La auditoría ha sido confirmada y los datos guardados.",
      variant: "default",
    });
    clearAuditState();
    router.push('/scheduled-audits');
  };

  const handleCancel = () => {
    clearAuditState();
    router.push('/scheduled-audits');
  };

  const handleViewDetails = (extinguisherId: string) => {
    console.log(`Detalles del extintor ${extinguisherId}`);
  };

  const handleSaveAudit = (signatureDataUrl?: string) => {
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

  const getAuditStatus = (extinguisherId: string) => {
    return 'Auditado';
  };

  const getAuditDate = (extinguisherId: string) => {
    return new Date().toLocaleDateString();
  };

  // NEW HANDLER: To show the signature pad (when "Firmar" button is clicked)
  const handleShowSignaturePad = () => {
    setIsSignaturePadVisible(true);
    // Optional: Auto-scroll to the signature section if it's far down the page
    // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // NEW HANDLER: To hide the signature pad (when "Finalizar Firma" button is clicked)
  const handleFinalizeSignature = () => {
    if (!clientSignature) { // Ensure a signature exists before finalizing
        toast({
            title: "Firma Requerida",
            description: "Por favor, firme antes de finalizar.",
            variant: "destructive",
        });
        return;
    }
    setIsSignaturePadVisible(false); // Hide the signature pad
    // toast({
    //     title: "Firma Capturada", // Changed toast message for clarity
    //     description: "La firma ha sido capturada y finalizada.",
    //     variant: "success",
    // });
  };

  // NEW HANDLER: To show the signature pad again for editing
  const handleEditSignature = () => {
    setIsSignaturePadVisible(true);
    // toast({
    //   title: "Editando Firma",
    //   description: "Pad de firma visible para edición.",
    //   variant: "info",
    // });
  };


  return (
    <>
      <ProcessHeader title={title} goBack={() => router.back()} />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">

        <div className="mb-6 border-b pb-4">
          <p className="text-gray-700"><strong>Cliente:</strong> {client.name}</p>
          <p className="text-gray-700"><strong>Dirección:</strong> {client.direccion}</p>
          <p className="text-700"><strong>Edificio:</strong> {buildingName}</p>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-card-foreground">Extintores auditados ({mappedAuditResults.length})</h3>
        <ReviewTableSign
          auditResults={mappedAuditResults}
          handleViewDetails={handleViewDetails}
          handleSaveAudit={handleSaveAudit}
          getAuditStatus={getAuditStatus}
          getAuditDate={getAuditDate}
        />

        {/* New section for Nombre del Cliente and Fecha */}
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
            {/* Replace with Calendar component later */}
            {/* Calendar Integration */}
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
            <div className="space-y-4"> {/* Added a div for consistent spacing/styling */}
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
            <div className="border border-gray-300 rounded-md bg-white p-4 flex flex-col items-center justify-center min-h-[150px]"> {/* min-h for consistent space */}
              {clientSignature ? (
                <>
                  <img src={clientSignature} alt="Firma del Cliente" className="max-w-full h-auto" style={{ maxHeight: '150px' }} />
                  <Button onClick={handleEditSignature} variant="outline" size="sm" className="mt-4"> {/* Increased mt for spacing */}
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