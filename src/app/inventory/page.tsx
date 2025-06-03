
"use client";

import { InventoryTable } from "@/components/custom/inventory-table";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Archive, Plus } from "lucide-react"; // Changed PlusCircle to Plus

export default function InventoryPage() {
  const handleAddInventoryItem = () => {
    console.log("Add new inventory item FAB clicked");
    // Placeholder for actual navigation or modal opening logic
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12 pb-20"> {/* Added pb-20 for FAB spacing */}
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
                      className="mr-4"
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
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <InventoryTable />
            </CardContent>
            {/* CardFooter removed */}
          </Card>
        </div>
      </div>
      <Button
        onClick={handleAddInventoryItem}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Agregar artículo al inventario"
      >
        <Plus className="h-7 w-7" />
      </Button>
      <Toaster />
    </>
  );
}

