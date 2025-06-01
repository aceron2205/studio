
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, ScanLine, Send, AlertTriangle, ArrowLeft, List, ShieldCheck, MoreVertical, FileCheck, Edit3, Tag, Building, Thermometer, BatteryCharging, Calendar, ChevronDown } from "lucide-react"; // Added ChevronDown
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ManualCodeSchema = z.object({
  code: z.string().min(1, "El código no puede estar vacío."),
});

type ManualCodeFormDataInternal = z.infer<typeof ManualCodeSchema>;

export interface ExtinguisherDataForAccordion {
  id: string;
  type: string;
  capacity: string;
  location_description: string;
  model?: string;
  pressure_indicator?: string;
  charge_status?: string;
  last_revision_date?: string;
  instrucciones?: string;
  calcomaniasPlacas?: string;
  selloSeguridad?: string;
  pinPasador?: string;
  pinturaBuenEstado?: string;
  cilindroMangueraBoquillas?: string;
  alturaAdecuada?: string;
  accesoLibre?: string;
}

interface BarcodeScannerProps {
  itemId: string;
  extinguishersForPlan?: ExtinguisherDataForAccordion[];
}

const detailedMockExtinguishers: Record<string, ExtinguisherDataForAccordion> = {
  'ext-1': { id: 'ext-1', type: 'Polvo Químico Seco (ABC)', capacity: '10 lbs', location_description: 'Entrada principal, junto a recepción', model: 'Amerex B402', pressure_indicator: 'En Verde', charge_status: 'Cargado (01/2024)', last_revision_date: '2024-01-15' },
  'ext-2': { id: 'ext-2', type: 'Dióxido de Carbono (CO2)', capacity: '5 kg', location_description: 'Sala de servidores, pared norte', model: 'Kidde K05', pressure_indicator: 'N/A (CO2)', charge_status: 'Cargado (11/2023)', last_revision_date: '2023-11-20' },
  'ext-3': { id: 'ext-3', type: 'Agua Pulverizada', capacity: '2.5 gal', location_description: 'Pasillo ala oeste, cerca de la escalera', model: 'Badger WP-2.5', pressure_indicator: 'En Verde', charge_status: 'Cargado (03/2024)', last_revision_date: '2024-03-10' },
  'ext-4': { id: 'ext-4', type: 'Polvo Químico Seco (PQS)', capacity: '20 lbs', location_description: 'Almacén Gamma - Punto Central', model: 'Amerex B500', pressure_indicator: 'En Verde', charge_status: 'Pendiente Recarga', last_revision_date: '2023-08-01' },
  'ext-5': { id: 'ext-5', type: 'Espuma AFFF', capacity: '6 lts', location_description: 'Almacén Gamma - Zona Líquidos', model: 'Buckeye AFFF-6L', pressure_indicator: 'En Verde', charge_status: 'Cargado (05/2024)', last_revision_date: '2024-05-05' },
};

const mockExtinguisherDataFor123: ExtinguisherDataForAccordion = {
  id: 'sim-ext-123',
  location_description: 'Entrada Principal (Escaneado 123)',
  capacity: '10 lbs',
  type: 'Polvo Químico Seco (ABC)',
  model: 'ABC-10-Scan-123',
  pressure_indicator: 'En Verde',
  charge_status: 'Cargado (01/2024)',
  instrucciones: "C", calcomaniasPlacas: "C", selloSeguridad: "C", pinPasador: "C",
  pinturaBuenEstado: "C", cilindroMangueraBoquillas: "C", alturaAdecuada: "C", accesoLibre: "C",
  last_revision_date: '2024-01-01'
};


