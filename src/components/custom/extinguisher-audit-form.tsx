
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Camera, FileCheck, Trash2, Check, ArrowLeft, ArrowRight, Info, Wrench, FileImage, ListChecks, XCircle, PlusCircle, Building, Calendar, ShieldAlert } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";


const mmYYYYFormat = /^(0[1-9]|1[0-2])-\d{4}$/;
const mmYYYYMessage = "Formato debe ser MM-YYYY (ej: 06-2024)";
const requiredRadioMessage = "Seleccione una opción.";

const ExtinguisherAuditSchema = z.object({
  // Fields for Step 1 - General Info (some might be pre-filled, some editable during audit)
  ubicacion: z.string().min(1, "La ubicación es requerida.").optional(), // Made optional
  capacidadLibras: z.string().min(1, "La capacidad es requerida.").optional(), // Made optional
  agenteExtintor: z.string().min(1, "El agente extintor es requerido.").optional(), // Made optional
  modelo: z.string().min(1, "El modelo es requerido.").optional(), // Made optional
  fabricacionDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }), // Made optional
  ultimoServicioDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }), // Made optional
  pruebaHidrostaticaDate: z.string().optional().refine(val => !val || mmYYYYFormat.test(val), { message: mmYYYYMessage }), // Made optional
  cargaExtintores: z.string().min(1, "El estado de carga es requerido").optional(), // Made optional
  
  // Fields for Step 1 - Audit Questions (now styled like wireframe)
  ubicacionDesignado: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  visibleSinObstrucciones: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  manometroZonaVerde: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pasadorSelloIntactos: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  danosFisicos: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  instrucciones: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  calcomaniasPlacas: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  selloSeguridad: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pinPasador: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  pinturaBuenEstado: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  cilindroMangueraBoquillas: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  alturaAdecuada: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  accesoLibre: z.enum(["Sí", "No"], { required_error: requiredRadioMessage }),
  observacionesGenerales: z.string().optional(),
  articulosReemplazados: z.object({
    sello: z.boolean().optional().default(false),
    pasador: z.boolean().optional().default(false),
    etiqueta: z.boolean().optional().default(false),
    correaManguera: z.boolean().optional().default(false),
    manguera: z.boolean().optional().default(false),
    manometro: z.boolean().optional().default(false),
    soporte: z.boolean().optional().default(false),
    recargaAgente: z.boolean().optional().default(false),
    extintorCompleto: z.boolean().optional().default(false),
  }).optional(),
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

const replaceableItems = [
  { id: "sello" as const, label: "Sello de Seguridad (Precinto)" },
  { id: "pasador" as const, label: "Pasador de Seguridad (Pin)" },
  { id: "etiqueta" as const, label: "Etiqueta de Servicio Anual" },
  { id: "correaManguera" as const, label: "Correa o Seguro de Manguera" },
  { id: "manguera" as const, label: "Manguera y/o Boquilla" },
  { id: "manometro" as const, label: "Manómetro de Presión" },
  { id: "soporte" as const, label: "Soporte de Montaje (Gancho)" },
  { id: "recargaAgente" as const, label: "Recarga de Agente Extintor" },
  { id: "extintorCompleto" as const, label: "Extintor Completo" },
];

const stepTitles: Record<number, string> = {
  1: "Información General y Estado",
  2: "Lista de Verificación Detallada",
  3: "Artículos Reemplazados y Servicios",
  4: "Evidencia y Observaciones",
};


interface ExtinguisherAuditFormProps {
  initialData: Partial<ExtinguisherAuditFormData>;
  onSubmitSuccess: (data: ExtinguisherAuditFormData) => void;
  extinguisherId: string;
  onStepChange?: (currentStep: number, totalSteps: number) => void;
}


// Helper function to process initial values for radio groups
export const getInitialRadioValue = (value: string | undefined) => {
  if (value === "Sí" || value === "No") return value;
  return undefined; // Default to undefined if initial value is not Sí/No (e.g., "P" or "N/A")
};


export function ExtinguisherAuditForm({ initialData, onSubmitSuccess, extinguisherId, onStepChange }: ExtinguisherAuditFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = React.useState(false);
  const [photoEvidencePreviews, setPhotoEvidencePreviews] = React.useState<string[]>(initialData.photoEvidenceDataUrls || []);


  const form = useForm<ExtinguisherAuditFormData>({
    resolver: zodResolver(ExtinguisherAuditSchema),
    defaultValues: initialData,
});
  
  React.useEffect(() => {
    onStepChange?.(currentStep, totalSteps);
  }, [currentStep, totalSteps, onStepChange]);

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
    1: ["ubicacionDesignado", "visibleSinObstrucciones", "manometroZonaVerde", "pasadorSelloIntactos", "danosFisicos"],
    2: ["instrucciones", "calcomaniasPlacas", "selloSeguridad", "pinPasador", "pinturaBuenEstado", "cilindroMangueraBoquillas", "alturaAdecuada", "accesoLibre"],
    3: ["articulosReemplazados", "articulosReemplazadosNotas"],
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

  type RadioGroupFieldName = 
    | "ubicacionDesignado"
    | "visibleSinObstrucciones"
    | "manometroZonaVerde"
    | "pasadorSelloIntactos"
    | "danosFisicos"
    | "instrucciones"
    | "calcomaniasPlacas"
    | "selloSeguridad"
    | "pinPasador"
    | "pinturaBuenEstado"
    | "cilindroMangueraBoquillas"
    | "alturaAdecuada" | "accesoLibre";
  const renderRadioGroupField = (name: RadioGroupFieldName, label: string) => (
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
            <FormField
              key={checkItem.name} // <-- Se añade la KEY para solucionar el aviso de React
              control={form.control}
              name={checkItem.name}
              render={({ field }) => (
                <FormItem className="py-3 border-b last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <FormLabel className="text-base text-foreground mb-2 sm:mb-0 sm:flex-1 sm:pr-4">
                      {checkItem.label}
                    </FormLabel>
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
                      <div className="pt-4">
            </div>
                    </div>
                  </div>
                  <FormMessage className="mt-1 sm:ml-[calc(50%+1rem)]" /> 
                </FormItem>
              )}
            />
          ))}
        </div>
      );
      case 3: 
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Marque los artículos que fueron reemplazados o los servicios realizados:
            </h3>
            <div className="space-y-3">
              
              {/* Este código usa <Checkbox>, que es la herramienta correcta para este tipo de datos */}
              {replaceableItems.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`articulosReemplazados.${item.id}`} // Se conecta a cada propiedad booleana
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border bg-background/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground text-sm cursor-pointer">
                       {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
    
          {/* El campo para las notas adicionales se mantiene igual */}
          <FormField
            control={form.control}
            name="articulosReemplazadosNotas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-foreground">Notas Adicionales del Servicio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Añada detalles específicos sobre el servicio realizado, piezas, etc..."
                    className="resize-y min-h-[100px] bg-background rounded-md border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
          <div className="space-y-4 flex-grow">
            <div className="text-center my-3">
                <h3 className="text-lg font-semibold text-primary flex items-center justify-center">
                    {currentStepIcon()}
                     {stepTitles[currentStep]}
                </h3>
            </div>
            <div className="min-h-[250px] py-4">
                {renderStepContent()}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t mt-auto space-y-3 sm:space-y-0 sm:space-x-2 bg-muted/30">
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
          </div>
        </form>
      </Form>
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

