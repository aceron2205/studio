
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Camera, FileCheck, Trash2, Check, ArrowLeft, ArrowRight, Info, Wrench, FileImage, ListChecks, XCircle, PlusCircle, Building, Calendar, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ImageUploadDialog } from "./image-upload-dialog";

const mmYYYYFormat = /^(0[1-9]|1[0-2])-\d{4}$/;
const mmYYYYMessage = "Formato debe ser MM-YYYY (ej: 06-2024)";

const ExtinguisherAuditSchema = z.object({
  // Fields for Step 1 - General Info (some might be pre-filled, some editable during audit)
  ubicacion: z.string().min(1, "La ubicación es requerida.").optional(),
  capacidadLibras: z.string().min(1, "La capacidad es requerida.").optional(),
  agenteExtintor: z.string().min(1, "El agente extintor es requerido.").optional(),
  modelo: z.string().min(1, "El modelo es requerido.").optional(),
  fabricacionDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  ultimoServicioDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  pruebaHidrostaticaDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  cargaExtintores: z.string().min(1, "El estado de carga es requerido"), // This was already part of the schema for audit specific state

  // Fields for Step 1 - Audit Questions
  ubicacionDesignado: z.enum(["Sí", "No", "N/A"], { required_error: "Seleccione una opción para la ubicación." }),
  visibleSinObstrucciones: z.enum(["Sí", "No", "N/A"], { required_error: "Seleccione una opción para la visibilidad." }),
  manometroZonaVerde: z.enum(["Sí", "No", "N/A"], { required_error: "Seleccione una opción para el manómetro." }),
  pasadorSelloIntactos: z.enum(["Sí", "No", "N/A"], { required_error: "Seleccione una opción para el pasador y sello." }),
  danosFisicos: z.enum(["Sí", "No", "N/A"], { required_error: "Seleccione una opción para daños físicos." }),
  
  // Fields for Step 2 - Checklist
  instrucciones: z.string().optional(),
  calcomaniasPlacas: z.string().optional(),
  selloSeguridad: z.string().optional(),
  pinPasador: z.string().optional(),
  pinturaBuenEstado: z.string().optional(),
  cilindroMangueraBoquillas: z.string().optional(),
  alturaAdecuada: z.string().optional(),
  accesoLibre: z.string().optional(),
  
  // Fields for Step 3 & 4
  observacionesGenerales: z.string().optional(),
  articulosReemplazadosNotas: z.string().optional(),
  photoEvidenceDataUrls: z.array(z.string()).optional(),
});

export type ExtinguisherAuditFormData = z.infer<typeof ExtinguisherAuditSchema>;

const checklistOptions = [
  { value: "C", label: "Conforme" },
  { value: "NC", label: "No Conforme" },
  { value: "NA", label: "No Aplica" },
  { value: "P", label: "Pendiente" },
];

