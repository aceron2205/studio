"use client";

import * as React from "react";
import { InventoryTable } from "@/components/custom/inventory-table";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import ProcessHeader from "@/components/custom/process-header";
import { AuditSearchFilter } from "@/components/custom/audit-search-filter";
import { Plus } from "lucide-react";
import { InventoryItemForm, type InventoryItemFormData } from "@/components/custom/inventory-item-form";

// Import InventoryItem and mockInventoryItems from the new shared file
import { InventoryItem, mockInventoryItems } from '@/mocks/inventoryMocks'; // <--- UPDATED IMPORT

export default function InventoryPage() {
  const [isAddItemFormOpen, setIsAddItemFormOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const title = "Inventario";

  const filteredInventoryItems = React.useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockInventoryItems.filter(item =>
      item.articleName.toLowerCase().includes(lowerCaseSearchTerm) || // Your original field
      item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      (item.suggestedSupplier && item.suggestedSupplier.toLowerCase().includes(lowerCaseSearchTerm)) || // Search by supplier
      (item.location && item.location.toLowerCase().includes(lowerCaseSearchTerm)) || // Search by location
      (item.sku && item.sku.toLowerCase().includes(lowerCaseSearchTerm)) || // Search by SKU
      (item.category && item.category.toLowerCase().includes(lowerCaseSearchTerm)) // Search by category
    );
  }, [searchTerm]);

  const handleAddInventoryItem = () => {
    setIsAddItemFormOpen(true);
  };

  const handleSaveNewItem = (data: InventoryItemFormData) => {
    console.log("New inventory item to save:", data);
    setIsAddItemFormOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col mb-6 w-full">
          <ProcessHeader title={title} />
          <p className="mt-1 text-muted-foreground ml-4">
            Listado de artículos y repuestos para mantenimiento de extintores.
          </p>
          <div className="mt-4 px-4">
            <AuditSearchFilter onSearchChange={setSearchTerm} />
          </div>
        </div>
        <InventoryTable items={filteredInventoryItems} /> {/* Pass filtered data */}
      </div>

      <Button
        onClick={handleAddInventoryItem}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
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