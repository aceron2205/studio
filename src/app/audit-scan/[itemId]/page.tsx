
"use client";

import * as React from "react";
import { use } from 'react'; // For Suspense with params
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
import { Toaster } from "@/components/ui/toaster";

interface AuditScanPageProps {
  params: Promise<{ 
    itemId: string;
  }>;
}

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const { itemId } = use(paramsPromise);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-md">
        <div className="mb-6 relative flex items-center justify-center">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Volver"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-primary">Auditar Elemento</h1>
        </div>
        <BarcodeScanner itemId={itemId} />
      </div>
      <Toaster />
    </div>
  );
}
