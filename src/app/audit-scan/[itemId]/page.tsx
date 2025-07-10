"use client";

import * as React from "react";
import { use } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Building as BuildingIcon, User as UserIcon } from "lucide-react"; // Added icons
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Added Input for manual code entry
import { toast } from "@/hooks/use-toast";
import ProcessHeader from "@/components/custom/process-header";

// NEW IMPORTS for Select and Form components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form"; // For form validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// Data and Types
import { ExtinguisherData } from "@/types/extinguisher"; // Assuming this path and type exists
import { mockClients, getExtinguisherPlanByClientId, Client } from "@/mocks/extinguisherMocks"; // Import mockClients and helper
import { BarcodeScanner } from "@/components/custom/barcode-scanner"; // Assuming BarcodeScanner is used for the scanning part


interface AuditScanPageProps {
  params: Promise<{
    itemId: string; // This will be the client.id or 'new-audit'
  }>;
}

// Define Zod schema for client/building selection form
const selectionSchema = z.object({
  selectedClientId: z.string().min(1, "Debe seleccionar un cliente."),
  selectedBuildingName: z.string().min(1, "Debe seleccionar una dirección/edificio."),
});

type SelectionFormData = z.infer<typeof selectionSchema>;

const AUDIT_RESULTS_TITLE = "Resultados de la Auditoría";