export function BarcodeScanner({ itemId, extinguishersForPlan = [] }: BarcodeScannerProps) {
  const router = useRouter();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>();
  const [auditedExtinguisherIds, setAuditedExtinguisherIds] = React.useState<Set<string>>(new Set());

  const form = useForm<ManualCodeFormDataInternal>({
    resolver: zodResolver(ManualCodeSchema),
    defaultValues: { code: "" },
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
        if (videoRef.current) videoRef.current.srcObject = stream;
        return stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({ variant: "destructive", title: "Acceso a Cámara Denegado", description: "Por favor, habilita los permisos de cámara." });
        return null;
      }
    } else {
      setHasCameraPermission(false);
      toast({ variant: "destructive", title: "Cámara no Soportada", description: "Tu navegador no soporta acceso a cámara." });
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
      if (stream) setIsCameraOpen(true);
    }
  };

  function onManualSubmit(data: ManualCodeFormDataInternal) {
    let foundExtinguisher: ExtinguisherDataForAccordion | undefined;
    if (data.code === "123") {
      foundExtinguisher = mockExtinguisherDataFor123;
    } else {
      foundExtinguisher = extinguishersForPlan.find(ext => ext.id.toLowerCase() === data.code.toLowerCase()) || detailedMockExtinguishers[data.code.toLowerCase()];
    }

    if (foundExtinguisher) {
      toast({ title: "Código Procesado", description: `Extinguidor: ${foundExtinguisher.id}. Detalles en la lista de abajo.` });
      setOpenAccordionItem(foundExtinguisher.id); 
      const itemElement = document.querySelector(`[data-radix-accordion-item][value="${foundExtinguisher.id}"]`);
      itemElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      toast({ variant: "destructive", title: "Extinguidor no Encontrado", description: `No se encontró el código: ${data.code}. Puede agregarlo si es necesario.` });
    }
    form.reset();
  }

  const handleAuditExtinguisher = (extId: string) => {
    setAuditedExtinguisherIds(prev => new Set(prev).add(extId));
    router.push(`/audit-extinguisher/${itemId}/${extId}`);
  };

  const handleEditExtinguisher = (extId: string) => {
    router.push(`/edit-extinguisher/${itemId}/${extId}`);
  };

  React.useEffect(() => {
    if (isCameraOpen && videoRef.current) { /* Scanning logic would go here */ }
  }, [isCameraOpen]);

  const auditedCountInList = extinguishersForPlan.filter(ext => auditedExtinguisherIds.has(ext.id)).length;

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    value ? (
      <div className="flex items-start text-sm py-1">
        <Icon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
        <span className="font-medium text-muted-foreground">{label}:&nbsp;</span>
        <span className="text-foreground break-words">{value}</span>
      </div>
    ) : null
  );

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
              <AlertDescription>No se pudo acceder a la cámara. Verifica los permisos.</AlertDescription>
            </Alert>
          )}
          
          <div className={cn("rounded-md overflow-hidden border bg-muted", isCameraOpen ? "block" : "hidden")}>
            <video ref={videoRef} className="w-full aspect-video" autoPlay playsInline muted />
          </div>
          {isCameraOpen && hasCameraPermission && (
             <p className="text-xs text-muted-foreground text-center">Apuntando cámara... (Escaneo no implementado)</p>
          )}
          {scannedCode && ( <Alert><ScanLine className="h-4 w-4" /><AlertTitle>Código Escaneado</AlertTitle><AlertDescription>Detectado: {scannedCode}</AlertDescription></Alert> )}
        </div>

        {extinguishersForPlan && extinguishersForPlan.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <List className="h-5 w-5" />
                Extintores en este Plano ({auditedCountInList}/{extinguishersForPlan.length})
              </h3>
              <Accordion type="single" collapsible className="w-full space-y-2" value={openAccordionItem} onValueChange={setOpenAccordionItem}>
                {extinguishersForPlan.map((ext) => {
                  const isAudited = auditedExtinguisherIds.has(ext.id);
                  const displayExt = detailedMockExtinguishers[ext.id] || ext;
                  const isCurrentOpen = openAccordionItem === ext.id;

                  return (
                    <AccordionItem value={ext.id} key={ext.id} className="border rounded-lg shadow-sm bg-card overflow-hidden" data-radix-accordion-item>
                      <div className="flex items-center justify-between p-3 group" data-state={isCurrentOpen ? "open" : "closed"}>
                        <AccordionTrigger asChild>
                          <div
                            className="flex flex-1 items-center gap-3 overflow-hidden cursor-pointer rounded-md pr-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            role="button" // Explicitly give it a button role for accessibility as it's a div
                            tabIndex={0} // Make it focusable
                            onKeyDown={(e) => { // Allow keyboard activation
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setOpenAccordionItem(isCurrentOpen ? undefined : ext.id);
                              }
                            }}
                          >
                            <ShieldCheck className={cn("h-6 w-6 flex-shrink-0", isAudited ? "text-green-500" : "text-primary")} />
                            <div className="flex-grow overflow-hidden text-left">
                                <p className="font-medium text-sm text-card-foreground truncate" title={`${displayExt.type} - ${displayExt.capacity}`}>
                                {displayExt.type} - {displayExt.capacity}
                                </p>
                                <p className="text-xs text-muted-foreground truncate" title={displayExt.location_description}>
                                {displayExt.location_description}
                                </p>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", isCurrentOpen && "rotate-180")} />
                          </div>
                        </AccordionTrigger>

                        <div className="flex items-center shrink-0 ml-2 pl-1">
                            <span className={cn("text-xs font-semibold mr-1 sm:mr-2", isAudited ? "text-green-600" : "text-muted-foreground")}>
                                ({isAudited ? 'Auditado' : 'Pendiente'})
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); }} aria-label={`Más opciones para extinguidor ${ext.id}`}>
                                        <span><MoreVertical className="h-4 w-4" /></span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => { e.stopPropagation(); }}>
                                <DropdownMenuItem onClick={() => handleAuditExtinguisher(ext.id)}>
                                    <FileCheck className="mr-2 h-4 w-4" />
                                    Auditar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditExtinguisher(ext.id)}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </div>
                      
                      <AccordionContent className="p-4 bg-muted/30">
                        <div className="space-y-1">
                          <DetailItem icon={Tag} label="ID Extinguidor" value={displayExt.id} />
                          <DetailItem icon={Building} label="Ubicación Detallada" value={displayExt.location_description} />
                          <DetailItem icon={Tag} label="Tipo Agente" value={displayExt.type} />
                          <DetailItem icon={Tag} label="Capacidad" value={displayExt.capacity} />
                          <DetailItem icon={Tag} label="Modelo" value={displayExt.model} />
                          <DetailItem icon={Thermometer} label="Indicador Presión" value={displayExt.pressure_indicator} />
                          <DetailItem icon={BatteryCharging} label="Estado Carga" value={displayExt.charge_status} />
                          <DetailItem icon={Calendar} label="Última Revisión" value={displayExt.last_revision_date} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
    

    