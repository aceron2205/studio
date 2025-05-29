
"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es"; // Import Spanish locale
import { SearchIcon, ListFilter } from "lucide-react"; // Changed FilterIcon to ListFilter

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const mockClients = [
  { id: '1', name: 'Cliente Innovador SA', lastAudit: '2024-07-15', location: 'Parque Tecnológico Norte' },
  { id: '2', name: 'Soluciones Globales Ltda.', lastAudit: '2024-06-20', location: 'Centro Empresarial Metropolitano' },
  { id: '3', name: 'Consultores Asociados', lastAudit: '2024-07-01', location: 'Distrito Financiero Oeste' },
  { id: '4', name: 'Manufacturas Alfa', lastAudit: '2024-05-10', location: 'Polígono Industrial Sur' },
];

export function AuditSearchFilter() {
  // Search logic would be handled here, e.g., with state and useEffect
  // For now, the input is just a UI element.

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <SearchIcon className="w-6 h-6" />
          Filtrar Auditorías
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="generalSearchInput" className="text-sm font-medium">Búsqueda Rápida</Label>
          <div className="relative mt-1">
            <Input
              id="generalSearchInput"
              placeholder="Nombre de cliente, fecha, ubicación..."
              className="pr-10" // Padding right for the icon
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ListFilter className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mt-6"> {/* Adjusted margin slightly */}
          <h3 className="text-xl font-semibold mb-6 text-primary">Clientes Registrados</h3>
          {mockClients.length > 0 ? (
            <ul className="space-y-4">
              {mockClients.map((client) => (
                <li key={client.id} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-md text-card-foreground">{client.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Última Auditoría: {format(new Date(client.lastAudit), "PPP", { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">Ubicación: {client.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">No se encontraron clientes.</p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
