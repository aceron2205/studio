
"use client";

import * as React from "react";
import { es } from "date-fns/locale/es";
import { PlayCircle, FilePlus2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduledAuditListItem } from "./scheduled-audit-list-item";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would come from a data source
const mockPendingAudits = [
  { id: '1', clientName: 'Empresa Constructora Sol', date: '2024-09-10', time: '10:00 AM', location: 'Obra Central, Av. Principal 123', status: 'Programada' },
  { id: '2', clientName: 'Restaurante Delicias Marinas', date: '2024-09-12', time: '02:30 PM', location: 'Sucursal Puerto, Calle del Mar 45', status: 'Programada' },
  { id: '3', clientName: 'Oficinas Corporativas Sigma', date: '2024-09-15', time: '09:00 AM', location: 'Edificio Alfa, Piso 10', status: 'Pendiente' },
];

export function StartAuditOptions() {
  const handleStartScheduledAudit = (auditId: string) => {
    console.log(`Starting scheduled audit: ${auditId}`);
    // Navigate to audit screen or perform start action
  };

  const handleStartNewAudit = () => {
    console.log("Starting new unscheduled audit");
    // Navigate to new audit creation screen
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <PlayCircle className="w-7 h-7" />
          Iniciar Auditoría
        </CardTitle>
        <CardDescription>
          Selecciona una auditoría programada o crea una nueva.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">
            Auditorías Programadas Pendientes
          </h3>
          {mockPendingAudits.length > 0 ? (
            <div className="space-y-4">
              {mockPendingAudits.map((audit) => (
                <ScheduledAuditListItem
                  key={audit.id}
                  audit={audit}
                  locale={es}
                  action={{
                    icon: Play,
                    label: "Iniciar esta auditoría",
                    onClick: handleStartScheduledAudit,
                    variant: 'outline', // Differentiate from download buttons
                    buttonSize: 'default', // Make button a bit larger with text
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No hay auditorías programadas pendientes.
            </p>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">
            O Iniciar una Auditoría Nueva
          </h3>
          <Button 
            onClick={handleStartNewAudit} 
            className="w-full md:w-auto"
            size="lg"
          >
            <FilePlus2 className="mr-2 h-5 w-5" />
            Crear Nueva Auditoría No Programada
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Perfecto para auditorías no planificadas o de seguimiento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
