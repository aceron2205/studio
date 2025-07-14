
"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryTable } from '@/components/custom/inventory-table';

export default function InventoryPage() {
  return (
 <div className="flex flex-col items-center justify-start min-h-screen bg-background">
 <div className="w-full max-w-4xl">
 {/* Header with Back Button and Title */}
 <div className="flex items-center mb-6">
 <Link href="/" passHref>
 <Button
 variant="ghost"
 size="icon"
 aria-label="Volver al Inicio"
 className="mr-4"
 >
 <ArrowLeft className="h-5 w-5" />
 </Button>
 </Link>
 <h1 className="text-3xl font-bold text-primary">Inventario de Extintores</h1>
              </div>

 <InventoryTable />
 </div>
    </div>
  );
}
