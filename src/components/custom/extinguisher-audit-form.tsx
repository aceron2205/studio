
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Camera, FileCheck, Trash2 } from "lucide-react"; // Changed icon for title, added Trash2

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

const ExtinguisherAuditSchema = z.object({ // Schema remains largely the same as it describes the extinguisher's state
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  capacidadLibras: z.string().min(1, "La capacidad es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  agenteExtintor: z.string().min(1, "El agente extintor es requerido"),
  instrucciones: z.string().optional(),
  calcomaniasPlacas: z.string().optional(),
  selloSeguridad: z.string().optional(),
  pinPasador: z.string().optional(),
  pinturaBuenEstado: z.string().optional(),
  cilindroMangueraBoquillas: z.string().optional(),
  alturaAdecuada: z.string().optional(),
  indicadorPresion: z.string().min(1, "El estado del indicador de presión es requerido"),
  accesoLibre: z.string().optional(),
  cargaExtintores: z.string().min(1, "El estado de carga es requerido"),
  observacionesGenerales: z.string().optional(),
  // photoEvidence: z.any().optional(), // Placeholder for future photo data
});

// FormData type derived from the schema
export type ExtinguisherAuditFormData = z.infer<typeof ExtinguisherAuditSchema>;

const checklistOptions = [
  { value: "C", label: "Conforme" },
  { value: "NC", label: "No Conforme" },
  { value: "NA", label: "No Aplica" },
  { value: "P", label: "Pendiente" },
];

const checklistFormItems = [
    { name: "instrucciones" as const, label: "Instrucciones legibles y a la vista" },
    { name: "calcomaniasPlacas" as const, label: "Calcomanías/placas legibles y en buen estado" },
    { name: "selloSeguridad" as const, label: "Sello de seguridad" },
    { name: "pinPasador" as const, label: "Pin o pasador de seguridad" },
    { name: "pinturaBuenEstado" as const, label: "Pintura en buen estado" },
    { name: "cilindroMangueraBoquillas" as const, label: "Cilindro, manguera y boquillas" },
    { name: "alturaAdecuada" as const, label: "Altura de instalación" },
    { name: "accesoLibre" as const, label: "Acceso libre de obstrucciones" },
];

interface ExtinguisherAuditFormProps {
  initialData: Partial<ExtinguisherAuditFormData>;
  onSubmitSuccess: (data: ExtinguisherAuditFormData) => void;
  extinguisherId: string;
}

export function ExtinguisherAuditForm({ initialData, onSubmitSuccess, extinguisherId }: ExtinguisherAuditFormProps) {
  const form = useForm<ExtinguisherAuditFormData>({
    resolver: zodResolver(ExtinguisherAuditSchema),
    defaultValues: {
      ubicacion: initialData.ubicacion || "",
      capacidadLibras: initialData.capacidadLibras || "",
      modelo: initialData.modelo || "",
      agenteExtintor: initialData.agenteExtintor || "",
      instrucciones: initialData.instrucciones || "P", // Default to Pendiente for checklist items
      calcomaniasPlacas: initialData.calcomaniasPlacas || "P",
      selloSeguridad: initialData.selloSeguridad || "P",
      pinPasador: initialData.pinPasador || "P",
      pinturaBuenEstado: initialData.pinturaBuenEstado || "P",
      cilindroMangueraBoquillas: initialData.cilindroMangueraBoquillas || "P",
      alturaAdecuada: initialData.alturaAdecuada || "P",
      indicadorPresion: initialData.indicadorPresion || "",
      accesoLibre: initialData.accesoLibre || "P",
      cargaExtintores: initialData.cargaExtintores || "",
      observacionesGenerales: initialData.observacionesGenerales || "",
    },
  });

  function onSubmit(data: ExtinguisherAuditFormData) {
    console.log(`Extinguisher audit data (ID: ${extinguisherId}):`, data);
    toast({
      title: "Auditoría Guardada",
      description: `Los datos de la auditoría para el extinguidor ID: ${extinguisherId} han sido guardados.`,
      variant: "default",
    });
    onSubmitSuccess(data);
  }

  const handleAddPhotoEvidence = () => {
    console.log("Botón 'Agregar Fotos de Evidencia' clickeado. Funcionalidad no implementada.");
    toast({
        title: "Funcionalidad Pendiente",
        description: "La carga de fotos aún no está implementada.",
    });
  };

  const confirmDarDeBaja = () => {
    console.log(`Confirmado dar de baja extinguidor: ${extinguisherId} desde el formulario de auditoría.`);
    toast({
      title: "Extinguidor Marcado para Baja",
      description: `El extinguidor ID: ${extinguisherId} ha sido marcado para baja. (Simulado)`,
      variant: "destructive",
    });
    // Aquí podrías llamar a una función para realmente marcarlo para baja en tu backend.
    // Por ahora, solo muestra el toast y no cierra el formulario.
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
          <FileCheck className="h-6 w-6 text-primary" />
          Auditar Extinguidor
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Oficina principal, pasillo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="capacidadLibras"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad (Libras)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 10 lbs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: ABC-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agenteExtintor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agente Extintor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: PQS ABC, CO2, Agua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="indicadorPresion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicador de Presión</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: En verde, Baja, Alta, N/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargaExtintores"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Estado de Carga / Próxima Recarga</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Cargado (MM/AAAA), Vencido (MM/AAAA)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <FormLabel className="text-md font-semibold mb-2 block">Lista de Verificación de Auditoría:</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {checklistFormItems.map(checkItem => (
                  <FormField
                    key={checkItem.name}
                    control={form.control}
                    name={checkItem.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{checkItem.label}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {checklistOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <FormField
              control={form.control}
              name="observacionesGenerales"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Observaciones de Auditoría</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anotaciones adicionales sobre la inspección de este extinguidor..."
                      className="resize-y min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 space-y-3">
              <FormLabel className="text-md font-semibold block">Fotos de Evidencia (Auditoría)</FormLabel>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPhotoEvidence}
                className="w-full sm:w-auto"
              >
                <Camera className="mr-2 h-4 w-4" />
                Agregar Fotos
              </Button>
              <div
                className="mt-2 w-full min-h-[120px] border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center text-muted-foreground p-4"
                data-ai-hint="photo evidence"
              >
                <Camera className="h-10 w-10 mb-2 opacity-50" />
                <span className="text-sm">Previsualización de Fotos de Auditoría</span>
                <span className="text-xs">(Aquí se mostrarán las fotos cargadas)</span>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end pt-8 border-t space-y-2 sm:space-y-0 sm:space-x-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Dar de baja
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción marcará el extinguidor para darlo de baja. Esto se reflejará en el reporte de auditoría. No podrás deshacer esta acción fácilmente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDarDeBaja}>
                    Confirmar Baja
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-5 w-5" />
              {form.formState.isSubmitting
                ? "Guardando Auditoría..."
                : "Guardar Auditoría"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
