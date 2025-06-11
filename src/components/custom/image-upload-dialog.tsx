
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label might not be needed directly if using buttons
import { Camera, Image as ImageIcon, X, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImagesSelected: (dataUrls: string[]) => void; // Changed to handle multiple new images
  imagePreviews: string[]; // Changed to an array to display existing images
  onRemoveImage: (index: number) => void; // New prop for removing individual images
  onClearAllImages: () => void; // New prop for clearing all images
}

export function ImageUploadDialog({
  isOpen,
  onOpenChange,
  onImagesSelected,
  imagePreviews,
  onRemoveImage,
  onClearAllImages
}: ImageUploadDialogProps) {
  const [showCameraView, setShowCameraView] = React.useState(false);
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stopCamera = React.useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Do not set showCameraView to false here, allow back button to handle it
    // setHasCameraPermission(null); // Let permission state persist until explicitly reset or re-checked
  }, [cameraStream]);

  React.useEffect(() => {
    // Cleanup camera stream if dialog is closed while camera is active
    if (!isOpen && cameraStream) {
      stopCamera();
      setShowCameraView(false); // Also ensure camera view is hidden
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stopCamera]); // Added cameraStream to dependencies as its state is checked

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImageUrls: string[] = [];
      let filesToProcess = files.length;
      let filesProcessedCount = 0;

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImageUrls.push(reader.result as string);
            filesProcessedCount++;
            if (filesProcessedCount === filesToProcess) {
              onImagesSelected(newImageUrls); // Pass only newly selected images
              // onOpenChange(false); // Keep dialog open to allow more actions or explicit close
            }
          };
          reader.onerror = () => {
            filesProcessedCount++;
             toast({ variant: "destructive", title: "Error de Lectura", description: `No se pudo leer el archivo: ${file.name}` });
            if (filesProcessedCount === filesToProcess) {
                if(newImageUrls.length > 0) onImagesSelected(newImageUrls);
                // onOpenChange(false);
            }
          }
          reader.readAsDataURL(file);
        } else {
            filesToProcess--; // Not an image, reduce count
            toast({ variant: "destructive", title: "Archivo Inválido", description: `El archivo ${file.name} no es una imagen.` });
            if (filesProcessedCount === filesToProcess && filesToProcess === 0 && newImageUrls.length === 0) { // All files were invalid
                // onOpenChange(false);
            } else if (filesProcessedCount === filesToProcess) { // Some valid images might have been processed
                if(newImageUrls.length > 0) onImagesSelected(newImageUrls);
                // onOpenChange(false);
            }
        }
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleOpenCamera = async () => {
    setCameraError(null);
    setHasCameraPermission(null); // Reset before attempting
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCameraView(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      let message = "No se pudo acceder a la cámara. Asegúrate de que está conectada y no en uso.";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          message = "Permiso de cámara denegado. Habilítalo en la configuración de tu navegador.";
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          message = "No se encontró ninguna cámara conectada.";
        }
      }
      setCameraError(message);
      setHasCameraPermission(false);
      setShowCameraView(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        onImagesSelected([dataUrl]); // Pass newly captured image as an array
      }
      stopCamera();
      setShowCameraView(false); // Return to selection view
      // onOpenChange(false); // Keep dialog open
    } else {
      toast({ variant: "destructive", title: "Error de Captura", description: "No se pudo capturar la foto." });
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      stopCamera();
      setShowCameraView(false);
      setCameraError(null);
    }
    onOpenChange(open);
  };

  const handleBackFromCamera = () => {
    stopCamera();
    setShowCameraView(false);
    setCameraError(null); // Clear any camera-specific errors
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader className={cn(showCameraView && "flex flex-row items-center justify-between")}>
          {showCameraView && (
            <Button onClick={handleBackFromCamera} variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" data-ai-hint="back arrow icon" />
            </Button>
          )}
          <DialogTitle className={cn(showCameraView && "flex-grow")}>{showCameraView ? "Capturar Foto" : "Gestionar Evidencias"}</DialogTitle>
          {!showCameraView && (
            <DialogDescription data-ai-hint="Dialog description for adding image evidence">
              Añade fotos de tu galería o toma nuevas con tu cámara.
            </DialogDescription>
          )}
        </DialogHeader>

        {cameraError && !showCameraView && ( // Only show general camera error if not in camera view
          <Alert variant="destructive" className="my-2">
            <Camera className="h-4 w-4" data-ai-hint="camera icon" />
            <AlertTitle data-ai-hint="Camera error title">Error de la Cámara</AlertTitle>
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {!showCameraView ? (
          <div className="space-y-4 py-4 flex-grow overflow-y-auto pr-1">
            {imagePreviews.length > 0 && (
              <div className="space-y-3">
                <Label className="font-medium">Fotos Actuales ({imagePreviews.length})</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={preview} alt={`Evidencia ${index + 1}`} className="rounded-md w-full h-full object-cover" data-ai-hint={`evidence photo ${index + 1}`} />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={() => onRemoveImage(index)}
                        aria-label={`Eliminar imagen ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={onClearAllImages} className="w-full text-destructive hover:text-destructive/90 border-destructive/50 hover:border-destructive/70">
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar todas las fotos
                </Button>
              </div>
            )}
            
            <div className="space-y-2 pt-2">
              <Button onClick={handleChooseFromGallery} variant="outline" className="w-full">
                <ImageIcon className="mr-2 h-5 w-5" />
                Añadir de Galería
              </Button>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="gallery-input"
                multiple // Allow multiple file selection
              />
              <Button onClick={handleOpenCamera} className="w-full">
                <Camera className="mr-2 h-5 w-5" />
                Capturar con Cámara
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4 flex-grow flex flex-col justify-between">
            <div className={cn("rounded-md overflow-hidden border bg-muted", hasCameraPermission ? "block" : "hidden")}>
                <video
                ref={videoRef}
                className="w-full aspect-[4/3] object-cover" // Common aspect ratio for webcams
                autoPlay
                playsInline // Important for iOS
                muted // Mute to avoid feedback loops if microphone is accidentally enabled
                />
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {hasCameraPermission === false && ( // Show if explicitly denied or error occurred
                 <Alert variant="destructive" className="my-2">
                    <Camera className="h-4 w-4" data-ai-hint="camera icon" />
                    <AlertTitle data-ai-hint="Camera access required title">Se requiere acceso a la cámara</AlertTitle>
                    <AlertDescription>
                        {cameraError || "Por favor, permita el acceso a la cámara para usar esta función. Es posible que deba habilitarlo en la configuración de su navegador."}
                    </AlertDescription>
                 </Alert>
            )}
            {hasCameraPermission && (
               <div className="flex justify-center mt-auto pt-4">
                   <Button
                       onClick={handleCapturePhoto}
                       className="rounded-full h-16 w-16 p-0 border-4 border-white shadow-lg bg-primary hover:bg-primary/80"
                       size="icon"
                       disabled={!cameraStream}
                       aria-label="Capturar Foto"
                       data-ai-hint="Capture photo button"
                   >
                    <Camera className="h-7 w-7 text-primary-foreground" />
                   </Button>
               </div>
            )}
          </div>
        )}
        
        <DialogFooter className="sm:justify-end pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline" data-ai-hint="close button">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    