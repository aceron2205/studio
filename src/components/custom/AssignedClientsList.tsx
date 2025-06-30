// src/components/custom/AssignedClientsList.tsx
"use client"

import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
// REMOVE THIS LINE: import Link from 'next/link'; // <--- REMOVE THIS IMPORT

import { Client } from '@/mocks/extinguisherMocks'; // Import the Client interface from types

interface AssignedClientsListProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void; // This prop is essential for staying on the same page
}

const AssignedClientsList: React.FC<AssignedClientsListProps> = ({ clients, onSelectClient }) => {
  return (
    <div className="container mx-auto px-2 pt-1 sm:px-6 lg:px-8 py-8 w-full max-w-2xl">
      {clients.length === 0 ? (
        <p className="text-center text-muted-foreground">No se encontraron clientes asignados con auditorías programadas.</p>
      ) : (
        clients.map((client) => (
          // Use a div with an onClick handler instead of Link
          <div
            key={client.id}
            onClick={() => onSelectClient(client.id)} // <--- Call the onSelectClient prop here
            className="flex items-center p-4 rounded-lg shadow-sm bg-card cursor-pointer hover:bg-card-hover transition-colors mb-4"
            role="button" // Improve accessibility for clickable div
            tabIndex={0} // Make it focusable
            aria-label={`Seleccionar cliente ${client.name}`}
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
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedClientsList;