"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Import Spanish locale
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useToast } from "@/components/ui/toast";

// Zod Schema for validation
const NewExtinguisherSchema = z.object({
  equipoId: z.string().min(1, "El ID del equipo es requerido."),
  qrCode: z.string().optional(),
  cliente: z.string().optional(),
  edificio: z.string().optional(),
  ubicacion: z.string().min(3, "La ubicación es requerida."),
  tipoAgente: z.enum(["pqs_abc", "co2", "agua", "clase_k"], {
    required_error: "Debe seleccionar un tipo de agente.",
  }),
  capacidad: z.string().min(1, "La capacidad es requerida."),
  fabricante: z.string().min(2, "El fabricante es requerido."),
  modelo: z.string().min(2, "El modelo es requerido."),
  fechaPuestaServicio: z.date({ required_error: "La fecha de puesta en servicio por primera ves es requerida." }),
  fechaFabricacion: z.date({ required_error: "La fecha de fabricación es requerida." }),
  fechaPruebaHidrostatica: z.date({ required_error: "La fecha de prueba hidrostatica es requerida." }),
  fechaServicioAnual: z.date().optional(),
});

type NewExtinguisherFormData = z.infer<typeof NewExtinguisherSchema>;

export function NewExtinguisherForm() {
  const form = useForm<NewExtinguisherFormData>({
    resolver: zodResolver(NewExtinguisherSchema),
  });

  function onSubmit(data: NewExtinguisherFormData) {
    // Here you would handle the form submission to your backend
    console.log("New Extinguisher Data:", data);
    /*useToast({
      title: "Extintor Guardado",
      description: `El extintor con ID: ${data.equipoId} ha sido registrado exitosamente.`,
    });*/
  }

  const renderDateField = (name: keyof NewExtinguisherFormData, label: string) => (
    <FormField name={name} control={form.control} render={({ field }) => (
       <FormItem className="flex flex-col">
           <FormLabel>{label}</FormLabel>
           <Popover>
               <PopoverTrigger asChild>
               <FormControl>
                   <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                   {field.value ? format(field.value as Date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                   </Button>
               </FormControl>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
               <Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
               </PopoverContent>
           </Popover>
           <FormMessage />
       </FormItem>
   )}/>
 );


  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Extintor</h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
  
  {/* Sección: Cliente y Ubicación */}
  <div>
    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Cliente y Ubicación</h3>
    <div className="space-y-4 pt-2">
      <FormField
        control={form.control}
        name="cliente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Emerson" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="edificio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Edificio (Opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Almacén Principal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ubicacion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ubicación Descriptiva</FormLabel>
            <FormControl>
              <Textarea placeholder="Ej: Pasillo de producción, junto a puerta 3" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
  
  {/* Sección: Identificación y Especificaciones */}
  <div>
    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Identificación y Especificaciones</h3>
    <div className="space-y-4 pt-2">
      <FormField
        control={form.control}
        name="equipoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID del Equipo</FormLabel>
            <FormControl>
              <Input placeholder="Ej: P1-E15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tipoAgente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Agente</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pqs_abc">Polvo Químico Seco (ABC)</SelectItem>
                <SelectItem value="co2">Dióxido de Carbono (CO2)</SelectItem>
                <SelectItem value="agua">Agua a Presión</SelectItem>
                <SelectItem value="clase_k">Químico Húmedo (Clase K)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="capacidad"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacidad</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 10 lbs" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fabricante"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fabricante (Marca)</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Amerex" {...field} />
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
              <Input placeholder="Ej: B402" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
          {/* Section: Key Dates */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Fechas Clave</h3>
            <div className="space-y-4">
                {renderDateField("fechaPuestaServicio", "Fecha de Puesta en Servicio")}
                {renderDateField("fechaFabricacion", "Fecha de Fabricación")}
                {renderDateField("fechaPruebaHidrostatica", "Fecha de Última Prueba Hidrostática (si aplica)")}
                {renderDateField("fechaServicioAnual", "Fecha de Último Servicio Anual (si aplica)")}
            </div>
          </div>
          <Button type="submit" className="w-full">Guardar Extintor</Button>
        </form>
      </Form>
    </div>
  );
}