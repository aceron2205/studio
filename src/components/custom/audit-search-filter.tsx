
"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es"; // Import Spanish locale using default import
import { SearchIcon, ListFilter, ArrowLeft } from "lucide-react"; 
import Link from "next/link"; // Import Link

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockClients = [
  { id: '1', name: 'Cliente Innovador SA', scheduledAudit: '2024-08-15', location: 'Parque Tecnológico Norte', pendingExtinguishers: 5 },
  { id: '2', name: 'Soluciones Globales Ltda.', scheduledAudit: '2024-09-20', location: 'Centro Empresarial Metropolitano', pendingExtinguishers: 2 },
  { id: '3', name: 'Consultores Asociados', scheduledAudit: '2024-08-01', location: 'Distrito Financiero Oeste', pendingExtinguishers: 8 },
  { id: '4', name: 'Manufacturas Alfa', scheduledAudit: '2024-10-10', location: 'Polígono Industrial Sur', pendingExtinguishers: 3 },
];

export function AuditSearchFilter() {
  // Search logic would be handled here, e.g., with state and useEffect
  // For now, the input is just a UI element.

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-row items-center gap-3 mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" aria-label="Volver al Inicio" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <SearchIcon className="w-6 h-6" />
          Búsqueda de Clientes
        </h1>
      </div>

      <div className="mb-8">
        <div className="relative">
            <Input
              id="generalSearchInput"
              placeholder="Nombre de cliente, fecha, ubicación..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mt-6"> {/* Adjusted margin slightly */}
          <h3 className="text-xl font-semibold mb-6 text-primary">Clientes Registrados</h3>
          {mockClients.length > 0 ? (
            <ul className="space-y-4">
              {mockClients.map((client) => (
                <li key={client.id}>
                  <Link
                    href={`/edit-plan/new?name=${encodeURIComponent(`Plano para ${client.name}`)}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Crear nuevo plano para ${client.name}`}
                  >
                    <h4 className="font-semibold text-md text-card-foreground">{client.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Auditoría Programada: {format(new Date(client.scheduledAudit), "PPP", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">Ubicación: {client.location}</p>
                    <p className="text-sm text-muted-foreground">Extintores Pendientes: {client.pendingExtinguishers}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">No se encontraron clientes.</p>
          )}
        </div>
    </div>
  );
}
