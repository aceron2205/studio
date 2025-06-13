
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
import { Label } from "@/components/ui/label";

const mmYYYYFormat = /^(0[1-9]|1[0-2])-\d{4}$/;
const mmYYYYMessage = "Formato debe ser MM-YYYY (ej: 06-2024)";
const requiredRadioMessage = "Seleccione una opción.";

const ExtinguisherAuditSchema = z.object({
  // Fields for Step 1 - General Info (some might be pre-filled, some editable during audit)
  ubicacion: z.string().min(1, "La ubicación es requerida.").optional(),
  capacidadLibras: z.string().min(1, "La capacidad es requerida.").optional(),
  agenteExtintor: z.string().min(1, "El agente extintor es requerido.").optional(),
  modelo: z.string().min(1, "El modelo es requerido.").optional(),
  fabricacionDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  ultimoServicioDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  pruebaHidrostaticaDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }),
  cargaExtintores: z.string().min(1, "El estado de carga es requerido"), 

  // Fields for Step 1 - Audit Questions (now styled like wireframe)
  ubicacionDesignado: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  visibleSinObstrucciones: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  manometroZonaVerde: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pasadorSelloIntactos: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  danosFisicos: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  
  // Fields for Step 2 - Checklist (now Sí/No radio buttons)
  instrucciones: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  calcomaniasPlacas: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  selloSeguridad: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pinPasador: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pinturaBuenEstado: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  cilindroMangueraBoquillas: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  alturaAdecuada: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  accesoLibre: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  
  // Fields for Step 3 & 4
  observacionesGenerales: z.string().optional(), // This is used in step 1 and step 4, consider distinct fields if necessary
  articulosReemplazadosNotas: z.string().optional(),
  photoEvidenceDataUrls: z.array(z.string()).optional(),
});

export type ExtinguisherAuditFormData = z.infer<typeof ExtinguisherAuditSchema>;

const checklistFormItems = [
    { name: "instrucciones" as const, label: "Instrucciones legibles y a la vista" },
    { name: "calcomaniasPlacas" as const, label: "Calcomanías/placas legibles y en buen estado" },
    { name: "selloSeguridad" as const, label: "Sello de seguridad intacto" }, // Adjusted label for clarity
    { name: "pinPasador" as const, label: "Pin o pasador de seguridad en su lugar y sin manipular" }, // Adjusted label
    { name: "pinturaBuenEstado" as const, label: "Pintura en buen estado" },
    { name: "cilindroMangueraBoquillas" as const, label: "Cilindro, manguera y boquillas en buen estado y sin daños" }, // Adjusted label
    { name: "alturaAdecuada" as const, label: "Altura de instalación adecuada" }, // Adjusted label
    { name: "accesoLibre" as const, label: "Acceso libre de obstrucciones" },
];

