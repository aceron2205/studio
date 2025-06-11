
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Trash2, Camera, XCircle } from "lucide-react"; // Added XCircle

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
} from "@/components/ui/alert-dialog";
import { ImageUploadDialog } from "./image-upload-dialog"; // Import the dialog

const ExtinguisherSchema = z.object({
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
  photoEvidenceDataUrl: z.string().optional(), // To store the image data URI
});

export type ExtinguisherFormData = z.infer<typeof ExtinguisherSchema>;

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

interface ExtinguisherEditorFormProps {
  initialData: Partial<ExtinguisherFormData>;
  onSubmitSuccess: (data: ExtinguisherFormData) => void; 
  extinguisherId: string; 
  isNew?: boolean;
}

export function ExtinguisherEditorForm({ initialData, onSubmitSuccess, extinguisherId, isNew = false }: ExtinguisherEditorFormProps) {
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = React.useState(false);
  const [photoEvidencePreview, setPhotoEvidencePreview] = React.useState<string | null>(initialData.photoEvidenceDataUrl || null);

  const form = useForm<ExtinguisherFormData>({
    resolver: zodResolver(ExtinguisherSchema),
    defaultValues: {
      ...initialData,
      ubicacion: initialData.ubicacion || "",
      capacidadLibras: initialData.capacidadLibras || "",
      modelo: initialData.modelo || "",
      agenteExtintor: initialData.agenteExtintor || "",
      instrucciones: initialData.instrucciones || "",
      calcomaniasPlacas: initialData.calcomaniasPlacas || "",
      selloSeguridad: initialData.selloSeguridad || "",
      pinPasador: initialData.pinPasador || "",
      pinturaBuenEstado: initialData.pinturaBuenEstado || "",
      cilindroMangueraBoquillas: initialData.cilindroMangueraBoquillas || "",
      alturaAdecuada: initialData.alturaAdecuada || "",
      indicadorPresion: initialData.indicadorPresion || "",
      accesoLibre: initialData.accesoLibre || "",
      cargaExtintores: initialData.cargaExtintores || "",
      observacionesGenerales: initialData.observacionesGenerales || "",
      photoEvidenceDataUrl: initialData.photoEvidenceDataUrl || "",
    },
  });

  const handleImageSelected = (dataUrl: string) => {
    setPhotoEvidencePreview(dataUrl);
    form.setValue("photoEvidenceDataUrl", dataUrl);
    setIsImageUploadDialogOpen(false);
  };

  const handleClearPhotoPreview = () => {
    setPhotoEvidencePreview(null);
    form.setValue("photoEvidenceDataUrl", "");
  };

  function onSubmit(data: ExtinguisherFormData) {
    console.log(`Extinguisher data (ID: ${extinguisherId}, IsNew: ${isNew}):`, data);
    toast({
      title: isNew ? "Extinguidor Creado" : "Extinguidor Actualizado",
      description: isNew ? "El nuevo extinguidor ha sido registrado." : "Los datos del extinguidor han sido guardados.",
      variant: "default",
    });
    onSubmitSuccess(data); 
  }

  const confirmDarDeBaja = () => {
    console.log(`Confirmado dar de baja extinguidor: ${extinguisherId}`);
    toast({
      title: "Extinguidor Dado de Baja",
      description: `El extinguidor ID: ${extinguisherId} ha sido marcado para baja. (Simulado)`,
      variant: "destructive",
    });
  };


  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {isNew ? "Nuevo Extinguidor" : "Editar Extinguidor"}
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
                <FormLabel className="text-md font-semibold mb-2 block">Lista de Verificación:</FormLabel>
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
                    <FormLabel>Observaciones Generales del Extinguidor</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Anotaciones adicionales sobre este extinguidor..."
                        className="resize-y min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Evidence Section */}
              <div className="pt-2 space-y-3">
                <FormLabel className="text-md font-semibold block">Fotos de Evidencia</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImageUploadDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {photoEvidencePreview ? "Cambiar Foto" : "Agregar Foto"}
                </Button>
                {photoEvidencePreview && (
                  <div className="mt-4 relative w-48 h-48 group">
                    <img
                      src={photoEvidencePreview}
                      alt="Evidencia del extinguidor"
                      className="rounded-md object-cover w-full h-full"
                      data-ai-hint="extinguisher photo"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleClearPhotoPreview}
                      aria-label="Eliminar foto actual"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                 {!photoEvidencePreview && (
                  <div 
                    className="mt-2 w-full min-h-[120px] border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center text-muted-foreground p-4"
                    data-ai-hint="photo gallery"
                  >
                    <Camera className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-sm">Sin foto de evidencia</span>
                  </div>
                )}
              </div>
              
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end pt-8 border-t space-y-2 sm:space-y-0 sm:space-x-3">
              {!isNew && (
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
                        Esta acción marcará el extinguidor para darlo de baja. No podrás deshacer esta acción fácilmente.
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
                type="submit" 
                size="lg" 
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting 
                  ? (isNew ? "Creando..." : "Guardando...") 
                  : (isNew ? "Crear Extinguidor" : "Guardar Cambios")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ImageUploadDialog
        isOpen={isImageUploadDialogOpen}
        onOpenChange={setIsImageUploadDialogOpen}
        onImageSelected={handleImageSelected}
        imagePreview={photoEvidencePreview}
        onClearPreview={handleClearPhotoPreview}
      />
    </>
  );
}

