
"use client";

import * as React from "react";
import { InventoryTable } from "@/components/custom/inventory-table";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function InventoryPage() {
  const [isAddItemFormOpen, setIsAddItemFormOpen] = React.useState(false);

  const handleAddInventoryItem = () => {
    setIsAddItemFormOpen(true);
  };

  const handleSaveNewItem = (data: InventoryItemFormData) => {
    // Here you would typically send the data to your backend or update global state
    console.log("New inventory item to save:", data);
    // For now, we'll just close the form. The toast is handled in the form component.
    // You might want to refresh the inventory list here if it's managed by this page's state.
  };

 return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
 <Link
 href="/"
 className={buttonVariants({ variant: "ghost", size: "icon" })}
 aria-label="Volver al Inicio"
 >
 <ArrowLeft className="h-5 w-5" />
 </Link>
          <div className="text-left ml-4">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
 <Archive className="h-7 w-7" />
              Inventario de Repuestos
 </h1>
 <p className="mt-1 text-muted-foreground">
 Listado de artículos y repuestos para mantenimiento de extintores.
 </p>
          </div>
        </div>
 <InventoryTable />
      </div>
      <Button
        onClick={handleAddInventoryItem}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Agregar artículo al inventario"
      >
        <Plus className="h-7 w-7" />
      </Button>
    <InventoryItemForm
 isOpen={isAddItemFormOpen}
 onOpenChange={setIsAddItemFormOpen}
 onSave={handleSaveNewItem}
 />
    <Toaster />
 </div>
  );
}
import { ArrowLeft, Archive, Plus } from "lucide-react";
import { InventoryItemForm, type InventoryItemFormData } from "@/components/custom/inventory-item-form";
