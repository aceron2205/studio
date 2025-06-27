
'use client';

import  AssignedClientsList from "@/components/custom/AssignedClientsList";
import { Toaster } from "@/components/ui/toaster";
import { AuditSearchFilter } from '@/components/custom/audit-search-filter';
import { useState, useMemo } from 'react';
import { mockClients } from '@/mocks/extinguisherMocks';

interface Client {
  id: string;
  name: string;
  scheduledAudit?: string; // Making it optional as not all clients might have a scheduled audit
  direccion: string;
  pendingExtinguishers: number;
}

export default function ViewPlans() {
  const allClientsWithScheduledAudits: Client[] = useMemo(() => {
    return mockClients.filter(client => client.scheduledAudit);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
// MODIFIED: filteredClients now depends on searchTerm and allClientsWithScheduledAudits
const filteredClients = useMemo(() => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return allClientsWithScheduledAudits.filter(client =>
    client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
    (client.scheduledAudit && client.scheduledAudit.toLowerCase().includes(lowerCaseSearchTerm)) ||
    client.direccion.toLowerCase().includes(lowerCaseSearchTerm)
  );
}, [searchTerm, allClientsWithScheduledAudits]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <AuditSearchFilter onSearchChange={setSearchTerm} />
      <AssignedClientsList clients={filteredClients} />
      </div>
  );
}
