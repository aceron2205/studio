
"use client";

import * as React from "react";
import { es } from "date-fns/locale/es"; // For passing locale
import { CalendarCheck, ArrowLeft } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScheduledAuditListItem } from "./scheduled-audit-list-item";
import type { AuditAction } from "./scheduled-audit-list-item"; // Import AuditAction type
import { Download } from "lucide-react"; // Keep Download for the action

const mockScheduledAudits = [
  { id: '1', clientName: 'Empresa Constructora Sol', date: '2024-09-10', time: '10:00 AM', location: 'Obra Central, Av. Principal 123', status: 'Programada' },
  { id: '2', clientName: 'Restaurante Delicias Marinas', date: '2024-09-12', time: '02:30 PM', location: 'Sucursal Puerto, Calle del Mar 45', status: 'Programada' },
  { id: '3', clientName: 'Oficinas Corporativas Sigma', date: '2024-09-15', time: '09:00 AM', location: 'Edificio Alfa, Piso 10', status: 'Programada' },
  { id: '4', clientName: 'Taller Mecánico "El Rápido"', date: '2024-09-18', time: '11:00 AM', location: 'Zona Industrial Este, Lote 7B', status: 'Programada' },
  { id: '5', clientName: 'Colegio "Nueva Era"', date: '2024-09-22', time: '01:00 PM', location: 'Campus Principal, Sector Educativo', status: 'Programada' },
];

export function ScheduledAuditsCalendar() {
  const handleDownloadAudit = (auditId: string) => {
    console.log(`Downloading audit ${auditId}`);
    // Implement actual download logic here
  };

  const downloadAction: AuditAction = {
    icon: Download,
    label: "Descargar", 
    onClick: handleDownloadAudit,
    variant: 'outline', 
    buttonSize: 'default', 
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3"> {/* Removed justify-between */}
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" aria-label="Volver al Inicio" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          Auditorías Programadas
        </CardTitle>
        {/* CalendarIcon button removed from here */}
      </CardHeader>
      <CardContent>
        {mockScheduledAudits.length > 0 ? (
          <div className="space-y-6">
            {mockScheduledAudits.map((audit) => (
              <ScheduledAuditListItem 
                key={audit.id} 
                audit={audit} 
                locale={es} 
                actions={[downloadAction]} // Pass actions as an array
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No hay auditorías programadas por el momento.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
