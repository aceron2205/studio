
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { PackagePlus, Save } from "lucide-react";

const inventoryItemSchema = z.object({
  articleName: z.string().min(1, "El nombre del artículo es requerido."),
  description: z.string().optional(),
  stockQuantity: z.coerce.number().min(0, "La cantidad debe ser al menos 0."),
  unit: z.string().min(1, "La unidad es requerida (ej: piezas, kg)."),
  barcode: z.string().optional(),
  serialNumber: z.string().optional(),
  binLocation: z.string().optional(),
  suggestedSupplier: z.string().optional(),
  lowStockThreshold: z.coerce.number().min(0, "El umbral debe ser al menos 0."),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

interface InventoryItemFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: InventoryItemFormData) => void; // Callback after successful save
  initialData?: Partial<InventoryItemFormData>; // For editing in the future
}

export function InventoryItemForm({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}: InventoryItemFormProps) {
  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: initialData || {
      articleName: "",
      description: "",
      stockQuantity: 0,
      unit: "piezas",
      barcode: "",
      serialNumber: "",
      binLocation: "",
      suggestedSupplier: "",
      lowStockThreshold: 10,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ // Default for new item
        articleName: "",
        description: "",
        stockQuantity: 0,
        unit: "piezas",
        barcode: "",
        serialNumber: "",
        binLocation: "",
        suggestedSupplier: "",
        lowStockThreshold: 10,
      });
    }
  }, [initialData, form, isOpen]);


  const onSubmit = (data: InventoryItemFormData) => {
    console.log("Inventory item data submitted:", data);
    onSave(data); // Call the passed onSave handler
    form.reset(); // Reset form after submission
    onOpenChange(false); // Close dialog
    toast({
      title: "Artículo Guardado",
      description: `El artículo "${data.articleName}" ha sido guardado.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <PackagePlus className="mr-2 h-6 w-6 text-primary" />
            {initialData?.articleName ? "Editar Artículo" : "Agregar Nuevo Artículo"}
          </DialogTitle>
          <DialogDescription>
            {initialData?.articleName ? "Modifique los detalles del artículo." : "Complete los detalles del nuevo artículo de inventario."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="articleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Artículo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Manómetro 175 PSI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalles adicionales del artículo..."
                        className="resize-y min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad en Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: piezas, kg, mts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Barras (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Escanear o ingresar código" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Serie (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresar número de serie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="binLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación/Estante (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Estante A-3, Bodega 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suggestedSupplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor Sugerido (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Umbral de Stock Bajo</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Artículo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
