"use client";

import * as React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Building as BuildingIcon, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";
import ProcessHeader from "@/components/custom/process-header";
import { useParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator";
import { useAudit } from "@/context/audit-context";

// Imports for Select and Form components
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// Data and Types
import { ExtinguisherData } from "@/types/extinguisher"; // Assuming this path and type exists
import { mockClients, Client } from "@/mocks/extinguisherMocks"; // Import mockClients
import { BarcodeScanner } from "@/components/custom/barcode-scanner";
//import { SignaturePad } from "@/components/custom/signature-pad";

const selectionSchema = z.object({
  selectedClientId: z.string().min(1, "Debe seleccionar un cliente."),
  selectedBuildingId: z.string().min(1, "Debe seleccionar una dirección/edificio."),
});

type SelectionFormData = z.infer<typeof selectionSchema>;

const AUDIT_RESULTS_TITLE = "Resultados de la Auditoría";

export default function AuditScanPage() {
  const router = useRouter();
  const { auditId: rawAuditId } = useParams();
  const auditId = Array.isArray(rawAuditId) ? rawAuditId[0] : rawAuditId;

  const isNewAudit = auditId === "new";


  const selectionForm = useForm<SelectionFormData>({
    resolver: zodResolver(selectionSchema),
    defaultValues: {
      selectedClientId: "",
      selectedBuildingId: "",
    },
  });

  const {
    client: auditContextClient,
    setClient,
    buildingName: auditContextBuildingName,
    setBuildingName,
    auditedExtinguishers,
    setAuditedExtinguishers,
  } = useAudit();

  const [auditStage, setAuditStage] = useState<'selection' | 'scanning' | 'results'>(isNewAudit ? 'selection' : 'scanning');

  const [clientSignature, setClientSignature] = useState<string | null>(null);

  const [currentAuditExtinguishers, setCurrentAuditExtinguishers] = useState<ExtinguisherData[]>([]);
  const [currentAuditClientId, setCurrentAuditClientId] = useState<string | null>(isNewAudit ? null : auditId ?? null);
  const [currentAuditClientName, setCurrentAuditClientName] = useState<string | null>(null);

  // Debugging useEffect: logs auditedExtinguishers and currentAuditExtinguishers changes
  useEffect(() => {
    console.log("AuditScanPage: auditedExtinguishers updated:", auditedExtinguishers.map(e => e.id));
    console.log("AuditScanPage: currentAuditExtinguishers:", currentAuditExtinguishers.map(e => e.id));
  }, [auditedExtinguishers, currentAuditExtinguishers]);

  // handleAuditComplete function: Centralized logic for updating audited extinguishers and navigating
  const handleAuditComplete = (extinguisher: ExtinguisherData) => {
    setAuditedExtinguishers(prev => {
      const existingIndex = prev.findIndex(e => e.id === extinguisher.id);
      let updatedAuditedList;

      if (existingIndex > -1) {
        // If it already exists, update the existing entry with the new data
        updatedAuditedList = prev.map((e, idx) =>
          idx === existingIndex ? extinguisher : e
        );
      } else {
        // Otherwise, add it as a new entry
        updatedAuditedList = [...prev, extinguisher];
      }

      console.log("AuditScanPage: auditedExtinguishers after handleAuditComplete (deduplicated):", updatedAuditedList.map(e => e.id));
      return updatedAuditedList;
    });
    router.push(`/audit-scan/${auditId}`); // Navigate back to the scan page
  };

  // Main useEffect: Handles initial client/audit data setup when the page loads or auditId changes
  useEffect(() => {
    if (isNewAudit) {
      setClient(null);
      setBuildingName(null); // Correctly clears for a new audit
      setAuditedExtinguishers([]);
    } else {
      // This runs when loading an existing audit via URL (e.g., /audit-scan/client-1)
      const client = mockClients.find((c) => c.id === auditId);
      if (client) {
        setClient(client); // Set the client context
        setCurrentAuditClientId(client.id);
        setCurrentAuditClientName(client.name);

        const extinguishersForClient = client['extinguisher-plan'] || [];
        setCurrentAuditExtinguishers(extinguishersForClient);

        if (extinguishersForClient.length > 0) {
            const firstExtinguisherBuildingName = extinguishersForClient[0].edificio || extinguishersForClient[0].edifi_id;
            setBuildingName(String(firstExtinguisherBuildingName || client.name)); // Set building name
        } else {
            // Fallback if no extinguishers in plan
            setBuildingName(client.name || 'Edificio Principal'); // Default if no building info is found
        }

        setAuditStage('scanning'); // Keep the page in the scanning stage when loaded
      } else {
        toast({
          title: "Error",
          description: `No se encontró cliente con ID: ${auditId}`,
          variant: "destructive",
        });
        router.replace("/scheduled-audits");
      }
    }
  }, [isNewAudit, auditId, setClient, setBuildingName, setAuditedExtinguishers, router]);


  const watchedSelectedClientId = selectionForm.watch('selectedClientId');

  const handleSelectionSubmit = (data: SelectionFormData) => {
    const client = mockClients.find(c => c.id === data.selectedClientId);

    if (client) {
      setClient(client);
      setBuildingName(data.selectedBuildingId);
      setCurrentAuditClientId(client.id);
      setCurrentAuditClientName(client.name);

      const extinguishers = client['extinguisher-plan']?.filter(
        (ext: ExtinguisherData) =>
          ext.edifi_id === data.selectedBuildingId ||
          ext.edificio === data.selectedBuildingId
      ) || [];
      setCurrentAuditExtinguishers(extinguishers);
      setAuditedExtinguishers([]); 
      setAuditStage('scanning');
      toast({
        title: "Error de Selección",
        description: "Cliente no encontrado. Por favor, intente de nuevo.",
        variant: "destructive"
      });
    }
  };

  // This is called by the BarcodeScanner when an extinguisher is scanned
  const handleExtinguisherScanned = (extinguisher: ExtinguisherData) => {
    handleAuditComplete(extinguisher); // Delegate to the centralized handler
  };

  // This function is now primarily for navigating to the results page
  const handleViewResults = () => {
    if (!auditContextClient || !auditContextBuildingName) {
      toast({
        title: "Error",
        description: "Faltan datos del cliente o del edificio.",
        variant: "destructive",
      });
      return;
    }
    router.push("/audit-review-sign"); 
  };

  const handleSaveAudit = () => {
    console.log("Saving audit...");
    // Implement saving logic here
    toast({
      title: "Guardado",
      description: "Auditoría guardada exitosamente.",
    });
  };


  const handleProceedToSignature = () => {
    router.push("/audit-review-sign");
  };


  // Derived state for filtered and mapped extinguishers
  const notAuditedExtinguishers = React.useMemo(() => {
    return currentAuditExtinguishers.filter(
      (ext: ExtinguisherData) => !auditedExtinguishers.some((auditedExt: ExtinguisherData) => auditedExt.id === ext.id)
    );
  }, [currentAuditExtinguishers, auditedExtinguishers]);

  const auditResults = React.useMemo(() => {
    return currentAuditExtinguishers.map((ext: ExtinguisherData) => {
      const isAudited = auditedExtinguishers.some((auditedExt: ExtinguisherData) => auditedExt.id === ext.id);
      return {
        ...ext,
        auditStatus: isAudited ? "Audited" : "Not Audited",
        auditDate: isAudited ? new Date().toLocaleDateString() : undefined, // This will be current date, for actual audit date, it needs to be stored with extinguisher in context
      };
    });
  }, [currentAuditExtinguishers, auditedExtinguishers]);


  const getAuditStatus = (extinguisherId: string): "Audited" | "Not Audited" | undefined => {
    return auditedExtinguishers.some((ext: ExtinguisherData) => ext.id === extinguisherId) ? "Audited" : "Not Audited";
  };

  const getAuditDate = (extinguisherId: string): string | undefined => {
    const auditedExt = auditedExtinguishers.find((ext: ExtinguisherData) => ext.id === extinguisherId);
    if (auditedExt) {
      // If you store actual audit date in ExtinguisherData, use that here.
      // For now, it reflects the current date if audited.
      return new Date().toLocaleDateString();
    }
    return undefined;
  };

  const handleViewDetails = (extinguisherId: string) => {
    // Navigate to the audit form for editing/viewing a specific extinguisher
    router.push(`/audit-extinguisher/${currentAuditClientId}/${extinguisherId}`);
  };


  return (
    <>
      <Toaster />
      <ProcessHeader
        title={
          auditStage === "selection"
            ? "Inicio de Auditoría"
            : auditStage === "scanning"
              ? (currentAuditClientName
                  ? currentAuditClientName
                  : "Escanear Extintores"
                )
              : AUDIT_RESULTS_TITLE
        }
        goBack={() => router.back()}
      />

      {/* Debugging div (optional, remove once confirmed working) */}
      <div className="p-2 bg-blue-100 text-blue-800 text-sm text-center">
        Audited Count: {auditedExtinguishers.length} - IDs: {auditedExtinguishers.map(e => e.id).join(', ')}
      </div>

      {auditStage === 'selection' && (
        <div className="p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary text-center mb-4">Seleccionar Cliente y Dirección</h2>
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
                        {mockClients.map((clientOption: Client) => (
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
              {watchedSelectedClientId && (
                <FormField
                  control={selectionForm.control}
                  name="selectedBuildingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección / Edificio</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={mockClients.find(c => c.id === watchedSelectedClientId)?.['extinguisher-plan']?.filter(ext => ext.edifi_id === watchedSelectedClientId || ext.edificio === watchedSelectedClientId).length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <BuildingIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <SelectValue placeholder={watchedSelectedClientId ? "Seleccionar dirección/edificio" : "Seleccione un cliente primero"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClients.find(c => c.id === watchedSelectedClientId)?.['extinguisher-plan']
                           ?.filter((ext: ExtinguisherData) => ext.edifi_id || ext.edificio)
                           .reduce((uniqueBuildings: { id: string; name: string }[], ext: ExtinguisherData) => {
                              const buildingId = ext.edifi_id || ext.edificio;
                              const buildingName = String(ext.edificio || '') || String(ext.edifi_id || '') || '';
                              if (buildingId && buildingName && !uniqueBuildings.find(b => b.id === buildingId)) {
                                  uniqueBuildings.push({ id: buildingId, name: buildingName });
                              } return uniqueBuildings;}, []).map((building: { id: string; name: string }) => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Buscar Extintores
              </Button>
            </form>
          </Form>
          <Separator className="my-8"/>
          <div className="text-center text-muted-foreground">
            O escanee un código
          </div>
          <BarcodeScanner
            itemId="new-unscheduled-scan"
            extinguishersForPlan={[]}
            overrideTitle="Escanear Código"
            onExtinguisherScanned={handleExtinguisherScanned}
            showSearchBar={true}
            showCamera={true}
          />
        </div>
      )}

      {auditStage === 'scanning' && (
        <>
          <div className="w-full p-4">
            <BarcodeScanner
              itemId={currentAuditClientId ?? "unspecified-client"}
              extinguishersForPlan={currentAuditExtinguishers}
              overrideTitle={currentAuditClientName ?? "Auditoría"}
              onExtinguisherScanned={handleExtinguisherScanned}
              showSearchBar={true}
              showCamera={true}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4 mx-4">
            <Button onClick={handleSaveAudit}>Guardar Auditoría</Button>
            <Button
              onClick={handleViewResults}
              disabled={auditedExtinguishers.length === 0}>Ver Resultados</Button>
          </div>
          {/* Removed "Extintores en el Plan" table from here, as per previous discussion */}
        </>
      )}

      {auditStage === 'results' && (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{AUDIT_RESULTS_TITLE}</h2>


          {/* Table showing ALL extinguishers in the plan (moved here in previous steps) */}
          {currentAuditExtinguishers.length > 0 && (
            <div className="p-4 mt-8 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Extintores en el Plan (Todos)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAuditExtinguishers.map((extinguisher) => (
                    <TableRow key={extinguisher.id}>
                      <TableCell>{extinguisher.id}</TableCell>
                      <TableCell>{extinguisher.ubicacion}</TableCell>
                      <TableCell>{getAuditStatus(extinguisher.id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-between gap-2 mt-4">
            <Button onClick={handleSaveAudit}>Guardar</Button>
            <Button onClick={handleProceedToSignature}>Proceder a Firma</Button>
          </div>
        </div>
      )}
    </>
  );
}