export default function AuditScanPage({ params: paramsPromise }: AuditScanPageProps) {
  const router = useRouter();
  const { itemId } = use(paramsPromise);

  // State to manage the current stage of the audit: selection or scanning/results
  // 'selection' -> choose client/building
  // 'scanning' -> scan extinguishers
  // 'results' -> show audit results table
  const [auditStage, setAuditStage] = React.useState<'selection' | 'scanning' | 'results'>(
    itemId === 'new-audit' ? 'selection' : 'scanning' // Start at selection if new audit
  );

  // States for selected client and building (for new unscheduled audits)
  const [selectedClientForAudit, setSelectedClientForAudit] = React.useState<Client | undefined>(undefined);
  const [selectedBuildingForAudit, setSelectedBuildingForAudit] = React.useState<string | undefined>(undefined);

  // Data for the current audit session (either from scheduled audit or new selection)
  const [currentAuditClientId, setCurrentAuditClientId] = React.useState<string | undefined>(
    itemId === 'new-audit' ? undefined : itemId // If scheduled, use itemId directly
  );
  const [currentAuditClientName, setCurrentAuditClientName] = React.useState<string | undefined>(undefined);
  const [currentAuditExtinguishers, setCurrentAuditExtinguishers] = React.useState<ExtinguisherData[]>([]);


  // Form for client/building selection
  const selectionForm = useForm<SelectionFormData>({
    resolver: zodResolver(selectionSchema),
    defaultValues: {
      selectedClientId: "",
      selectedBuildingName: "",
    },
  });

  // Watch selected client ID from the form
  const watchedSelectedClientId = selectionForm.watch("selectedClientId");

  // Filter buildings based on selected client
  const buildingOptions = React.useMemo(() => {
    if (!watchedSelectedClientId) return [];
    const client = mockClients.find(c => c.id === watchedSelectedClientId);
    if (!client || !client['extinguisher-plan']) return [];

    const uniqueBuildings = new Set<string>();
    client['extinguisher-plan'].forEach(ext => {
      if (ext.edificio && ext.edificio.trim() !== '') {
        uniqueBuildings.add(ext.edificio);
      } else {
        uniqueBuildings.add("Sin Edificio Asignado");
      }
    });
    return Array.from(uniqueBuildings).sort();
  }, [watchedSelectedClientId]);


  // Effect to load initial data if it's a scheduled audit (itemId is not 'new-audit')
  React.useEffect(() => {
    if (itemId !== 'new-audit') {
      const clientData = mockClients.find(c => c.id === itemId);
      if (clientData) {
        setCurrentAuditClientId(clientData.id);
        setCurrentAuditClientName(clientData.name);
        setCurrentAuditExtinguishers(clientData['extinguisher-plan'] || []);
        setAuditStage('scanning'); // Immediately go to scanning if it's a scheduled audit
      } else {
        // Handle case where scheduled audit ID is invalid
        console.error(`Client with ID ${itemId} not found for scheduled audit.`);
        toast({
          title: "Error de Auditoría",
          description: `No se encontró el cliente para la auditoría programada: ${itemId}.`,
          variant: "destructive"
        });
        router.replace('/scheduled-audits'); // Redirect back
      }
    }
  }, [itemId, router]);


  // Handler for submitting client/building selection form
  const handleSelectionSubmit = (data: SelectionFormData) => {
    const client = mockClients.find(c => c.id === data.selectedClientId);
    if (client) {
      setCurrentAuditClientId(client.id);
      setCurrentAuditClientName(client.name);
      // For a new unscheduled audit, we might want to audit ALL extinguishers in the selected building
      // or just the ones that exist. For simplicity, let's pass the client's full plan for now.
      // In a real app, you'd filter by selectedBuildingName here.
      const extinguishersInSelectedBuilding = client['extinguisher-plan']?.filter(ext => 
        (ext.edificio || "Sin Edificio Asignado") === data.selectedBuildingName
      ) || [];
      setCurrentAuditExtinguishers(extinguishersInSelectedBuilding);
      setSelectedClientForAudit(client); // Store the full client object
      setSelectedBuildingForAudit(data.selectedBuildingName); // Store the selected building name
      setAuditStage('scanning'); // Move to scanning stage
    } else {
      // Should not happen due to form validation, but for safety
      toast({
        title: "Error de Selección",
        description: "Cliente no encontrado. Por favor, intente de nuevo.",
        variant: "destructive"
      });
    }
  };


  const [auditedExtinguishers, setAuditedExtinguishers] = React.useState<ExtinguisherData[]>([]);
  const [showResultsTable, setShowResultsTable] = React.useState(false); // This state is now redundant with auditStage


  const handleExtinguisherScanned = (extinguisher: ExtinguisherData) => {
    setAuditedExtinguishers(prev => [...prev, extinguisher]);
  };

  const handleFinishAudit = () => {
    setAuditStage('results'); // Move to results stage
  };

  const handleSaveAudit = () => {
    console.log("Saving audit results:", auditResults);
    toast({
      title: "Auditoría Guardada",
      description: "Los resultados de la auditoría han sido guardados.",
      variant: "default"
    });
    router.replace('/scheduled-audits'); // Go back to scheduled audits page
  };

  const notAuditedExtinguishers = currentAuditExtinguishers.filter(
    (ext) => !auditedExtinguishers.some((auditedExt) => auditedExt.id === ext.id)
  );

  const auditResults = currentAuditExtinguishers.map(ext => {
    const isAudited = auditedExtinguishers.some(auditedExt => auditedExt.id === ext.id);
    return {
      ...ext,
      auditStatus: isAudited ? "Audited" : "Not Audited",
      auditDate: isAudited ? new Date().toLocaleDateString() : undefined,
    };
  });

  const getAuditStatus = (extinguisherId: string): "Audited" | "Not Audited" => {
    return auditedExtinguishers.some(ext => ext.id === extinguisherId) ? "Audited" : "Not Audited";
  };

  const getAuditDate = (extinguisherId: string): string | undefined => {
    const auditedExt = auditedExtinguishers.find(ext => ext.id === extinguisherId);
    if (auditedExt) {
      return new Date().toLocaleDateString();
    }
  };

  const handleViewDetails = (extinguisherId: string) => {
    router.push(`/audit-extinguisher/${currentAuditClientId}/${extinguisherId}`);
  };

  // Determine the header title based on the stage
  const headerTitle = auditStage === 'selection' ? 'Seleccionar Auditoría' : `Auditar: ${currentAuditClientName || 'Cargando...'}`;


  return (
    <div className="flex flex-col justify-start min-h-screen bg-background">
      <ProcessHeader title={headerTitle} /> {/* Use dynamic header title */}
      
      {auditStage === 'selection' && (
        <div className="p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary text-center mb-4">Iniciar Nueva Auditoría</h2>
          <Form {...selectionForm}>
            <form onSubmit={selectionForm.handleSubmit(handleSelectionSubmit)} className="space-y-4">
              {/* Client Selection */}
              <FormField
                control={selectionForm.control}
                name="selectedClientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockClients.map((clientOption) => (
                          <SelectItem key={clientOption.id} value={clientOption.id}>
                            {clientOption.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Building/Address Selection */}
              <FormField
                control={selectionForm.control}
                name="selectedBuildingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección / Edificio</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchedSelectedClientId || buildingOptions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <BuildingIcon className="mr-2 h-4 w-4 text-gray-500" />
                          <SelectValue placeholder={watchedSelectedClientId ? "Seleccionar dirección/edificio" : "Seleccione un cliente primero"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildingOptions.map((buildingName) => (
                          <SelectItem key={buildingName} value={buildingName}>
                            {buildingName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Buscar Extintores
              </Button>
            </form>
          </Form>
        </div>
      )}

      {auditStage === 'scanning' && (
        <>
          <div className="w-full">
            <BarcodeScanner
                itemId={currentAuditClientId!} // Pass the selected client ID
                extinguishersForPlan={currentAuditExtinguishers} // Pass the extinguishers for the selected client/building
                overrideTitle={currentAuditClientName} // Pass the client name
            />
          </div>
          <div className="flex justify-end gap-2 mt-4 mx-4">
            <Button onClick={handleSaveAudit}>Guardar Auditoría</Button>
            <Button onClick={handleFinishAudit}>Continuar</Button>
          </div>
        </>
      )}

      {auditStage === 'results' && (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{AUDIT_RESULTS_TITLE}</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extinguisher ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date of Audit</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditResults.sort((a, b) => (b.auditStatus === "Audited" ? -1 : 1)).map((ext) => (
                <TableRow key={ext.id}>
                  <TableCell>{ext.id}</TableCell>
                  <TableCell>{getAuditStatus(ext.id)}</TableCell>
                  <TableCell>{getAuditDate(ext.id) || '-'}</TableCell>
                  <TableCell className="text-right">
                    {getAuditStatus(ext.id) === "Audited" && (
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(ext.id)}>View Details</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSaveAudit}>Guardar</Button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
