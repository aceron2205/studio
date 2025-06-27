
'use client'

import { AuditSearchFilter } from '@/components/custom/audit-search-filter';
import AssignedClientsList from '@/components/custom/AssignedClientsList';
import { Button } from '@/components/ui/button';
import { mockClients } from '@/mocks/extinguisherMocks';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      (client.scheduledAudit && format(new Date(client.scheduledAudit), 'PPP', { locale: es }).toLowerCase().includes(searchLower)) ||
      client.direccion.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <div className="w-full max-w-lg">
        <AuditSearchFilter onSearchChange={(value) => setSearchTerm(value)} />
      </div>
      <AssignedClientsList clients={filteredClients} />
    </div>
  );
}
