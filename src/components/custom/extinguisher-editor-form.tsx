
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, Trash2, Camera, XCircle, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { ImageUploadDialog } from "./image-upload-dialog";

const ExtinguisherSchema = z.object({
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  capacidadLibras: z.string().min(1, "La capacidad es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  agenteExtintor: z.string().min(1, "El agente extintor es requerido"),
  indicadorPresion: z.string().min(1, "El estado del indicador de presión es requerido"),
  cargaExtintores: z.string().min(1, "El estado de carga es requerido"),
  observacionesGenerales: z.string().optional(),
  photoEvidenceDataUrl: z.array(z.string()).optional(), // To store an array of image data URIs
});

export type ExtinguisherFormData = z.infer<typeof ExtinguisherSchema>;

interface ExtinguisherEditorFormProps {
  initialData: Partial<ExtinguisherFormData>;
  onSubmitSuccess: (data: ExtinguisherFormData) => void;
  extinguisherId: string;
  isNew?: boolean;
}

export function ExtinguisherEditorForm({ initialData, onSubmitSuccess, extinguisherId, isNew = false }: ExtinguisherEditorFormProps) {
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = React.useState(false);
  const [photoEvidencePreviews, setPhotoEvidencePreviews] = React.useState<string[]>(
    Array.isArray(initialData.photoEvidenceDataUrl) ? initialData.photoEvidenceDataUrl : []
  );

  const form = useForm<ExtinguisherFormData>({
    resolver: zodResolver(ExtinguisherSchema),
    defaultValues: {
      ubicacion: initialData.ubicacion || "",
      capacidadLibras: initialData.capacidadLibras || "",
      modelo: initialData.modelo || "",
      agenteExtintor: initialData.agenteExtintor || "",
      indicadorPresion: initialData.indicadorPresion || "",
      cargaExtintores: initialData.cargaExtintores || "",
      observacionesGenerales: initialData.observacionesGenerales || "",
      photoEvidenceDataUrl: Array.isArray(initialData.photoEvidenceDataUrl) ? initialData.photoEvidenceDataUrl : [],
    },
  });

  const handleImagesSelected = (newDataUrls: string[]) => {
    const currentUrls = form.getValues("photoEvidenceDataUrl") || [];
    const updatedUrls = [...currentUrls, ...newDataUrls];
    setPhotoEvidencePreviews(updatedUrls);
    form.setValue("photoEvidenceDataUrl", updatedUrls);
    // setIsImageUploadDialogOpen(false); // Keep dialog open if desired
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotoEvidencePreviews(prevPreviews => {
      const updatedPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      form.setValue("photoEvidenceDataUrl", updatedPreviews);
      return updatedPreviews;
    });
  };

  const handleClearAllPhotos = () => {
    setPhotoEvidencePreviews([]);
    form.setValue("photoEvidenceDataUrl", []);
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

              {/* Photo Evidence Section - Standardized */}
              <div className="pt-2 space-y-4">
                <FormLabel className="text-md font-semibold block mb-2">Fotos de Evidencia ({photoEvidencePreviews.length})</FormLabel>
                
                {photoEvidencePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" data-ai-hint="evidence photo gallery">
                    {photoEvidencePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative w-full aspect-square group shrink-0">
                        <img
                          src={previewUrl}
                          alt={`Evidencia ${index + 1}`}
                          className="rounded-md object-cover w-full h-full"
                          data-ai-hint="evidence photo"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full flex items-center justify-center z-10"
                          onClick={() => handleRemovePhoto(index)}
                          aria-label={`Eliminar imagen ${index + 1}`}
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
                     <Button onClick={handleClearAllPhotos} className="w-full sm:w-auto" variant="outline" type="button">
                        Eliminar todas las fotos
                      </Button>
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
        onImagesSelected={handleImagesSelected}
        imagePreviews={photoEvidencePreviews}
        onRemoveImage={handleRemovePhoto}
        onClearAllImages={handleClearAllPhotos}
      />
    </>
  );
}

    