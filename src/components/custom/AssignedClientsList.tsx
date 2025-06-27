// src/components/custom/AssignedClientsList.tsx
import React from 'react'; // Removed useEffect, useState as they are unused
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
import Link from 'next/link';

// Import the Client interface from mocks (as it now contains the plan)
import { Client } from '@/mocks/extinguisherMocks';

interface AssignedClientsListProps {
  clients: Client[]; // Now expects the Client interface with embedded plan
}

const AssignedClientsList: React.FC<AssignedClientsListProps> = ({ clients }) => {
  // --- Removed: (date formatting logic removed from here as it's now inline in JSX) ---
  // The useEffect and useState for `formattedDates` are no longer needed because
  // the date formatting is done directly in the JSX using a ternary operator.

  return (
    <ul className="container mx-auto px-2 pt-1 sm:px-6 lg:px-8 py-8">
      {clients.map((client) => (
        <li key={client.id} className="flex items-center border-b last:border-b-0">
          <Link
            href={`/create-plan?clientId=${client.id}`}
            className="flex items-center p-2 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Crear nuevo plano para ${client.name}`}
          >
            <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-foreground text-xl font-bold mr-4">
              {client.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-md text-card-foreground">{client.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Auditoría Programada: {client.scheduledAudit ? format(parseISO(client.scheduledAudit), "PPP", { locale: es }) : 'No Programada'}
              </p>
              <p className="text-sm text-muted-foreground">Ubicación: {client.direccion}</p>
              <p className="text-sm text-muted-foreground">Extintores Pendientes: {client.pendingExtinguishers}</p>

            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AssignedClientsList;