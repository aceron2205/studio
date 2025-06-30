
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported if used in table

// Import InventoryItem interface from the new shared file
import { InventoryItem } from '@/mocks/inventoryMocks'; // <--- UPDATED IMPORT

interface InventoryTableProps {
  items: InventoryItem[]; // Accept 'items' as prop
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  // Remove local mockInventoryItems and useState as data comes from props
  // const [inventory, setInventory] = React.useState<InventoryItem[]>(mockInventoryItems);

  const handleEditItem = (itemId: string) => {
    console.log(`Edit item: ${itemId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="w-full">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[150px]">Ultima Mod.</TableHead>
              <TableHead>Artículo</TableHead>
              <TableHead className="text-right w-[120px]">Stock</TableHead>
              <TableHead className="text-center">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No hay artículos en el inventario que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {formatDate(item.lastUpdated)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.articleName} {/* Your original field */}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.stockQuantity} {item.unit} {/* Your original fields */}
                    {item.stockQuantity <= item.lowStockThreshold && (
                      <Badge variant="destructive" className="ml-2 text-xs">Bajo Stock</Badge>
                    )}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};