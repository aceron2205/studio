
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Added for the edit button
import { Edit3 } from "lucide-react"; // Added for the edit icon

interface InventoryItem {
  id: string;
  articleName: string;
  description: string; // Kept in interface for data integrity, though not displayed
  stockQuantity: number;
  unit: string;
  suggestedSupplier?: string; // Kept in interface
  lastUpdated: string; // YYYY-MM-DD
  lowStockThreshold: number; // Kept in interface
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: "item-001",
    articleName: "Manómetro 175 PSI",
    description: "Manómetro estándar para extintores PQS ABC.",
    stockQuantity: 120,
    unit: "piezas",
    suggestedSupplier: "ExtinMex S.A.",
    lastUpdated: "2024-07-15",
    lowStockThreshold: 20,
  },
  {
    id: "item-002",
    articleName: "Sello de Seguridad (Plástico)",
    description: "Sello de garantía para válvula de extintor.",
    stockQuantity: 550,
    unit: "piezas",
    suggestedSupplier: "SeguriTech Global",
    lastUpdated: "2024-07-20",
    lowStockThreshold: 100,
  },
  {
    id: "item-003",
    articleName: "Polvo Químico Seco ABC (Saco)",
    description: "Agente extintor tipo ABC, presentación en saco de 20kg.",
    stockQuantity: 15,
    unit: "sacos",
    suggestedSupplier: "Químicos Industriales GDA",
    lastUpdated: "2024-06-30",
    lowStockThreshold: 5,
  },
  {
    id: "item-004",
    articleName: "Manguera para PQS 10 lbs",
    description: "Manguera de descarga completa con boquilla para PQS de 10 lbs.",
    stockQuantity: 35,
    unit: "piezas",
    suggestedSupplier: "ExtinMex S.A.",
    lastUpdated: "2024-07-05",
    lowStockThreshold: 10,
  },
  {
    id: "item-005",
    articleName: "Nitrógeno (Cilindro de recarga)",
    description: "Gas para presurización de extintores.",
    stockQuantity: 5,
    unit: "cilindros",
    suggestedSupplier: "Infra Gas",
    lastUpdated: "2024-07-01",
    lowStockThreshold: 2,
  },
  {
    id: "item-006",
    articleName: "Etiqueta de Recarga/Mantenimiento",
    description: "Collarín/etiqueta para registro de servicio.",
    stockQuantity: 800,
    unit: "piezas",
    suggestedSupplier: "Imprenta Segura",
    lastUpdated: "2024-07-22",
    lowStockThreshold: 200,
  },
   {
    id: "item-007",
    articleName: "Válvula para PQS",
    description: "Válvula completa para extintor de Polvo Químico Seco.",
    stockQuantity: 8,
    unit: "piezas",
    suggestedSupplier: "ExtinMex S.A.",
    lastUpdated: "2024-05-10",
    lowStockThreshold: 5,
  },
];

export function InventoryTable() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>(mockInventoryItems);

  const handleEditItem = (itemId: string) => {
    // Placeholder for edit functionality
    console.log(`Edit item: ${itemId}`);
    // In a real app, you would navigate to an edit page or open a modal
  };

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Un listado de los artículos de inventario disponibles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell text-center w-[150px]">Ultima Mod.</TableHead>
            <TableHead>Artículo</TableHead>
            <TableHead className="text-right w-[120px]">Stock</TableHead>
            <TableHead className="text-center w-[100px]">Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="hidden md:table-cell text-center">
                {new Date(item.lastUpdated + 'T00:00:00').toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{item.articleName}</TableCell>
              <TableCell className="text-right">
                {item.stockQuantity} {item.unit}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditItem(item.id)}
                  aria-label={`Editar ${item.articleName}`}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {inventory.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          No hay artículos en el inventario.
        </p>
      )}
    </div>
  );
}
