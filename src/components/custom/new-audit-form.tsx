
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { ArrowLeft, CalendarIcon, PlusCircle, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScannerInterface } from "./scanner-interface";

const ExtinguisherSchema = z.object({
  id: z.string().optional(), // Added to help find item by ID
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
});

export type ExtinguisherFormData = z.infer<typeof ExtinguisherSchema>;

const NewPlanFormSchema = z.object({
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  date: z.date({
    required_error: "La fecha es requerida."
  }),
  extinguishers: z.array(ExtinguisherSchema).min(1, "Debe agregar al menos un extinguidor."),
});

export type NewPlanFormData = z.infer<typeof NewPlanFormSchema>;

const checklistOptions = [
  { value: "C", label: "Conforme" },
  { value: "NC", label: "No Conforme" },
  { value: "NA", label: "No Aplica" },
  { value: "P", label: "Pendiente" },
];

const defaultChecklistValues = {
    instrucciones: "P",
    calcomaniasPlacas: "P",
    selloSeguridad: "P",
    pinPasador: "P",
    pinturaBuenEstado: "P",
    cilindroMangueraBoquillas: "P",
    alturaAdecuada: "P",
    accesoLibre: "P",
};

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

const mockKnownExtinguishersData: Record<string, Partial<ExtinguisherFormData>> = {
  'EXT-001': {
    ubicacion: 'Recepción Principal (Desde Scan)',
    capacidadLibras: '10 lbs',
    modelo: 'Amerex B402 Scan',
    agenteExtintor: 'Polvo Químico Seco (ABC)',
    indicadorPresion: 'En Verde',
    cargaExtintores: 'Cargado (01/2024)',
  },
  'CO2-SERV': {
    ubicacion: 'Sala de Servidores (Desde Scan)',
    capacidadLibras: '5 kg',
    modelo: 'Kidde K05 Scan',
    agenteExtintor: 'Dióxido de Carbono (CO2)',
    indicadorPresion: 'N/A (CO2)',
    cargaExtintores: 'Cargado (11/2023)',
    observacionesGenerales: 'Pintura ligeramente rayada en base (detectado por scan).',
  },
  'sim-cam-123': { 
    ubicacion: 'Taller - Simulado Cámara (Desde Scan)',
    capacidadLibras: '20 lbs',
    modelo: 'SIM-CAM-MOD-SCAN',
    agenteExtintor: 'Agua Presurizada (Sim. Scan)',
    indicadorPresion: 'En Verde',
    cargaExtintores: `Cargado (${format(new Date(), 'MM/yyyy')})`,
  }
};


