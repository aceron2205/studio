
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
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"; // Added Card for mobile view

interface InventoryItem {
  id: string;
  articleName: string;
  description: string;
  stockQuantity: number;
  unit: string;
  suggestedSupplier?: string;
  lastUpdated: string; // YYYY-MM-DD
  lowStockThreshold: number;
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

export const InventoryTable: React.FC = () => {
  const [inventory, setInventory] = React.useState<InventoryItem[]>(mockInventoryItems);

  const handleEditItem = (itemId: string) => {
    // Placeholder for edit functionality
    console.log(`Edit item: ${itemId}`);
    // In a real app, you would navigate to an edit page or open a modal
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>Un listado de los artículos de inventario disponibles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[150px]">Ultima Mod.</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead className="text-right w-[120px]">Stock</TableHead>
              <TableHead className="text-center">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">
                  {formatDate(item.lastUpdated)}
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

      {/* Mobile List View */}
      <div className="md:hidden space-y-3">
        {inventory.map((item) => (
          <Card key={`mobile-${item.id}`} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-grow pr-2">
                  <h3 className="font-semibold text-base text-card-foreground">{item.articleName}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 -mr-2 -mt-1"
                  onClick={() => handleEditItem(item.id)}
                  aria-label={`Editar ${item.articleName}`}
                >
                  <Edit3 className="h-5 w-5" />
                </Button>
              </div>
              <Separator className="mb-3 mt-1" />
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Última Mod.: </span>
                  <span className="text-foreground">{formatDate(item.lastUpdated)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-muted-foreground">Stock: </span>
                  <span className="text-foreground ml-1">{item.stockQuantity} {item.unit}</span>
                  {item.stockQuantity < item.lowStockThreshold && (
                    <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                      Bajo Stock
                    </Badge>
                  )}
                </div>
                {item.suggestedSupplier && (
                  <div>
                    <span className="font-medium text-muted-foreground">Proveedor: </span>
                    <span className="text-foreground">{item.suggestedSupplier}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {inventory.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">
            No hay artículos en el inventario.
          </p>
        )}
         <p className="mt-4 text-xs text-muted-foreground text-center">Listado de artículos de inventario disponibles.</p>
      </div>
    </div>
  );
};

