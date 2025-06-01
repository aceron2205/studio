
"use client";

import * as React from "react";
import { use } from 'react'; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import { Toaster } from "@/components/ui/toaster"; 

// Mock data: Represents plans and their associated extinguishers
// Also includes entries for specific audit IDs to link them to a set of extinguishers.
const mockDataForAuditableItems: Record<string, {
  name: string; 
  extinguishers: Array<{ id: string; type: string; capacity: string; location_description: string }>;
}> = {
  'plan-alpha': {
    name: 'Plano General Fábrica A',
    extinguishers: [
      { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción' },
      { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte' },
    ],
  },
  'plan-beta': {
    name: 'Oficinas Corporativas Central',
    extinguishers: [
      { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera' },
    ],
  },
  'plan-gamma': {
    name: 'Almacén Sur Extintores',
    extinguishers: [
      { id: 'ext-4', type: 'Polvo Químico Seco (ABC)', capacity: '20 lbs', location_description: 'Almacén principal' },
      { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Zona de líquidos inflamables, cerca de puerta sur' },
      { id: 'ext-6', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Taller de mantenimiento, junto a banco de trabajo' },
    ],
  },
  // --- Specific Audit Item Mappings ---
  // For an audit item like 'current-day-5', we associate it with a name and a list of extinguishers
  // (e.g., those from 'plan-alpha' for this simulation)
  'current-day-5': {
    name: 'Auditoría Día 5 del Mes',
    extinguishers: [ // Using extinguishers from plan-alpha as an example
      { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción' },
      { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte' },
    ],
  },
  'current-day-15': {
    name: 'Auditoría Día 15 del Mes',
    extinguishers: [ // Using extinguishers from plan-beta as an example
      { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera' },
    ],
  },
  'current-today': {
    name: 'Auditoría de Hoy',
    extinguishers: [ // Using extinguishers from plan-gamma as an example
      { id: 'ext-4', type: 'Polvo Químico Seco (ABC)', capacity: '20 lbs', location_description: 'Almacén principal' },
      { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Zona de líquidos inflamables, cerca de puerta sur' },
    ],
  },
  'sep-audit-1': {
    name: 'Empresa Constructora Sol (Sept.)',
    extinguishers: [
        { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción' },
    ],
  },
  // If itemId is an extinguisher ID (e.g., 'ext-1', 'ext-2'), it won't be found as a direct key with an 'extinguishers' array.
  // This means mockDataForAuditableItems[itemId]?.extinguishers will be undefined,
  // and extinguishersForAuditedItem will correctly be an empty array, which is the desired behavior
  // for the BarcodeScanner when auditing a single extinguisher (it shouldn't list other extinguishers).
};


interface AuditScanPageProps {
  params: Promise<{ 
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const { itemId } = use(paramsPromise);

  // Get extinguishers for the current item (plan or audit).
  // If itemId is an extinguisher ID, this will be empty.
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
