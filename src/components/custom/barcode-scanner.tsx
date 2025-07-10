
"use client";

import * as React from "react";
import { List, ShieldCheck, Tag, Building, Thermometer, BatteryCharging, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScannerInterface } from "./scanner-interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExtinguisherActionsDropdown } from "./extinguisher-actions-dropdown";
import ProcessHeader from "./process-header"; // Import ProcessHeader
import { ExtinguisherInfoBlock } from "@/components/custom/ExtinguisherInfoBlock"; // Import ExtinguisherInfoBlock

// NEW IMPORTS: Using centralized data types and mocks
import { mockClients } from "@/mocks/extinguisherMocks"; // Import the main mock data
import { ExtinguisherData } from "@/types/extinguisher"; // Import ExtinguisherData - this is the core type for extinguisher properties

// Helper to flatten mockPlanExtinguishers for easy lookup by ID
const allExtinguishersFlat: Record<string, ExtinguisherData> = mockClients.reduce((acc, client) => {if (client['extinguisher-plan']) {client['extinguisher-plan'].forEach(ext => {acc[ext.id] = ext;});}return acc;}, {} as Record<string, ExtinguisherData>);



interface BarcodeScannerProps {
  itemId: string;
  extinguishersForPlan?: ExtinguisherData[];
  overrideTitle?: string;
  overrideBackButton?: React.ReactNode; 
  onExtinguisherScanned?: (extinguisher: ExtinguisherData) => void;

}

export function BarcodeScanner({ itemId, extinguishersForPlan = [], overrideTitle, overrideBackButton }: BarcodeScannerProps) {
  const router = useRouter();
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>();
  const [auditedExtinguisherIds, setAuditedExtinguisherIds] = React.useState<Set<string>>(new Set());

  // Handler for Accordion value changes to prevent unnecessary updates
  const handleAccordionValueChange = (value: string | undefined) => {
    // Only update state if the new value is different from the current one
    if (value !== openAccordionItem) {
      setOpenAccordionItem(value);
    }
  };

  // REMOVED: detailedMockExtinguishers and mockExtinguisherDataFor123 are no longer used here.
  // The logic below has been updated to use allExtinguishersFlat directly.

  const handleCodeProcessed = (code: string) => {
    let foundExtinguisher: ExtinguisherData | undefined;

    // First, try to find in the extinguishers passed for the current plan
    foundExtinguisher = extinguishersForPlan.find(ext => ext.id.toLowerCase() === code.toLowerCase());

    // If not found in current plan's extinguishers, try the global flat map
    if (!foundExtinguisher) {
      foundExtinguisher = allExtinguishersFlat[code.toLowerCase()];
    }

    if (foundExtinguisher) {
      toast({ title: "Código Procesado", description: `Extinguidor: ${foundExtinguisher.id}. Detalles en la lista de abajo.` });
      setOpenAccordionItem(foundExtinguisher.id);
      setTimeout(() => {
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


  const handleDeleteScannedExtinguisher = (extinguisherId: string, extinguisherType: string) => {
    console.log(`Solicitud de baja para extinguidor ${extinguisherId} (${extinguisherType}) desde BarcodeScanner.`);
    toast({
        title: "Acción Registrada",
        description: `La solicitud de baja para el extinguidor ${extinguisherType} (${extinguisherId}) ha sido registrada. (Simulado)`,
        variant: "default",
    });
  };

  return (
    <div className="w-full">
      {overrideTitle ? (
        <ProcessHeader title={overrideTitle} />
      ) : (
        <div className={cn("relative pb-4 px-4 text-center")}>
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-xl text-primary flex items-center gap-2">
              <List className="h-6 w-6" />
              Escanear Extinguidor
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ingresa un código manualmente o usa la cámara.
              {extinguishersForPlan.length > 0 ? " Abajo puedes ver los extinguidores de este plano." : ""}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6 p-4 sm:p-6">
        <ScannerInterface onCodeScanned={handleCodeProcessed} />

        {extinguishersForPlan && extinguishersForPlan.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4" id="extinguisher-accordion-list">
              <Accordion type="single" collapsible className="w-full space-y-2" value={openAccordionItem} onValueChange={setOpenAccordionItem}>
                {extinguishersForPlan.map((ext: ExtinguisherData) => { // Explicitly typed 'ext'
                  const isAudited = auditedExtinguisherIds.has(ext.id);
                  // 'displayExt' is simply 'ext' here as 'ext' should already be full ExtinguisherData
                  const displayExt: ExtinguisherData = ext;
                  const isCurrentOpen = openAccordionItem === ext.id;

                  return (
                    <AccordionItem value={ext.id} key={ext.id} className="border rounded-md bg-background overflow-hidden" data-radix-accordion-item>
                       <AccordionTrigger asChild>
                         <div
                           role="button"
                           tabIndex={0}
                           onClick={(e) => {
                             if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]')) {
                               return;
                             }
                             setOpenAccordionItem(isCurrentOpen ? undefined : ext.id);
                           }}
                           onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
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
                               <p className="font-medium text-sm text-card-foreground truncate" title={`${displayExt.agenteExtintor} - ${displayExt.capacidadLibras}`}>
                                 {displayExt.agenteExtintor} - {displayExt.capacidadLibras}
                               </p>
                               <p className="text-xs text-muted-foreground truncate" title={displayExt.ubicacion}>
                                 {displayExt.ubicacion}
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
                        <div className="mb-4">
                          <ExtinguisherInfoBlock
                            data={{
                              id: displayExt.id,
                              cliente: displayExt.cliente, // Assuming cliente exists on displayExt or is handled
                              edificio: displayExt.edificio, // Assuming edificio exists on displayExt or is handled
                              ubicacion: displayExt.ubicacion,
                              agenteExtintor: displayExt.agenteExtintor,
                              capacidadLibras: displayExt.capacidadLibras,
                              modelo: displayExt.modelo,
                              fabricacionDate: displayExt.fabricacionDate, // Assuming fabricacionDate exists
                              ultimoServicioDate: displayExt.ultimoServicioDate,
                              pruebaHidrostaticaDate: displayExt.pruebaHidrostaticaDate, // Assuming pruebaHidrostaticaDate exists
                              pressure_indicator: displayExt.pressure_indicator,
                              charge_status: displayExt.charge_status,
                            }}
                            showVencePronto={false}
                          />
                        </div>

                        <div className="flex justify-end pt-3 mt-3 border-t border-border">
                            <ExtinguisherActionsDropdown
                                extinguisherId={ext.id}
                                extinguisherType={`${displayExt.agenteExtintor} (${displayExt.capacidadLibras})`}
                                onAudit={() => handleAuditExtinguisher(ext.id)}
                                onDelete={() => handleDeleteScannedExtinguisher(ext.id, `${displayExt.agenteExtintor} (${displayExt.capacidadLibras})`)}
                            />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
