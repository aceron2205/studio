'use client';

import { useState, useMemo } from 'react';

// UI Components
import { Toaster } from "@/components/ui/toaster"; // For displaying toast notifications
import { AuditSearchFilter } from '@/components/custom/audit-search-filter'; // Component for searching
import AssignedClientsList from "@/components/custom/AssignedClientsList"; // Component to list clients
import BuildingPlans from '@/components/custom/BuildingPlans'; // Component to display buildings/extinguishers
import ProcessHeader from "@/components/custom/process-header"; // ProcessHeader is imported but not used in the provided JSX. Keep if used elsewhere or remove if truly unused.

import { ScheduleAuditForm, ScheduleAuditFormData } from '@/components/custom/schedule-form';
// Data and Types
import { mockClients, Client } from '@/mocks/extinguisherMocks'; // Your mock client data
import { ExtinguisherData } from '@/types/extinguisher'; // Essential interfaces for client and extinguisher data

export default function ViewPlans() {
  // State to manage the search term entered by the user

  const title= "Ver Planos"

  const [searchTerm, setSearchTerm] = useState('');

  // State to manage the visibility of the schedule form modal
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  // State to hold the building name for which the schedule form is opened
  const [selectedBuildingNameForSchedule, setSelectedBuildingNameForSchedule] = useState<string | null>(null);

  // State to manage which client is currently selected for viewing their plans/buildings
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Memoized list of all clients that have either a scheduled audit or an extinguisher plan
  // This ensures only relevant clients are considered for display and filtering
  const allClientsWithScheduledAudits: Client[] = useMemo(() => {
    return mockClients.filter(client =>
      client.scheduledAudit || (client['extinguisher-plan'] && client['extinguisher-plan'].length > 0)
    );
  }, []); // Dependency array ensures this re-runs only if mockClients changes (unlikely)

  // Memoized list of clients filtered based on the current search term
  // It searches across client name, scheduled audit date (if present), and address
  const filteredClients = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allClientsWithScheduledAudits.filter(client =>
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (client.scheduledAudit && client.scheduledAudit.toLowerCase().includes(lowerCaseSearchTerm)) ||
      client.direccion.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, allClientsWithScheduledAudits]); // Re-filters when search term or allClients list changes

  // Memoized extinguisher plan data for the currently selected client
  // This extracts all extinguisher data associated with the selected client
  const clientExtinguisherPlan: ExtinguisherData[] = useMemo(() => {
    if (!selectedClientId) return []; // If no client is selected, return an empty array
    const client = mockClients.find(c => c.id === selectedClientId); // Find the selected client
    return client?.['extinguisher-plan'] || []; // Return their extinguisher plan, or empty array if not found
  }, [selectedClientId]); // Re-calculates when the selected client ID changes

  // Handler function for when a client is selected from the AssignedClientsList
  // It updates the selectedClientId state, which then triggers the display of BuildingPlans
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  // Handler function for navigating back to the main client list from BuildingPlans
  // It resets the selectedClientId, effectively returning to the initial view
  const handleBackToClients = () => {
    setSelectedClientId(null);
  };

  // Handler for when "Agendar Auditoría" is clicked in BuildingPlans dropdown
  const handleScheduleAuditClick = (buildingName: string) => {
    setSelectedBuildingNameForSchedule(buildingName);
    setIsScheduleFormOpen(true);
  };

  // Placeholder handler for scheduling the audit (will be replaced with actual logic later)
  const handleScheduleAuditSubmit = (data: ScheduleAuditFormData, buildingName?: string) => {
    console.log("Schedule data submitted:", data, "for building:", buildingName);
    setIsScheduleFormOpen(false); // Close the form after submission (or handle success)
  }

  console.log("ViewPlans: Component rendering. isScheduleFormOpen:", isScheduleFormOpen);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      {/* Audit search filter component */}
      <ProcessHeader title={title} />
       {/* Conditional rendering for AuditSearchFilter: Only show if no client is selected */}
        <AuditSearchFilter onSearchChange={setSearchTerm} />

      {/* Conditional rendering based on whether a client is selected */}
      {selectedClientId ? (
        <BuildingPlans
          clientExtinguisherPlan={clientExtinguisherPlan}
          onBack={handleBackToClients}
          onScheduleAuditClick={handleScheduleAuditClick} // Pass the new handler
        />
      ) : (
        <AssignedClientsList
          clients={filteredClients}
          onSelectClient={handleClientSelect}
        />
      )}

      {/* Toaster component for displaying notifications */}
      <ScheduleAuditForm
        isOpen={isScheduleFormOpen}
        onOpenChange={setIsScheduleFormOpen}
        buildingName={selectedBuildingNameForSchedule || undefined} // Pass the selected building name
        onSchedule={handleScheduleAuditSubmit} // Pass the placeholder submit handler
      />

      <Toaster />
    </div>
  );
}