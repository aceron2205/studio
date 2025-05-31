
"use client";

import * as React from "react";
import { use } from 'react'; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is here

interface AuditScanPageProps {
  params: Promise<{ 
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const { itemId } = use(paramsPromise);

  // The BarcodeScanner now handles its internal view (scanner or form)
  // So, the main page structure can be simpler.
  // The "Volver" button here might be redundant if BarcodeScanner handles its own "back to main menu" logic,
  // or if the embedded form has a "back to scanner" button.
  // For now, let's keep a general "Volver" button that takes the user to the main page.

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-md">
        {/* This top-level back button might be confusing if the BarcodeScanner shows a form.
            Consider removing it if BarcodeScanner's internal navigation is sufficient.
            For now, it goes back to the main page.
        */}
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
          {/* The title "Auditar Elemento" might need to be dynamic based on BarcodeScanner's state,
              or BarcodeScanner can render its own title when in form mode.
              For simplicity, keeping it static for now.
           */}
          <h1 className="text-xl font-semibold text-primary">Auditar Elemento</h1>
        </div>
        <BarcodeScanner itemId={itemId} />
      </div>
      <Toaster /> {/* Toaster for notifications from BarcodeScanner and ExtinguisherEditorForm */}
    </div>
  );
}
