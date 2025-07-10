"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';


import { Client } from '@/mocks/extinguisherMocks';
import { SignaturePad } from '@/components/custom/signature-pad';
import ReviewTableSign from '@/components/custom/review-table';
import { useAudit } from '@/context/audit-context';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import ProcessHeader from "@/components/custom/process-header" // Assuming ProcessHeader is used for the top bar


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

// FIX: Corrected the structure of the default export function
export default function AuditReviewAndSign() {
  const router = useRouter();
  // Retrieve state from useAudit context inside the component
  const {
    client,
    buildingName,
    auditedExtinguishers,
    clientSignature, 
    setClientSignature, 
    clearAuditState
  } = useAudit();

  useEffect(() => {
    if (!client || !buildingName || !auditedExtinguishers) {
      // Only redirect if this check fails
      router.replace('/scheduled-audits');
    }
  }, [client, buildingName, auditedExtinguishers, router]); // Dependencies: re-run if these change

   if (!client || !buildingName || !auditedExtinguishers) {
    return null; // Return null to prevent rendering the rest of the component
  }
  // Derived state for mapped audit results
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

  // Handlers
  const handleConfirm = () => {
    if (!clientSignature) { // Use clientSignature from context
      toast({
        title: "Firma Requerida",
        description: "Por favor, proporcione una firma antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    console.log("Audit confirmed with signature:", clientSignature); // Use clientSignature from context
    // Here, you would typically make an API call to save the audit data (client, building, extinguishers, signature)
    // For now, it logs and clears.
    toast({
      title: "Auditoría Confirmada",
      description: "La auditoría ha sido confirmada y los datos guardados.",
      variant: "default",
    });
    clearAuditState(); // Clears all audit context state, including signature
    router.push('/scheduled-audits');
  };

  const handleCancel = () => {
    clearAuditState();
    router.push('/scheduled-audits');
  };

  const handleViewDetails = (extinguisherId: string) => {
    console.log(`Detalles del extintor ${extinguisherId}`);
  };

  const handleSaveAudit = () => {
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
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {/* You can add a calendar icon here later */}
              Seleccionar Fecha
            </Button>
          </div>
        </div>

        {/* Original Signature Pad section */}
        <div className="mb-6 mt-8">
          <h3 className="text-lg font-medium mb-2 text-card-foreground">Firma del cliente</h3>
          <SignaturePad
           onSignatureEnd={(dataUrl: string) => setClientSignature(dataUrl)}
           onClear={() => setClientSignature(null)}
           initialSignature={clientSignature || undefined}
          />

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