const agenteExtintorOptions = [
  'Polvo Químico Seco (ABC)',
  'Dióxido de Carbono (CO2)',
  'Agua Pulverizada',
  'Espuma AFFF',
  'Polvo Químico Seco (PQS)',
  'Agente Limpio (Halotron, etc.)',
  'Polvo Tipo D (Metales)',
  'Otro',
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

const stepTitles: Record<number, string> = {
  1: "Información General y Estado",
  2: "Lista de Verificación",
  3: "Artículos Reemplazados",
  4: "Evidencia y Observaciones",
};


interface ExtinguisherAuditFormProps {
  initialData: Partial<ExtinguisherAuditFormData>;
  onSubmitSuccess: (data: ExtinguisherAuditFormData) => void;
  extinguisherId: string;
}

const AuditStepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 my-4 px-2">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ease-in-out",
                currentStep === step
                  ? "bg-primary text-primary-foreground border-primary scale-110"
                  : currentStep > step
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              {currentStep > step ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
            </div>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "flex-1 h-1 rounded transition-all duration-300 ease-in-out",
                currentStep > step + 0.5 ? "bg-green-600" : currentStep > step ? "bg-green-600/50" : "bg-border"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export function ExtinguisherAuditForm({ initialData, onSubmitSuccess, extinguisherId }: ExtinguisherAuditFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = React.useState(false);
  const [photoEvidencePreviews, setPhotoEvidencePreviews] = React.useState<string[]>(initialData.photoEvidenceDataUrls || []);


  const form = useForm<ExtinguisherAuditFormData>({
    resolver: zodResolver(ExtinguisherAuditSchema),
    defaultValues: {
      ubicacion: initialData.ubicacion || "",
      capacidadLibras: initialData.capacidadLibras || "",
      agenteExtintor: initialData.agenteExtintor || "",
      modelo: initialData.modelo || "",
      fabricacionDate: initialData.fabricacionDate || "",
      ultimoServicioDate: initialData.ultimoServicioDate || "",
      pruebaHidrostaticaDate: initialData.pruebaHidrostaticaDate || "",
      cargaExtintores: initialData.cargaExtintores || "Pendiente Chequeo",
      ubicacionDesignado: initialData.ubicacionDesignado || "N/A",
      visibleSinObstrucciones: initialData.visibleSinObstrucciones || "N/A",
      manometroZonaVerde: initialData.manometroZonaVerde || "N/A",
      pasadorSelloIntactos: initialData.pasadorSelloIntactos || "N/A",
      danosFisicos: initialData.danosFisicos || "N/A",
      instrucciones: initialData.instrucciones || "P",
      calcomaniasPlacas: initialData.calcomaniasPlacas || "P",
      selloSeguridad: initialData.selloSeguridad || "P",
      pinPasador: initialData.pinPasador || "P",
      pinturaBuenEstado: initialData.pinturaBuenEstado || "P",
      cilindroMangueraBoquillas: initialData.cilindroMangueraBoquillas || "P",
      alturaAdecuada: initialData.alturaAdecuada || "P",
      accesoLibre: initialData.accesoLibre || "P",
      observacionesGenerales: initialData.observacionesGenerales || "",
      articulosReemplazadosNotas: initialData.articulosReemplazadosNotas || "",
      photoEvidenceDataUrls: initialData.photoEvidenceDataUrls || [], 
    },
  });
  
  const pruebaHidrostaticaDateValue = form.watch("pruebaHidrostaticaDate");
  const [showVencePronto, setShowVencePronto] = React.useState(false);

  React.useEffect(() => {
    if (pruebaHidrostaticaDateValue && mmYYYYFormat.test(pruebaHidrostaticaDateValue)) {
      const [monthStr, yearStr] = pruebaHidrostaticaDateValue.split('-');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      // Use last day of the month for comparison to be safe
      const hydroDate = new Date(year, month, 0); 
      const currentDate = new Date();
      currentDate.setHours(0,0,0,0); // Normalize current date to start of day

      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(currentDate.getMonth() + 6);
      sixMonthsFromNow.setHours(0,0,0,0);

      setShowVencePronto(hydroDate <= sixMonthsFromNow && hydroDate >= currentDate);
    } else {
      setShowVencePronto(false);
    }
  }, [pruebaHidrostaticaDateValue]);


  const handleImagesSelected = (newDataUrls: string[]) => {
    const currentUrls = form.getValues("photoEvidenceDataUrls") || [];
    const updatedUrls = [...currentUrls, ...newDataUrls];
    setPhotoEvidencePreviews(updatedUrls);
    form.setValue("photoEvidenceDataUrls", updatedUrls);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedPreviews = photoEvidencePreviews.filter((_, index) => index !== indexToRemove);
    setPhotoEvidencePreviews(updatedPreviews);
    form.setValue("photoEvidenceDataUrls", updatedPreviews);
  };

  const handleClearAllPhotos = () => {
    setPhotoEvidencePreviews([]);
    form.setValue("photoEvidenceDataUrls", []);
  };


  const handleNext = async () => {
    const isValid = await form.trigger(); 
    if (!isValid && currentStep < totalSteps) {
        toast({
            variant: "destructive",
            title: "Campos Incompletos",
            description: "Por favor, complete todos los campos requeridos en este paso antes de continuar.",
        });
        return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  function onSubmit(data: ExtinguisherAuditFormData) {
    console.log(`Extinguisher audit data (ID: ${extinguisherId}):`, data);
    toast({
      title: "Auditoría Guardada",
      description: `Los datos de la auditoría para el extinguidor ID: ${extinguisherId} han sido guardados.`,
      variant: "default",
    });
    onSubmitSuccess(data);
  }

  const confirmDarDeBaja = () => {
    console.log(`Confirmado dar de baja extinguidor: ${extinguisherId} desde el formulario de auditoría.`);
    toast({
      title: "Extinguidor Marcado para Baja",
      description: `El extinguidor ID: ${extinguisherId} ha sido marcado para baja. (Simulado)`,
      variant: "destructive",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-4 p-3 bg-muted/50 rounded-md border border-border">
              <h3 className="text-lg font-semibold text-primary flex items-center"><ShieldAlert className="w-5 h-5 mr-2"/>ID del Equipo: {extinguisherId}</h3>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 -mb-2">Datos Generales del Extinguidor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Building className="w-4 h-4 mr-1 text-muted-foreground"/>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Oficina principal..." {...field} />
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
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar agente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {agenteExtintorOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacidadLibras"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 10 lbs, 5 kg" {...field} />
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
                      <Input placeholder="Ej: Amerex B402" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><Calendar className="w-5 h-5 mr-2 text-muted-foreground"/>Fechas Clave</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="fabricacionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricación</FormLabel>
                      <FormControl>
                        <Input placeholder="MM-YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ultimoServicioDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Último Servicio</FormLabel>
                      <FormControl>
                        <Input placeholder="MM-YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pruebaHidrostaticaDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">Prueba Hidrostática
                        {showVencePronto && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                VENCE PRONTO
                            </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="MM-YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
             <FormField
                control={form.control}
                name="cargaExtintores"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 pt-2">
                    <FormLabel>Estado de Carga / Próxima Recarga</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Cargado (MM/AAAA), Vencido (MM/AAAA)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="space-y-4 pt-6">
              <h2 className="text-lg font-semibold text-gray-800">1. Ubicación y Acceso (Auditoría)</h2>
              <FormField control={form.control} name="ubicacionDesignado" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-gray-700">¿Está en su lugar designado?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">No</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="N/A" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">N/A</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage />
                  </FormItem>)} />
              <FormField control={form.control} name="visibleSinObstrucciones" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-gray-700">¿Está visible y sin obstrucciones?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">No</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="N/A" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">N/A</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage />
                  </FormItem>)} />
            </div>
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-gray-800">2. Estado Operativo (Auditoría)</h2>
              <FormField control={form.control} name="manometroZonaVerde" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-gray-700">¿Está el manómetro en la zona verde?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">No</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="N/A" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">N/A</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage />
                  </FormItem>)} />
              <FormField control={form.control} name="pasadorSelloIntactos" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-gray-700">¿Están el pasador y el sello de seguridad intactos?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">No</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="N/A" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">N/A</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage />
                  </FormItem>)} />
            </div>
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-gray-800">3. Condición Física (Auditoría)</h2>
              <FormField control={form.control} name="danosFisicos" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium text-gray-700">¿Tiene algún daño físico evidente (golpes, corrosión, fugas)?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="Sí" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">Sí</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">No</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm"><FormControl><RadioGroupItem value="N/A" /></FormControl><FormLabel className="font-normal flex-grow text-gray-800">N/A</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage />
                  </FormItem>)} />
            </div>
            <div className="pt-4">
              <FormField control={form.control} name="observacionesGenerales" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-gray-700">Observaciones Adicionales de Auditoría</FormLabel>
                    <FormControl><Textarea placeholder="Anotaciones adicionales sobre la inspección..." className="min-h-[100px] bg-white rounded-md border border-gray-200 shadow-sm" {...field} /></FormControl><FormMessage />
                  </FormItem>)} />
            </div>
          </div>
        );

      case 2: 
        return (
          <div>
            <FormLabel className="text-md font-semibold mb-3 block text-center">Revisión de Componentes y Estado</FormLabel>
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
        );
      case 3: 
        return (
          <div>
            <FormField
              control={form.control}
              name="articulosReemplazadosNotas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas sobre Artículos Reemplazados</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detallar manómetros, mangueras, sellos, agente extintor, etc., que fueron reemplazados..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => toast({ title: "Funcionalidad Pendiente", description: "Agregar artículos detalladamente aún no está implementado."})}>
              <Wrench className="mr-2 h-4 w-4" />
              Añadir Artículo Reemplazado (Detallado)
            </Button>
          </div>
        );
      case 4: 
        return (
          <div className="space-y-6">
             <FormField
              control={form.control}
              name="observacionesGenerales" // This is duplicated, consider if Step 1 obs are general and these are audit-specific
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones Generales de la Auditoría (Paso 4)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anotaciones finales sobre la inspección de este extinguidor..."
                      className="resize-y min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel className="text-md font-semibold block mb-2">Fotos de Evidencia ({photoEvidencePreviews.length})</FormLabel>
              <div className="space-y-4">
                {photoEvidencePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" data-ai-hint="evidence photo gallery">
                    {photoEvidencePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative w-full aspect-square group shrink-0">
                        <img
                          src={previewUrl}
                          alt={`Evidencia de auditoría ${index + 1}`}
                          className="rounded-md object-cover w-full h-full"
                          data-ai-hint="evidence photo"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => handleRemovePhoto(index)}
                          aria-label={`Eliminar foto ${index + 1}`}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                 <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImageUploadDialogOpen(true)}
                  className="w-full flex items-center justify-center border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary"
                  aria-label="Agregar más fotos de evidencia"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Agregar Foto
                </Button>
                {photoEvidencePreviews.length > 0 && (
                     <Button onClick={handleClearAllPhotos} className="w-full sm:w-auto mt-2" variant="outline" type="button">
                        Eliminar todas las fotos
                      </Button>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const currentStepIcon = () => {
    switch (currentStep) {
      case 1: return <Info className="h-5 w-5 mr-2" />;
      case 2: return <ListChecks className="h-5 w-5 mr-2" />;
      case 3: return <Wrench className="h-5 w-5 mr-2" />;
      case 4: return <FileImage className="h-5 w-5 mr-2" />;
      default: return <FileCheck className="h-5 w-5 mr-2"/>;
    }
  };


  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
            Auditoría de Extinguidor
          </CardTitle>
          <CardDescription className="text-center">Siga los pasos para completar la auditoría del extinguidor.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
            <CardContent className="space-y-4 p-4 md:p-6 flex-grow">
              <AuditStepper currentStep={currentStep} totalSteps={totalSteps} />
              <div className="text-center my-3">
                  <h3 className="text-lg font-semibold text-primary flex items-center justify-center">
                      {currentStepIcon()}
                      Paso {currentStep}: {stepTitles[currentStep]}
                  </h3>
              </div>
              <div className="min-h-[250px] py-4">
                  {renderStepContent()}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t mt-auto space-y-3 sm:space-y-0 sm:space-x-2 p-4 md:p-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {currentStep === totalSteps && (
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button
                          type="button"
                          variant="destructive"
                          className="w-full sm:w-auto order-first sm:order-none"
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
                  )}
                  <Button
                      type="button"
                      size="lg"
                      onClick={handleNext}
                      disabled={form.formState.isSubmitting}
                      className="w-full sm:w-auto"
                  >
                  {currentStep === totalSteps ? (
                      <> <Save className="mr-2 h-5 w-5" /> {form.formState.isSubmitting ? "Guardando..." : "Guardar Auditoría"} </>
                  ) : (
                      <> {form.formState.isSubmitting ? "Procesando..." : "Siguiente"} <ArrowRight className="ml-2 h-4 w-4" /> </>
                  )}
                  </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ImageUploadDialog
        isOpen={isImageUploadDialogOpen}
        onOpenChange={setIsImageUploadDialogOpen}
        onImagesSelected={handleImagesSelected}
        imagePreviews={photoEvidencePreviews}
        onRemoveImage={handleRemovePhoto}
        onClearAllImages={handleClearAllPhotos}
      />
    </>
  );
}
