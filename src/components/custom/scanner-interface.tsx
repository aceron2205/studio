
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Send, AlertTriangle, ScanLine } from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException, type IScannerControls } from "@zxing/library";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ManualCodeSchema = z.object({
  code: z.string().min(1, "El código no puede estar vacío."),
});
type ManualCodeFormData = z.infer<typeof ManualCodeSchema>;

interface ScannerInterfaceProps {
  onCodeScanned: (code: string) => void;
  showCamera?: boolean;
}

export function ScannerInterface({ onCodeScanned, showCamera = true }: ScannerInterfaceProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [scannerError, setScannerError] = React.useState<string | null>(null);
  const codeReaderRef = React.useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = React.useRef<IScannerControls | null>(null);
  const [cameraStatus, setCameraStatus] = React.useState<string>("Inactiva");


  const form = useForm<ManualCodeFormData>({
    resolver: zodResolver(ManualCodeSchema),
    defaultValues: { code: "" },
  });

  React.useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      controlsRef.current?.stop();
      codeReaderRef.current?.reset();
    };
  }, []);

  const stopCamera = React.useCallback(() => {
    controlsRef.current?.stop();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraStatus("Inactiva");
  }, []);


  const startCamera = React.useCallback(async () => {
    if (!codeReaderRef.current || !videoRef.current) return;
    
    setScannerError(null);
    setHasCameraPermission(null);
    setCameraStatus("Inicializando...");

    try {
      // Check for permissions first without immediately trying to get the stream
      // This is a more robust way to check permission status
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissionStatus.state === 'denied') {
        toast({ variant: "destructive", title: "Acceso a Cámara Denegado", description: "Por favor, habilita los permisos de cámara en la configuración de tu navegador." });
        setHasCameraPermission(false);
        setIsCameraOpen(false);
        setCameraStatus("Error de Permiso");
        return;
      }

      // If not denied, try to get the stream (this will prompt if 'prompt' state)
      // Listing devices requires permission, so this also acts as a permission check/prompt
      await navigator.mediaDevices.getUserMedia({ video: true }); // Request permission if not granted
      setHasCameraPermission(true);


      setIsCameraOpen(true);
      setCameraStatus("Buscando dispositivos...");

      const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        setScannerError("No se encontraron cámaras.");
        setCameraStatus("Error: No hay cámaras");
        setIsCameraOpen(false);
        return;
      }
      
      const selectedDeviceId = videoInputDevices[0].deviceId; // Use the first available camera
      setCameraStatus("Cámara activa. Apunte al código...");

      controlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error, controls) => {
          if (result) {
            onCodeScanned(result.getText());
            stopCamera();
             toast({
              title: "Código Escaneado",
              description: `Detectado: ${result.getText()}`,
            });
          }
          if (error && !(error instanceof NotFoundException)) {
            console.error("Error de escaneo:", error);
            setScannerError("Error durante el escaneo.");
            // Do not stop camera on minor errors like NotFoundException, but maybe for others
          }
        }
      );
    } catch (error: any) {
      console.error("Error al iniciar la cámara:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        toast({ variant: "destructive", title: "Acceso a Cámara Denegado", description: "Por favor, habilita los permisos de cámara." });
        setHasCameraPermission(false);
        setCameraStatus("Error de Permiso");
      } else {
        toast({ variant: "destructive", title: "Error de Cámara", description: `No se pudo iniciar la cámara: ${error.message}` });
        setHasCameraPermission(false); // Or null if uncertain
        setCameraStatus("Error de Cámara");
      }
      setIsCameraOpen(false);
    }
  }, [onCodeScanned, stopCamera]);


  const handleToggleCamera = async () => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      await startCamera();
    }
  };
  

  function onManualSubmit(data: ManualCodeFormData) {
    onCodeScanned(data.code);
    form.reset();
    stopCamera(); // Stop camera if it was open from a previous attempt
  }
  

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingresar código manualmente</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ej: ext-1, 123..." 
                      {...field} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onManualSubmit)();
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      size="icon" 
                      aria-label="Procesar código manual"
                      onClick={form.handleSubmit(onManualSubmit)}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {showCamera && (
        <>
          <Button onClick={handleToggleCamera} className="w-full" variant="outline">
            <Camera className="mr-2 h-5 w-5" />
            {isCameraOpen ? "Cerrar Escáner" : "Escanear Código de Barras/QR"}
          </Button>

          {hasCameraPermission === false && !isCameraOpen && ( // Only show if explicitly denied and camera is not trying to be open
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Permiso de Cámara Denegado</AlertTitle>
              <AlertDescription>No se pudo acceder a la cámara. Verifica los permisos e inténtalo de nuevo.</AlertDescription>
            </Alert>
          )}
          
          <div className={cn(
              "rounded-md overflow-hidden border bg-muted",
              isCameraOpen && hasCameraPermission ? "block" : "hidden"
            )}>
            <video ref={videoRef} className="w-full aspect-video" playsInline muted />
          </div>
          
          {isCameraOpen && hasCameraPermission && (
            <p className="text-xs text-muted-foreground text-center">{cameraStatus}</p>
          )}
          {scannerError && (
             <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error de Escáner</AlertTitle>
              <AlertDescription>{scannerError}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
