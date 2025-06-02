
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Camera, FileCheck, Trash2, Check, ArrowLeft, ArrowRight, Info, Wrench, FileImage, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const ExtinguisherAuditSchema = z.object({
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
  articulosReemplazadosNotas: z.string().optional(),
  // photoEvidence: z.any().optional(), // Placeholder for future photo data
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

  const form = useForm<ExtinguisherAuditFormData>({
    resolver: zodResolver(ExtinguisherAuditSchema),
    defaultValues: {
      ubicacion: initialData.ubicacion || "",
      capacidadLibras: initialData.capacidadLibras || "",
      modelo: initialData.modelo || "",
      agenteExtintor: initialData.agenteExtintor || "",
      instrucciones: initialData.instrucciones || "P",
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
      articulosReemplazadosNotas: initialData.articulosReemplazadosNotas || "",
    },
  });

  const handleNext = async () => {
    // Optional: Trigger validation for current step's fields
    // const fieldsToValidate: (keyof ExtinguisherAuditFormData)[] = [];
    // if (currentStep === 1) fieldsToValidate.push('ubicacion', 'capacidadLibras', ...);
    // const isValid = await form.trigger(fieldsToValidate);
    // if (!isValid) return;

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
  };

  const handleQuickAction = (action: 'Bueno' | 'Recargar' | 'Reemplazar') => {
    toast({
      title: `Acción Rápida: ${action}`,
      description: `Se ha registrado la acción "${action}" para este extinguidor. (Simulado)`,
    });
    // Future: Implement logic to update form fields based on action
    // For example, for 'Bueno', set all checklist items to 'C'
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Información General y Estado Rápido
        return (
          <div className="space-y-6">
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
            <div>
              <FormLabel className="text-md font-semibold mb-2 block">Acciones Rápidas</FormLabel>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => handleQuickAction('Bueno')}>Bueno</Button>
                <Button type="button" variant="outline" onClick={() => handleQuickAction('Recargar')}>Recargar</Button>
                <Button type="button" variant="outline" onClick={() => handleQuickAction('Reemplazar')}>Reemplazar</Button>
              </div>
            </div>
          </div>
        );
      case 2: // Lista de Verificación
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
      case 3: // Artículos Reemplazados
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
      case 4: // Evidencia y Observaciones Finales
        return (
          <div className="space-y-6">
             <FormField
              control={form.control}
              name="observacionesGenerales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones Generales de la Auditoría</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anotaciones adicionales sobre la inspección de este extinguidor..."
                      className="resize-y min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel className="text-md font-semibold block mb-2">Fotos de Evidencia (Auditoría)</FormLabel>
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
                className="mt-3 w-full min-h-[120px] border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center text-muted-foreground p-4"
                data-ai-hint="photo evidence"
              >
                <Camera className="h-10 w-10 mb-2 opacity-50" />
                <span className="text-sm">Previsualización de Fotos de Auditoría</span>
                <span className="text-xs">(Aquí se mostrarán las fotos cargadas)</span>
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
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
           {/* Icon is now part of the step description below */}
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
            <div className="min-h-[250px] py-4"> {/* Added min-height to content area */}
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
  );
}

