
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, ScanLine, Send, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ManualCodeSchema = z.object({
  code: z.string().min(1, "El código no puede estar vacío."),
});

type ManualCodeFormData = z.infer<typeof ManualCodeSchema>;

interface BarcodeScannerProps {
  itemId: string;
}

export function BarcodeScanner({ itemId }: BarcodeScannerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null); // For future actual scanning

  const form = useForm<ManualCodeFormData>({
    resolver: zodResolver(ManualCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  React.useEffect(() => {
    // Cleanup camera stream when component unmounts or camera is closed
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return stream; // Return stream for immediate use
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Acceso a Cámara Denegado",
          description: "Por favor, habilita los permisos de cámara en tu navegador.",
        });
        return null;
      }
    } else {
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Cámara no Soportada",
        description: "Tu navegador no soporta el acceso a la cámara.",
      });
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
      }
    }
  };
  
  function onManualSubmit(data: ManualCodeFormData) {
    console.log(`Código manual para item ID ${itemId}: ${data.code}`);
    toast({
      title: "Código Procesado (Manual)",
      description: `Item: ${itemId}, Código: ${data.code}. (Simulado)`,
    });
    // Here you would typically do something with the code, e.g., API call
    form.reset();
  }

  // Placeholder for actual QR/barcode scanning logic from video stream
  // This would involve a library like `jsqr` or `zxing-js`
  React.useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      // Start scanning logic here if a library was integrated
      // For now, it just displays the camera feed
    }
  }, [isCameraOpen]);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
          <ScanLine className="h-6 w-6" />
          Escanear Código
        </CardTitle>
        <CardDescription>Ingresa un código manualmente o usa la cámara.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingresar código manualmente</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                    <Input placeholder="Ej: 1234567890" {...field} />
                     <Button type="submit" size="icon" aria-label="Procesar código manual">
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Separator />

        <div className="space-y-4">
          <Button onClick={handleToggleCamera} className="w-full" variant="outline">
            <Camera className="mr-2 h-5 w-5" />
            {isCameraOpen ? "Cerrar Cámara" : "Escanear con Cámara"}
          </Button>

          {hasCameraPermission === false && !isCameraOpen && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Permiso de Cámara Denegado</AlertTitle>
              <AlertDescription>
                No se pudo acceder a la cámara. Verifica los permisos en tu navegador.
              </AlertDescription>
            </Alert>
          )}
          
          <div className={cn("rounded-md overflow-hidden border bg-muted", isCameraOpen ? "block" : "hidden")}>
            <video
              ref={videoRef}
              className="w-full aspect-video" // Maintain aspect ratio
              autoPlay
              playsInline // Important for iOS
              muted // Often required for autoplay
            />
          </div>
          {isCameraOpen && hasCameraPermission && (
             <p className="text-xs text-muted-foreground text-center">
              Apuntando la cámara al código QR o de barras... (Funcionalidad de escaneo real no implementada en esta demo)
            </p>
          )}

          {scannedCode && ( // For future use when scanning is implemented
            <Alert>
              <ScanLine className="h-4 w-4" />
              <AlertTitle>Código Escaneado</AlertTitle>
              <AlertDescription>
                Detectado: {scannedCode}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
