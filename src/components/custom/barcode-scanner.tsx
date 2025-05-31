
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, ScanLine, Send, AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ExtinguisherEditorForm, type ExtinguisherFormData } from "@/components/custom/extinguisher-editor-form";

const ManualCodeSchema = z.object({
  code: z.string().min(1, "El código no puede estar vacío."),
});

type ManualCodeFormDataInternal = z.infer<typeof ManualCodeSchema>;

interface BarcodeScannerProps {
  itemId: string; // Context item being audited
}

const mockExtinguisherFor123: Partial<ExtinguisherFormData> = {
  ubicacion: 'Entrada Principal (Escaneado)',
  capacidadLibras: '10 lbs',
  agenteExtintor: 'Polvo Químico Seco (ABC)',
  modelo: 'ABC-10-Scan',
  indicadorPresion: 'En Verde',
  cargaExtintores: 'Cargado (01/2024)',
  // Basic checklist items
  instrucciones: "C",
  calcomaniasPlacas: "C",
  selloSeguridad: "C",
  pinPasador: "C",
  pinturaBuenEstado: "C",
  cilindroMangueraBoquillas: "C",
  alturaAdecuada: "C",
  accesoLibre: "C",
};

export function BarcodeScanner({ itemId }: BarcodeScannerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);

  const [viewMode, setViewMode] = React.useState<'scanner' | 'form'>('scanner');
  const [currentExtinguisherData, setCurrentExtinguisherData] = React.useState<Partial<ExtinguisherFormData> | null>(null);
  const [currentExtinguisherId, setCurrentExtinguisherId] = React.useState<string | null>(null);

  const form = useForm<ManualCodeFormDataInternal>({
    resolver: zodResolver(ManualCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  React.useEffect(() => {
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
        return stream;
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
  
  function onManualSubmit(data: ManualCodeFormDataInternal) {
    if (data.code === "123") {
      toast({
        title: "Código Simulado Reconocido",
        description: `Mostrando formulario para extinguidor simulado. Item auditado: ${itemId}`,
      });
      setCurrentExtinguisherData(mockExtinguisherFor123);
      setCurrentExtinguisherId("sim-ext-123"); // Simulated ID for the form
      setViewMode('form');
    } else {
      console.log(`Código manual para item ID ${itemId}: ${data.code}`);
      toast({
        title: "Código Procesado (Manual)",
        description: `Item: ${itemId}, Código: ${data.code}. (Simulado, no acción)`,
      });
    }
    form.reset();
  }

  const handleExtinguisherFormSubmitSuccess = (formData: ExtinguisherFormData) => {
    toast({
      title: "Datos del Extinguidor Guardados",
      description: `Información para ${currentExtinguisherId} guardada (simulado). Volviendo al escáner.`,
      variant: "default"
    });
    setViewMode('scanner');
    setCurrentExtinguisherData(null);
    setCurrentExtinguisherId(null);
    form.reset(); // Reset manual code input
  };

  const handleReturnToScanner = () => {
    setViewMode('scanner');
    setCurrentExtinguisherData(null);
    setCurrentExtinguisherId(null);
    if (isCameraOpen) { // Close camera if it was open
        handleToggleCamera();
    }
  };

  React.useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      // Scanning logic would go here
    }
  }, [isCameraOpen]);

  if (viewMode === 'form' && currentExtinguisherData && currentExtinguisherId) {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
                 <Button variant="ghost" size="icon" onClick={handleReturnToScanner} aria-label="Volver al escáner" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-primary">Detalles del Extinguidor</h2>
            </div>
        </div>
        <ExtinguisherEditorForm
          initialData={currentExtinguisherData}
          onSubmitSuccess={handleExtinguisherFormSubmitSuccess}
          extinguisherId={currentExtinguisherId}
          isNew={false} // Assuming "123" always loads an existing (simulated) extinguisher
        />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
          <ScanLine className="h-6 w-6" />
          Escanear Código
        </CardTitle>
        <CardDescription>Ingresa un código manualmente o usa la cámara para registrar/auditar un extinguidor.</CardDescription>
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
                    <Input placeholder="Ej: 12345 (o '123' para simulación)" {...field} />
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
              className="w-full aspect-video"
              autoPlay
              playsInline 
              muted 
            />
          </div>
          {isCameraOpen && hasCameraPermission && (
             <p className="text-xs text-muted-foreground text-center">
              Apuntando la cámara al código QR o de barras... (Funcionalidad de escaneo real no implementada)
            </p>
          )}

          {scannedCode && ( 
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
