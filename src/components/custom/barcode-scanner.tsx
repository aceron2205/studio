
"use client";

import * as React from "react";
import { List, ShieldCheck, FileCheck, Edit3, Tag, Building, Thermometer, BatteryCharging, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScannerInterface } from "./scanner-interface"; // New import
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


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
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>();
  const [auditedExtinguisherIds, setAuditedExtinguisherIds] = React.useState<Set<string>>(new Set());

  const handleCodeProcessed = (code: string) => {
    let foundExtinguisher: ExtinguisherDataForAccordion | undefined;
    if (code === "123") { 
      foundExtinguisher = mockExtinguisherDataFor123;
    } else if (code.startsWith("sim-cam-")) { // Handle simulated camera scans
      foundExtinguisher = { // Create a mock extinguisher for simulated camera scan
        id: code,
        location_description: `Ubicación Simulada Cámara (${code})`,
        capacity: '5 kg',
        type: 'CO2 (Simulado Cámara)',
        model: `MODEL-${code}`,
        pressure_indicator: 'En Verde',
        charge_status: 'Cargado (Simulado)',
        last_revision_date: new Date().toISOString().split('T')[0],
      };
       // Add to detailedMockExtinguishers if you want it to be "known" for future manual lookups in this session
      if (!detailedMockExtinguishers[code]) {
        detailedMockExtinguishers[code] = foundExtinguisher;
      }
       // Also, if you want it to appear in the list, you might need to add it to extinguishersForPlan
       // This depends on whether simulated scans should dynamically add to the current plan's list
       // For now, it will just be found/highlighted if it matches an existing ID or the special "123"
    }
    else {
      foundExtinguisher = extinguishersForPlan.find(ext => ext.id.toLowerCase() === code.toLowerCase());
      if (!foundExtinguisher) {
        foundExtinguisher = detailedMockExtinguishers[code.toLowerCase()];
      }
    }

    if (foundExtinguisher) {
      toast({ title: "Código Procesado", description: `Extinguidor: ${foundExtinguisher.id}. Detalles en la lista de abajo.` });
      setOpenAccordionItem(foundExtinguisher.id);
      // Ensure item exists in DOM before trying to scroll
      setTimeout(() => { // Delay to allow accordion to render if new item was added
        const itemElement = document.querySelector(`[data-radix-accordion-item][value="${foundExtinguisher?.id}"]`);
        if (itemElement) {
          itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
    } else {
      toast({ variant: "destructive", title: "Extinguidor no Encontrado", description: `No se encontró el código: ${code}. Puede agregarlo si es necesario.` });
    }
  };

  const handleAuditExtinguisher = (extId: string) => {
    setAuditedExtinguisherIds(prev => new Set(prev).add(extId));
    router.push(`/audit-extinguisher/${itemId}/${extId}`);
  };

  const handleEditExtinguisher = (extId: string) => {
    router.push(`/edit-extinguisher/${itemId}/${extId}`);
  };

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
          {/* ScanLine icon can be kept or removed depending on preference */}
          <List className="h-6 w-6" /> 
          Escanear Extinguidor
        </CardTitle>
        <CardDescription>
          Ingresa un código manualmente o usa la cámara.
          {extinguishersForPlan.length > 0 ? " Abajo puedes ver los extinguidores de este plano." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScannerInterface onCodeScanned={handleCodeProcessed} />
        
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
                       <AccordionTrigger asChild>
                         <div
                           role="button"
                           tabIndex={0}
                           onClick={(e) => {
                             // Prevent dropdown trigger from toggling accordion if clicked directly
                             if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]')) {
                               return;
                             }
                             setOpenAccordionItem(isCurrentOpen ? undefined : ext.id);
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' || e.key === ' ') {
                               if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]')) {
                                 return;
                               }
                               e.preventDefault();
                               setOpenAccordionItem(isCurrentOpen ? undefined : ext.id);
                             }
                           }}
                           className={cn(
                             "flex items-center justify-between w-full p-3 cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                             isCurrentOpen && "border-b"
                           )}
                         >
                           <div className="flex items-center gap-3 flex-grow overflow-hidden">
                             <ShieldCheck className={cn("h-6 w-6 flex-shrink-0", isAudited ? "text-green-500" : "text-primary")} />
                             <div className="flex-grow overflow-hidden text-left">
                               <p className="font-medium text-sm text-card-foreground truncate" title={`${displayExt.type} - ${displayExt.capacity}`}>
                                 {displayExt.type} - {displayExt.capacity}
                               </p>
                               <p className="text-xs text-muted-foreground truncate" title={displayExt.location_description}>
                                 {displayExt.location_description}
                               </p>
                             </div>
                           </div>
                           <div className="flex items-center shrink-0 gap-1 sm:gap-2">
                             <span className={cn("text-xs font-semibold", isAudited ? "text-green-600" : "text-muted-foreground")}>
                               ({isAudited ? '1/1' : '0/1'})
                             </span>
                             <ChevronDown
                               className={cn(
                                 "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                 isCurrentOpen && "rotate-180"
                               )}
                             />
                           </div>
                         </div>
                       </AccordionTrigger>

                      <AccordionContent className="p-4 bg-muted/30">
                        <div className="space-y-1 mb-4">
                          <DetailItem icon={Tag} label="ID Extinguidor" value={displayExt.id} />
                          <DetailItem icon={Building} label="Ubicación Detallada" value={displayExt.location_description} />
                          <DetailItem icon={Tag} label="Tipo Agente" value={displayExt.type} />
                          <DetailItem icon={Tag} label="Capacidad" value={displayExt.capacity} />
                          <DetailItem icon={Tag} label="Modelo" value={displayExt.model} />
                          <DetailItem icon={Thermometer} label="Indicador Presión" value={displayExt.pressure_indicator} />
                          <DetailItem icon={BatteryCharging} label="Estado Carga" value={displayExt.charge_status} />
                          <DetailItem icon={Calendar} label="Última Revisión" value={displayExt.last_revision_date} />
                        </div>
                        <div className="flex justify-end pt-3 mt-3 border-t border-border">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Acciones
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  align="end" 
                                  onClick={(e) => e.stopPropagation()} 
                                  onCloseAutoFocus={(e) => e.preventDefault()}
                                >
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

