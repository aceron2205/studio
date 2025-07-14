'use client';

import { useState, useMemo } from 'react';

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { AuditSearchFilter } from '@/components/custom/audit-search-filter';
import AssignedClientsList from "@/components/custom/AssignedClientsList";
import BuildingPlans from '@/components/custom/BuildingPlans';
import ProcessHeader from "@/components/custom/process-header";
import { ScheduleAuditForm, ScheduleAuditFormData } from '@/components/custom/schedule-form';

// Data and Types
import { mockClients, Client } from '@/mocks/extinguisherMocks';

export default function ViewPlans() {
  const title = "Ver Planos";

  const [searchTerm, setSearchTerm] = useState('');
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [selectedBuildingNameForSchedule, setSelectedBuildingNameForSchedule] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const allClientsWithScheduledAudits: Client[] = useMemo(() => {
    return mockClients.filter(client =>
      client.scheduledAudit ||
      (client['extinguisher-plan'] && client['extinguisher-plan'].length > 0)
    );
  }, []);

  const filteredClients = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allClientsWithScheduledAudits.filter(client =>
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (client.scheduledAudit && client.scheduledAudit.toLowerCase().includes(lowerCaseSearchTerm)) ||
      client.direccion.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, allClientsWithScheduledAudits]);

  const selectedClient = useMemo(() => {
    return mockClients.find(c => c.id === selectedClientId);
  }, [selectedClientId]);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
  };

  const handleScheduleAuditClick = (buildingName: string) => {
    setSelectedBuildingNameForSchedule(buildingName);
    setIsScheduleFormOpen(true);
  };

  const handleScheduleAuditSubmit = (data: ScheduleAuditFormData, buildingName?: string) => {
    console.log("Schedule data submitted:", data, "for building:", buildingName);
    setIsScheduleFormOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <ProcessHeader title={title} />
      {!selectedClient && (
        <AuditSearchFilter onSearchChange={setSearchTerm} />
      )}

      {selectedClient ? (
        <BuildingPlans
          selectedClient={selectedClient}
          onBack={handleBackToClients}
          onScheduleAuditClick={handleScheduleAuditClick}
        />
      ) : (
        <AssignedClientsList
          clients={filteredClients}
          onSelectClient={handleClientSelect}
        />
      )}

      <ScheduleAuditForm
        isOpen={isScheduleFormOpen}
        onOpenChange={setIsScheduleFormOpen}
        buildingName={selectedBuildingNameForSchedule || undefined}
        onSchedule={handleScheduleAuditSubmit}
      />

      <Toaster />
    </div>
  );
}
