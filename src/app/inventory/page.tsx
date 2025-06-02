"use client";

import { InventoryTable } from "@/components/custom/inventory-table";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Archive, PlusCircle } from "lucide-react";

export default function InventoryPage() {
  const handleAddInventoryItem = () => {
    // Placeholder for future functionality
    console.log("Request to add new inventory item.");
    // In a real app, this would likely open a modal or navigate to a new form.
    // For now, we can use a toast to indicate the action.
    // toast({ title: "Funcionalidad Pendiente", description: "Agregar nuevo artículo al inventario." });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="relative p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" passHref>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Volver al Inicio"
                    className="mr-4" // Added margin to separate from title
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="text-left">
                  <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
                    <Archive className="h-6 w-6" />
                    Inventario de Repuestos
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Listado de artículos y repuestos para mantenimiento de extintores.
                  </CardDescription>
                </div>
              </div>
              <Button onClick={handleAddInventoryItem} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Artículo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <InventoryTable />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
