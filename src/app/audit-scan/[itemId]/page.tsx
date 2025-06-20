"use client";

import * as React from "react";
import { use } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import ProcessHeader from "@/components/custom/process-header";
import { Toaster } from "@/components/ui/toaster";
import { ExtinguisherData } from "@/types/extinguisher"; // Assuming this path and type exists
import { mockPlanExtinguishers } from "@/mocks/extinguisherMocks";


// REMOVED: DetailedExtinguisherInfo interface is no longer needed here
// REMOVED: mockDataForAuditableItems is no longer needed here


interface AuditScanPageProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const { itemId } = use(paramsPromise);

  // MODIFIED: Use mockPlanExtinguishers to get plan details
  const planDetailsFromMocks = mockPlanExtinguishers[itemId];
  // Ensure the extinguishers array is typed as ExtinguisherAuditFormData[]
  const extinguishersForAuditedItem: ExtinguisherData[] = mockPlanExtinguishers[itemId] || [];

  // Determine clientName using data from ExtinguisherAuditFormData if available
  const clientName = (extinguishersForAuditedItem.length > 0 && extinguishersForAuditedItem[0].cliente)
    ? extinguishersForAuditedItem[0].cliente
    : `Plan ${itemId}`; // Fallback title

  console.log("extinguishersForAuditedItem:", extinguishersForAuditedItem);

  return (
    <div className="flex flex-col justify-start min-h-screen bg-background">
      <div className="w-full">
        <BarcodeScanner
            itemId={itemId}
            extinguishersForPlan={extinguishersForAuditedItem}
            overrideTitle={clientName}
        />
      </div>
      <Toaster />
    </div>
  );
}