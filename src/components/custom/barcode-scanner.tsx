
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, ScanLine, Send, AlertTriangle, ArrowLeft, List, ShieldCheck } from "lucide-react";

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

interface ExtinguisherDataFromPlan {
  id: string;
  type: string;
  capacity: string;
  location_description: string;
}
interface BarcodeScannerProps {
  itemId: string; // Context item being audited (e.g., planId or extinguisherId)
  extinguishersForPlan?: ExtinguisherDataFromPlan[];
}

const mockExtinguisherFor123: Partial<ExtinguisherFormData> = {
  ubicacion: 'Entrada Principal (Escaneado)',
  capacidadLibras: '10 lbs',
  agenteExtintor: 'Polvo Químico Seco (ABC)',
  modelo: 'ABC-10-Scan',
  indicadorPresion: 'En Verde',
  cargaExtintores: 'Cargado (01/2024)',
  instrucciones: "C",
  calcomaniasPlacas: "C",
  selloSeguridad: "C",
  pinPasador: "C",
  pinturaBuenEstado: "C",
  cilindroMangueraBoquillas: "C",
  alturaAdecuada: "C",
  accesoLibre: "C",
};

export function BarcodeScanner({ itemId, extinguishersForPlan = [] }: BarcodeScannerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);

  const [viewMode, setViewMode] = React.useState<'scanner' | 'form'>('scanner');
  const [currentExtinguisherData, setCurrentExtinguisherData] = React.useState<Partial<ExtinguisherFormData> | null>(null);
  const [currentExtinguisherId, setCurrentExtinguisherId] = React.useState<string | null>(null);
  const [auditedExtinguisherIds, setAuditedExtinguisherIds] = React.useState<Set<string>>(new Set());

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
      } catch (error)
      {
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
      const simulatedExtId = "sim-ext-123";
      if (currentExtinguisherId === simulatedExtId && currentExtinguisherData) {
        // Data already loaded and possibly edited, reuse it.
      } else {
        setCurrentExtinguisherData(mockExtinguisherFor123);
        setCurrentExtinguisherId(simulatedExtId); 
      }
      setViewMode('form');
    } else {
      console.log(`Código manual para item ID ${itemId}: ${data.code}`);
      // Try to find the extinguisher in the plan list
      const foundExtinguisher = extinguishersForPlan.find(ext => ext.id.toLowerCase() === data.code.toLowerCase());
      if (foundExtinguisher) {
        toast({
          title: "Extinguidor del Plano Encontrado",
          description: `Mostrando formulario para ${foundExtinguisher.type}. Item auditado: ${itemId}`,
        });
        setCurrentExtinguisherData({ // Populate with data from the plan
            ubicacion: foundExtinguisher.location_description,
            capacidadLibras: foundExtinguisher.capacity,
            agenteExtintor: foundExtinguisher.type,
            modelo: "Modelo del Plano", // Placeholder
        });
        setCurrentExtinguisherId(foundExtinguisher.id);
        setViewMode('form');
      } else {
        toast({
          title: "Código Procesado (Manual)",
          description: `Item: ${itemId}, Código: ${data.code}. (Simulado, no acción específica, extinguidor no encontrado en lista)`,
        });
        // Optionally, still allow opening a generic form for a new/unknown extinguisher
        // setCurrentExtinguisherData({}); // For a truly new one
        // setCurrentExtinguisherId(data.code); // Use entered code as ID
        // setViewMode('form');
        setCurrentExtinguisherData(null); // Or clear if no match
        setCurrentExtinguisherId(null);
      }
    }
    form.reset();
  }

  const handleExtinguisherFormSubmitSuccess = (formData: ExtinguisherFormData) => {
    toast({
      title: "Datos del Extinguidor Guardados",
      description: `Información para ${currentExtinguisherId} guardada (simulado). Volviendo al escáner.`,
      variant: "default"
    });
    if (currentExtinguisherId) {
      setAuditedExtinguisherIds(prev => new Set(prev).add(currentExtinguisherId));
    }
    setCurrentExtinguisherData(formData); 
    setViewMode('scanner');
    form.reset(); 
  };

  const handleReturnToScanner = () => {
    setViewMode('scanner');
    if (isCameraOpen) { 
        handleToggleCamera(); // Optionally close camera, or leave it open
    }
  };

  React.useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      // Scanning logic would go here
    }
  }, [isCameraOpen]);

  const auditedCountInList = extinguishersForPlan.filter(ext => auditedExtinguisherIds.has(ext.id)).length;

  if (viewMode === 'form' && currentExtinguisherData && currentExtinguisherId) {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
                 <Button variant="ghost" size="icon" onClick={handleReturnToScanner} aria-label="Volver al escáner" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-primary truncate pr-2" title={`Detalles del Extinguidor ${currentExtinguisherId}`}>
                    Detalles del Extinguidor
                </h2>
            </div>
        </div>
        <ExtinguisherEditorForm
          initialData={currentExtinguisherData}
          onSubmitSuccess={handleExtinguisherFormSubmitSuccess}
          extinguisherId={currentExtinguisherId}
          isNew={!extinguishersForPlan.some(ext => ext.id === currentExtinguisherId) && currentExtinguisherId !== 'sim-ext-123'} // Crude check for new
        />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
          <ScanLine className="h-6 w-6" />
          Escanear/Registrar Extinguidor
        </CardTitle>
        <CardDescription>
          Ingresa un código manualmente o usa la cámara.
          {extinguishersForPlan.length > 0 ? " Abajo puedes ver los extinguidores de este plano." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingresar código de extinguidor</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                    <Input placeholder="Ej: 123 (sim) o ID de lista" {...field} />
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

        {extinguishersForPlan && extinguishersForPlan.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <List className="h-5 w-5" />
                Extintores en este Plano ({auditedCountInList}/{extinguishersForPlan.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {extinguishersForPlan.map((ext) => {
                  const isAudited = auditedExtinguisherIds.has(ext.id);
                  return (
                    <Card 
                        key={ext.id} 
                        className="p-3 bg-card shadow-sm cursor-pointer hover:shadow-md"
                        onClick={() => onManualSubmit({ code: ext.id })} // Allow clicking to "scan"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onManualSubmit({ code: ext.id })}}
                        aria-label={`Seleccionar extinguidor ${ext.type} ubicado en ${ext.location_description}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-grow overflow-hidden">
                          <ShieldCheck className={cn("h-6 w-6 flex-shrink-0", isAudited ? "text-green-500" : "text-primary")} />
                          <div className="flex-grow overflow-hidden">
                            <p className="font-medium text-sm text-card-foreground truncate" title={`${ext.type} - ${ext.capacity}`}>
                              {ext.type} - {ext.capacity}
                            </p>
                            <p className="text-xs text-muted-foreground truncate" title={ext.location_description}>
                              {ext.location_description}
                            </p>
                          </div>
                        </div>
                        <span className={cn("text-xs font-semibold ml-2 shrink-0", isAudited ? "text-green-600" : "text-muted-foreground")}>
                          ({isAudited ? '1/1' : '0/1'})
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

    