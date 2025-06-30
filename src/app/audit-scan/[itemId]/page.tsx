"use client";

import * as React from "react";
import { use } from 'react'; // `useState`, `useEffect`, `useMemo` are not used in this specific component's logic, so removed for clarity
import Link from "next/link"; // Link is imported but not used in the provided JSX. Keep if used elsewhere or remove if truly unused.
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import ProcessHeader from "@/components/custom/process-header"; // ProcessHeader is imported but not used in the provided JSX. Keep if used elsewhere or remove if truly unused.
import { Toaster } from "@/components/ui/toaster";
import { ExtinguisherData } from "@/types/extinguisher"; // Assuming this path and type exists
import { mockClients, Client } from "@/mocks/extinguisherMocks";

interface AuditScanPageProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  // --- ALL COMPONENT LOGIC GOES HERE, INSIDE THE FUNCTION ---

  // 1. Destructure paramsPromise using `use` hook
  const { itemId } = use(paramsPromise);

  // 2. Data processing logic: Find the client and extract its extinguisher plan
  const client: Client | undefined = mockClients.find(c => c.id === itemId);

  // Extract the 'extinguisher-plan' from the found client.
  // Use optional chaining and default to an empty array if the client or plan is not found.
  const extinguishersForAuditedItem: ExtinguisherData[] = client?.['extinguisher-plan'] || [];

  // 3. Determine clientName from the found client's name, or use a fallback.
  const clientName = client?.name || `Plan ${itemId}`;

  console.log("extinguishersForAuditedItem:", extinguishersForAuditedItem);
  // (Removed duplicate console.log)

  // REMOVED: DetailedExtinguisherInfo interface is no longer needed here
  // REMOVED: mockDataForAuditableItems is no longer needed here

  // --- JSX Return ---
  return (
    <div className="flex flex-col justify-start min-h-screen bg-background">
      <div className="w-full">
        {/*
          If you intend to use ProcessHeader, ArrowLeft, Button, Link, etc.,
          they should be included here in the JSX.
          The previous version of AuditExtinguisherPage had a header with a back button.
          You might want to add a similar structure here if this page needs it.
        */}
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