
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Send, AlertTriangle, ScanLine } from "lucide-react";

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
  showCamera?: boolean; // Prop to control if camera functionality is available/shown
}

export function ScannerInterface({ onCodeScanned, showCamera = true }: ScannerInterfaceProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [simulatedScannedCode, setSimulatedScannedCode] = React.useState<string | null>(null); // For simulation

  const form = useForm<ManualCodeFormData>({
    resolver: zodResolver(ManualCodeSchema),
    defaultValues: { code: "" },
  });

  // Ref to check camera state in timeout
  const isCameraOpenRef = React.useRef(isCameraOpen);
  React.useEffect(() => {
    isCameraOpenRef.current = isCameraOpen;
  }, [isCameraOpen]);

  React.useEffect(() => {
    // Cleanup camera stream on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
        return stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({ variant: "destructive", title: "Acceso a Cámara Denegado", description: "Por favor, habilita los permisos de cámara en la configuración de tu navegador." });
        return null;
      }
    } else {
      setHasCameraPermission(false);
      toast({ variant: "destructive", title: "Cámara no Soportada", description: "Tu navegador no soporta acceso a la cámara." });
      return null;
    }
  };

  const handleToggleCamera = async () => {
    if (isCameraOpen) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOpen(false);
    } else {
      const stream = await requestCameraPermission();
      if (stream) {
        setIsCameraOpen(true);
        // Simulate a scan after a delay for demo purposes
        setTimeout(() => {
            if (isCameraOpenRef.current) { // Check if camera is still open via ref
                const mockScan = `sim-cam-${Math.floor(Math.random() * 1000)}`;
                setSimulatedScannedCode(mockScan);
                onCodeScanned(mockScan);
                // Ensure handleToggleCamera is called to close the camera
                // Need to manage isCameraOpen state directly or ensure this runs correctly
                if (videoRef.current && videoRef.current.srcObject) {
                  const currentStream = videoRef.current.srcObject as MediaStream;
                  currentStream.getTracks().forEach(track => track.stop());
                  videoRef.current.srcObject = null;
                }
                setIsCameraOpen(false); // Explicitly set camera to closed
            }
        }, 3000);
      }
    }
  };
  

  function onManualSubmit(data: ManualCodeFormData) {
    onCodeScanned(data.code);
    form.reset();
    setSimulatedScannedCode(null); // Clear any simulated camera scan
  }
  
  // Effect for camera scanning logic (placeholder)
  React.useEffect(() => {
    if (isCameraOpen && videoRef.current && hasCameraPermission) {
      // Placeholder: In a real scenario, you'd use a library like
      // ZXing or QuaggaJS to process video frames from videoRef.current
      // and detect barcodes. When a barcode is detected, call:
      // onCodeScanned(detectedCode);
      // setIsCameraOpen(false); // Optionally close camera
      // For now, the simulation is in handleToggleCamera
      console.log("Camera is open. Scanning logic (simulation) would be active.");
    }
  }, [isCameraOpen, hasCameraPermission]);


  return (
    <div className="space-y-4">
      <Form {...form}> {/* This is FormProvider from ShadCN, providing context for react-hook-form */}
        <div className="space-y-4"> {/* Replaced the <form> tag with a <div> */}
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
                          form.handleSubmit(onManualSubmit)(); // Trigger submission logic
                        }
                      }}
                    />
                    <Button 
                      type="button" // Changed from "submit" to "button"
                      size="icon" 
                      aria-label="Procesar código manual"
                      onClick={form.handleSubmit(onManualSubmit)} // Attach submit logic here
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
            {isCameraOpen ? "Cerrar Cámara" : "Escanear con Cámara"}
          </Button>

          {hasCameraPermission === false && !isCameraOpen && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Permiso de Cámara Denegado</AlertTitle>
              <AlertDescription>No se pudo acceder a la cámara. Verifica los permisos e inténtalo de nuevo.</AlertDescription>
            </Alert>
          )}
          
          <div className={cn("rounded-md overflow-hidden border bg-muted", isCameraOpen ? "block" : "hidden")}>
            <video ref={videoRef} className="w-full aspect-video" autoPlay playsInline muted />
          </div>
          
          {isCameraOpen && hasCameraPermission && (
            <p className="text-xs text-muted-foreground text-center">Apuntando cámara... (Simulando escaneo en 3 seg...)</p>
          )}
        </>
      )}
      
      {simulatedScannedCode && (
        <Alert>
          <ScanLine className="h-4 w-4" />
          <AlertTitle>Código Escaneado (Simulado)</AlertTitle>
          <AlertDescription>Detectado vía cámara: {simulatedScannedCode}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