const stepTitles: Record<number, string> = {
  1: "Información General y Estado",
  2: "Lista de Verificación Detallada", // Updated Step 2 title
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

// Helper function to process initial values for radio groups
const getInitialRadioValue = (value: string | undefined) => {
  if (value === "Sí" || value === "No") return value;
  return ""; // Default to empty string if initial value is not Sí/No (e.g., "P" or "N/A")
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
      // Step 1 Radio Questions
      ubicacionDesignado: getInitialRadioValue(initialData.ubicacionDesignado),
      visibleSinObstrucciones: getInitialRadioValue(initialData.visibleSinObstrucciones),
      manometroZonaVerde: getInitialRadioValue(initialData.manometroZonaVerde),
      pasadorSelloIntactos: getInitialRadioValue(initialData.pasadorSelloIntactos),
      danosFisicos: getInitialRadioValue(initialData.danosFisicos),
      // Step 2 Radio Questions (formerly checklist)
      instrucciones: getInitialRadioValue(initialData.instrucciones),
      calcomaniasPlacas: getInitialRadioValue(initialData.calcomaniasPlacas),
      selloSeguridad: getInitialRadioValue(initialData.selloSeguridad),
      pinPasador: getInitialRadioValue(initialData.pinPasador),
      pinturaBuenEstado: getInitialRadioValue(initialData.pinturaBuenEstado),
      cilindroMangueraBoquillas: getInitialRadioValue(initialData.cilindroMangueraBoquillas),
      alturaAdecuada: getInitialRadioValue(initialData.alturaAdecuada),
      accesoLibre: getInitialRadioValue(initialData.accesoLibre),
      // Other fields
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
      const hydroDate = new Date(year, month, 0); 
      const currentDate = new Date();
      currentDate.setHours(0,0,0,0); 

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

  const stepFields: Record<number, (keyof ExtinguisherAuditFormData)[]> = {
    1: ["ubicacion", "capacidadLibras", "agenteExtintor", "modelo", "fabricacionDate", "ultimoServicioDate", "pruebaHidrostaticaDate", "cargaExtintores", "ubicacionDesignado", "visibleSinObstrucciones", "manometroZonaVerde", "pasadorSelloIntactos", "danosFisicos", "observacionesGenerales"],
    2: ["instrucciones", "calcomaniasPlacas", "selloSeguridad", "pinPasador", "pinturaBuenEstado", "cilindroMangueraBoquillas", "alturaAdecuada", "accesoLibre"],
    3: ["articulosReemplazadosNotas"],
    4: ["photoEvidenceDataUrls", "observacionesGenerales"], // Note: observacionesGenerales can be in step 1 and 4.
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    let isValid = true;
    if (fieldsToValidate) {
        isValid = await form.trigger(fieldsToValidate);
    }
    
    if (!isValid && currentStep < totalSteps) {
        toast({
            variant: "destructive",
            title: "Campos Incompletos",
            description: "Por favor, complete todos los campos requeridos en este paso antes de continuar.",
        });
        // Find first invalid field and focus
        const errors = form.formState.errors;
        const firstErrorField = fieldsToValidate.find(field => errors[field]);
        if (firstErrorField) {
            form.setFocus(firstErrorField);
        }
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

  const renderRadioGroupField = (name: keyof ExtinguisherAuditFormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="py-3 border-b last:border-b-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <FormLabel className="text-base text-foreground mb-2 sm:mb-0 sm:flex-1 sm:pr-4">{label}</FormLabel>
            <div className="flex items-center space-x-6">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="Sí" id={`${field.name}-si`} />
                    <Label htmlFor={`${field.name}-si`} className="font-normal text-foreground">Sí</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`${field.name}-no`} />
                    <Label htmlFor={`${field.name}-no`} className="font-normal text-foreground">No</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <FormMessage className="mt-1 sm:ml-[calc(50%+1rem)]" /> 
        </FormItem>
      )}
    />
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between text-lg">
                <span className="flex items-center text-primary font-semibold">
                    <ShieldAlert className="w-5 h-5 mr-2"/>ID del Equipo:
                </span>
                <span className="font-bold text-foreground">{extinguisherId}</span>
            </div>

            <h3 className="text-lg font-semibold text-muted-foreground -mb-2">Datos Generales del Extinguidor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Cliente / Sitio:</span><span className="text-foreground">{form.getValues("ubicacion") || "N/A"}</span></div>
              <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Ubicación Específica:</span><span className="text-foreground">{form.getValues("ubicacion") || "N/A"}</span></div>
              <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Agente Extintor:</span><span className="text-foreground">{form.getValues("agenteExtintor") || "N/A"}</span></div>
              <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Capacidad:</span><span className="text-foreground">{form.getValues("capacidadLibras") || "N/A"}</span></div>
              <div className="flex justify-between items-center py-1.5 border-b md:col-span-2"><span className="font-medium text-muted-foreground">Modelo:</span><span className="text-foreground">{form.getValues("modelo") || "N/A"}</span></div>
            </div>

            <div className="pt-2">
              <h4 className="text-lg font-semibold text-muted-foreground mb-2 flex items-center"><Calendar className="w-5 h-5 mr-2"/>Fechas Clave</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Fabricación:</span><span className="text-foreground">{form.getValues("fabricacionDate") || "N/A"}</span></div>
                <div className="flex justify-between items-center py-1.5 border-b"><span className="font-medium text-muted-foreground">Último Servicio:</span><span className="text-foreground">{form.getValues("ultimoServicioDate") || "N/A"}</span></div>
                <div className="flex justify-between items-center py-1.5 border-b md:col-span-2">
                  <span className="font-medium text-muted-foreground">Prueba Hidrostática:</span>
                  <span className="text-foreground flex items-center">
                    {form.getValues("pruebaHidrostaticaDate") || "N/A"}
                    {showVencePronto && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            VENCE PRONTO
                        </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 pt-4">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Inspección Rápida</h3>
                {renderRadioGroupField("ubicacionDesignado", "¿Está en su lugar designado?")}
                {renderRadioGroupField("visibleSinObstrucciones", "¿Está visible y sin obstrucciones?")}
                {renderRadioGroupField("manometroZonaVerde", "¿Está el manómetro en la zona verde?")}
                {renderRadioGroupField("pasadorSelloIntactos", "¿Están el pasador y el sello de seguridad intactos?")}
                {renderRadioGroupField("danosFisicos", "¿Tiene algún daño físico evidente (golpes, corrosión, fugas)?")}
            </div>

            <div className="pt-4">
              <FormField control={form.control} name="observacionesGenerales" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-foreground">Observaciones de Inspección Rápida</FormLabel>
                    <FormControl><Textarea placeholder="Anotaciones sobre la inspección rápida..." className="min-h-[80px] bg-background rounded-md border" {...field} /></FormControl><FormMessage />
                  </FormItem>)} />
            </div>
          </div>
        );

      case 2: 
        return (
          <div className="space-y-1">
            {checklistFormItems.map(checkItem => (
              renderRadioGroupField(checkItem.name, checkItem.label)
            ))}
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
                  <FormLabel className="text-foreground">Notas sobre Artículos Reemplazados</FormLabel>
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
              name="observacionesGenerales" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Observaciones Generales de la Auditoría</FormLabel>
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
              <FormLabel className="text-md font-semibold block mb-2 text-foreground">Fotos de Evidencia ({photoEvidencePreviews.length})</FormLabel>
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
                  className="w-full flex items-center justify-center border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary py-6"
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
          <CardTitle className="text-xl text-center flex items-center justify-center gap-2 text-primary">
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
            <CardFooter className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t mt-auto space-y-3 sm:space-y-0 sm:space-x-2 p-4 md:p-6 bg-muted/30">
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
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90"
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