export function NewAuditForm() {
  const router = useRouter();
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>(undefined);

  const form = useForm<NewPlanFormData>({
    resolver: zodResolver(NewPlanFormSchema),
    defaultValues: {
      clientName: "",
      address: "",
      extinguishers: [],
    },
  });

  React.useEffect(() => {
    form.setValue("date", new Date());
  }, [form]);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "extinguishers",
  });

  const prevFieldsLengthRef = React.useRef(fields.length);

  React.useEffect(() => {
    if (fields.length > prevFieldsLengthRef.current) { // If a new item was appended
      const newItemId = fields[fields.length - 1]?.id;
      if (newItemId) {
        setOpenAccordionItem(newItemId);
        setTimeout(() => {
          const itemElement = document.querySelector(`[data-radix-accordion-item][value="${newItemId}"]`);
          itemElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
    prevFieldsLengthRef.current = fields.length;
  }, [fields, setOpenAccordionItem]);


  function onSubmit(data: NewPlanFormData) {
    console.log("Form data submitted:", data);
    toast({
      title: "Formulario Enviado",
      description: "Los datos del nuevo plano/auditoría han sido registrados.",
      variant: "default",
    });
  }
  
  const handleCodeScannedFromTopInterface = (code: string) => {
    console.log(`Código escaneado desde interfaz superior: ${code}`);
    if (!openAccordionItem && fields.length > 0) {
      toast({ 
        title: "Acción Requerida", 
        description: "Por favor, expanda un extinguidor de la lista para pre-rellenar sus datos, o añada uno nuevo si la lista está vacía.",
        variant: "default"
      });
      return;
    }
     if (fields.length === 0) {
      toast({ 
        title: "Lista Vacía", 
        description: "Añada un extinguidor manualmente primero para poder pre-rellenar sus datos con el escáner.",
        variant: "default"
      });
      return;
    }

    const targetIndex = fields.findIndex(field => field.id === openAccordionItem);

    if (targetIndex === -1 && openAccordionItem) {
       toast({ variant: "destructive", title: "Error", description: "No se pudo encontrar el extinguidor abierto en la lista." });
       return;
    }
    
    if (targetIndex !== -1) {
        const extinguisherData = mockKnownExtinguishersData[code.toUpperCase()] || mockKnownExtinguishersData[code];
        if (extinguisherData) {
          const currentExtinguisherValues = form.getValues(`extinguishers.${targetIndex}`);
          
          form.setValue(`extinguishers.${targetIndex}.ubicacion`, extinguisherData.ubicacion || currentExtinguisherValues.ubicacion || "");
          form.setValue(`extinguishers.${targetIndex}.capacidadLibras`, extinguisherData.capacidadLibras || currentExtinguisherValues.capacidadLibras || "");
          form.setValue(`extinguishers.${targetIndex}.modelo`, extinguisherData.modelo || currentExtinguisherValues.modelo || "");
          form.setValue(`extinguishers.${targetIndex}.agenteExtintor`, extinguisherData.agenteExtintor || currentExtinguisherValues.agenteExtintor || "");
          form.setValue(`extinguishers.${targetIndex}.indicadorPresion`, extinguisherData.indicadorPresion || currentExtinguisherValues.indicadorPresion || "");
          form.setValue(`extinguishers.${targetIndex}.cargaExtintores`, extinguisherData.cargaExtintores || currentExtinguisherValues.cargaExtintores || "");
          form.setValue(`extinguishers.${targetIndex}.observacionesGenerales`, extinguisherData.observacionesGenerales || currentExtinguisherValues.observacionesGenerales || "");
          
          checklistFormItems.forEach(checkItem => {
            const key = `extinguishers.${targetIndex}.${checkItem.name}`;
            // @ts-ignore
            const mockValue = extinguisherData[checkItem.name];
            const existingValue = form.getValues(key as any);
            form.setValue(key as any, mockValue || existingValue || defaultChecklistValues[checkItem.name]);
          });

          toast({
            title: `Datos Precargados para Extinguidor #${targetIndex + 1}`,
            description: `El extinguidor con código ${code} ha precargado datos. Verifique y complete.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: `Código no Encontrado`,
            description: `No se encontraron datos para el código: ${code}. Complete manualmente el extinguidor #${targetIndex + 1}.`,
          });
        }
    } else if (!openAccordionItem && fields.length > 0) { // Should have been caught earlier, but as a fallback
        toast({ title: "Acción Requerida", description: "Expanda un extinguidor para usar el escáner."});
    }
  };

  const addNewExtinguisherManually = () => {
    // When adding manually, ensure a unique ID for the accordion item state
    const newId = `ext-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    append({
      id: newId, // Make sure new items get an ID for accordion control
      ubicacion: "",
      capacidadLibras: "",
      modelo: "",
      agenteExtintor: "",
      ...defaultChecklistValues,
      indicadorPresion: "",
      cargaExtintores: "",
      observacionesGenerales: "",
    });
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="relative p-6 border-b">
        <Link href="/create-plan" passHref>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver a Crear Plan"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-semibold text-primary">
            Formulario de nuevo plano
          </CardTitle>
          <CardDescription className="mt-1">
            Complete los detalles del cliente y la inspección de extintores.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Detalles del Cliente y Auditoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Empresa XYZ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Calle Falsa 123, Ciudad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Auditoría</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full md:w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Extintores ({fields.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewExtinguisherManually}
                  className="w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Extinguidor Manualmente
                </Button>
              </div>
              
              <Card className="mb-6 p-4 shadow-sm">
                <CardHeader className="p-2 pb-3">
                    <CardTitle className="text-lg text-primary">Escanear para Pre-rellenar Extinguidor Abierto</CardTitle>
                    <CardDescription className="text-sm">
                        Expanda un extinguidor de la lista de abajo y luego use el escáner o ingrese un código aquí para buscar y pre-rellenar sus datos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                    <ScannerInterface
                        onCodeScanned={handleCodeScannedFromTopInterface}
                        showCamera={true} 
                    />
                </CardContent>
              </Card>


              {fields.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No se han agregado extinguidores. Use el botón "Añadir Extinguidor Manualmente".
                </p>
              )}

              <Accordion
                type="single"
                collapsible
                className="w-full space-y-3"
                value={openAccordionItem}
                onValueChange={setOpenAccordionItem}
              >
                {fields.map((item, index) => (
                  <AccordionItem
                    key={item.id} 
                    value={item.id!} // Ensure item.id is used for value
                    className="border rounded-lg shadow-sm bg-card overflow-hidden"
                    data-radix-accordion-item
                  >
                    <AccordionTrigger className="p-4 hover:no-underline data-[state=open]:border-b">
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="text-lg font-semibold text-primary">Extinguidor #{index + 1}</span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation(); 
                            remove(index);
                          }}
                          aria-label={`Eliminar extinguidor ${index + 1}`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); remove(index);}}}
                          className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <div className="p-4 md:p-6 space-y-4">
                        <FormField
                          control={form.control}
                          name={`extinguishers.${index}.ubicacion`}
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
                            name={`extinguishers.${index}.capacidadLibras`}
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
                            name={`extinguishers.${index}.modelo`}
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
                            name={`extinguishers.${index}.agenteExtintor`}
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
                            name={`extinguishers.${index}.indicadorPresion`}
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
                            name={`extinguishers.${index}.cargaExtintores`}
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
                          <FormLabel className="text-md font-semibold mb-2 block">Lista de Verificación:</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {checklistFormItems.map(checkItem => (
                              <FormField
                                key={checkItem.name}
                                control={form.control}
                                name={`extinguishers.${index}.${checkItem.name}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{checkItem.label}</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value || "P"} 
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
                          name={`extinguishers.${index}.observacionesGenerales`}
                          render={({ field }) => (
                            <FormItem className="pt-2">
                              <FormLabel>Observaciones Generales del Extinguidor</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Anotaciones adicional