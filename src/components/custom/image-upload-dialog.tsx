
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image as ImageIcon, X, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImageSelected: (dataUrl: string) => void;
  imagePreview?: string | null;
  onClearPreview?: () => void;
}

export function ImageUploadDialog({
  isOpen,
  onOpenChange,
  onImageSelected,
  imagePreview,
  onClearPreview
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
    setShowCameraView(false);
    setHasCameraPermission(null);
  }, [cameraStream]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
        onOpenChange(false);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleOpenCamera = async () => {
    setCameraError(null);
    setHasCameraPermission(null);
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissionStatus.state === 'denied' || permissionStatus.state === 'prompt') {
        setCameraError("Camera permission denied. Please enable it in your browser settings.");
        setHasCameraPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCameraView(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Could not access camera. Please ensure it's connected and not in use by another app.");
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
        onImageSelected(dataUrl);
      }
      stopCamera();
      onOpenChange(false);
    } else {
      toast({ variant: "destructive", title: "Capture Error", description: "Could not capture photo." });
    }  
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      stopCamera();
      setShowCameraView(false); // Reset view state
      setCameraError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={cn(showCameraView && "flex flex-row items-center justify-between")}>
          <DialogTitle>{showCameraView ? "Capturar Foto" : "Agregar Evidencia"}</DialogTitle>
          {!showCameraView && (
            <DialogDescription data-ai-hint="Dialog description for adding image evidence">
              Selecciona una foto de tu galería o toma una nueva con tu cámara.
            </DialogDescription>
          )}
        </DialogHeader>

        {cameraError && (
          <Alert variant="destructive" className="my-4">
            <Camera className="h-4 w-4" data-ai-hint="camera icon" />
            <AlertTitle data-ai-hint="Camera error title">Error de la Cámara</AlertTitle>
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {!showCameraView ? (
          <div className="space-y-4 py-4">
            {imagePreview && onClearPreview && (
              <div className="relative group">
                <img src={imagePreview} alt="Evidencia actual" className="rounded-md max-h-60 w-auto mx-auto" data-ai-hint="evidence photo" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onClearPreview}
                  aria-label="Eliminar imagen actual"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button onClick={handleChooseFromGallery} variant="outline" className="w-full">
              <ImageIcon className="mr-2 h-5 w-5" />
              Elegir de la Galería
            </Button>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="gallery-input"
            />
            <Button onClick={handleOpenCamera} className="w-full">
              <Camera className="mr-2 h-5 w-5" />
              Capturar con la Cámara
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className={cn("rounded-md overflow-hidden border bg-muted", hasCameraPermission ? "block" : "hidden")}>
                <video
                ref={videoRef}
                className="w-full aspect-video"
                autoPlay
                playsInline
                muted
                />
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {hasCameraPermission === false && (
                 <Alert variant="destructive">
                    <Camera className="h-4 w-4" data-ai-hint="camera icon" />
                    <AlertTitle data-ai-hint="Camera access required title">Se requiere acceso a la cámara</AlertTitle>
                    <AlertDescription>
                        Por favor, permita el acceso a la cámara para usar esta función. Es posible que deba habilitarlo en la configuración de su navegador.
                    </AlertDescription>
                 </Alert>
            )}
            {hasCameraPermission && (
               <div className="flex justify-center">
                   <Button
                       onClick={handleCapturePhoto}
                       className="rounded-full h-16 w-16"
                       size="icon"
                       disabled={!cameraStream}
                       data-ai-hint="Capture photo button"
                   ></Button>
               </div>
            )}
            <Button onClick={() => { stopCamera(); setShowCameraView(false); }} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-5 w-5" data-ai-hint="back arrow icon" />
              Elegir otra opción
            </Button>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost" data-ai-hint="cancel button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    