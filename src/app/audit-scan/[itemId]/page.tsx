
"use client";

import * as React from "react";
import { use } from 'react'; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import { Toaster } from "@/components/ui/toaster"; 

// Extended interface to hold all details for accordion display in BarcodeScanner
interface DetailedExtinguisherInfo {
  id: string;
  type: string;
  capacity: string;
  location_description: string;
  model?: string;
  pressure_indicator?: string;
  charge_status?: string;
  last_revision_date?: string;
}

// Mock data: Represents plans and their associated extinguishers
// Also includes entries for specific audit IDs to link them to a set of extinguishers.
// This data now includes more details for the extinguishers.
const mockDataForAuditableItems: Record<string, {
  name: string; 
  extinguishers: DetailedExtinguisherInfo[];
}> = {
  'plan-alpha': {
    name: 'Plano General Fábrica A',
    extinguishers: [
      { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', last_revision_date: '2024-01-15' },
      { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', last_revision_date: '2023-11-20' },
    ],
  },
  'plan-beta': {
    name: 'Oficinas Corporativas Central',
    extinguishers: [
      { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', last_revision_date: '2024-03-10' },
    ],
  },
  'plan-gamma': {
    name: 'Almacén Sur Extintores',
    extinguishers: [
      { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', last_revision_date: '2023-08-01' },
      { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', last_revision_date: '2024-05-05' },
      { id: 'ext-6', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Taller de mantenimiento', model: 'Generic PQS-10', pressure_indicator: 'En Verde', charge_status: 'Cargado (02/2024)', last_revision_date: '2024-02-10' },
    ],
  },
  'current-day-5': {
    name: 'Auditoría Día 5 del Mes',
    extinguishers: [ 
      { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', last_revision_date: '2024-01-15' },
      { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', last_revision_date: '2023-11-20' },
    ],
  },
  'current-day-15': {
    name: 'Auditoría Día 15 del Mes',
    extinguishers: [ 
      { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', last_revision_date: '2024-03-10' },
    ],
  },
  'current-today': {
    name: 'Auditoría de Hoy',
    extinguishers: [ 
      { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', last_revision_date: '2023-08-01' },
      { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', last_revision_date: '2024-05-05' },
    ],
  },
  'sep-audit-1': {
    name: 'Empresa Constructora Sol (Sept.)',
    extinguishers: [
        { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', last_revision_date: '2024-01-15' },
    ],
  },
};


interface AuditScanPageProps {
  params: Promise<{ 
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const { itemId } = use(paramsPromise);

  const extinguishersForAuditedItem = mockDataForAuditableItems[itemId]?.extinguishers || [];
  const auditedItemName = mockDataForAuditableItems[itemId]?.name || `Elemento ${itemId}`;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-md">
        <div className="mb-6 relative flex items-center justify-center">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Volver al Inicio"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-primary text-center px-12 truncate" title={`Auditar: ${auditedItemName}`}>
            Auditar: {auditedItemName}
          </h1>
        </div>
        <BarcodeScanner itemId={itemId} extinguishersForPlan={extinguishersForAuditedItem} />
      </div>
      <Toaster /> 
    </div>
  );
}

