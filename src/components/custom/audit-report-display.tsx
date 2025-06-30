
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionDropdownMenu } from "@/components/custom/action-dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const mockReports = [
  { auditId: "AUD-2024-001", clientName: "Cliente Innovador SA", date: "2024-07-28" },
  { auditId: "AUD-2024-002", clientName: "Soluciones Globales Ltda.", date: "2024-07-25" },
  { auditId: "AUD-2024-003", clientName: "Manufacturas Alfa", date: "2024-07-22" },
  { auditId: "AUD-2024-004", clientName: "Consultores Asociados", date: "2024-07-20" },
];

export default function AuditReportDisplay() {
  const router = useRouter();
  const { toast } = useToast();

  const handleViewAudit = (auditId: string) => {
    toast({ title: "Ver Auditoría", description: `Funcionalidad para ver detalles de la auditoría ${auditId} no implementada.` });
    // In a real app, you would navigate to a detailed report page:
    // router.push(`/reports/${auditId}`);
  };

  const handleScheduleAudit = (auditId: string) => {
    toast({ title: "Agendar Auditoría", description: `Funcionalidad para agendar nueva auditoría no implementada.` });
     // In a real app, you might open a scheduling modal/form
  };

  const handleClientApproval = (auditId: string) => {
    toast({ title: "Aprobación Cliente", description: `Funcionalidad de aprobación para ${auditId} no implementada.` });
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-card p-4 sm:p-6 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Auditoría</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow key={report.auditId}>
                <TableCell className="font-medium">{report.auditId}</TableCell>
                <TableCell>{report.clientName}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell className="text-right">
                  <ActionDropdownMenu
                    itemId={report.auditId}
                    itemName={`reporte ${report.auditId}`}
                    onView={handleViewAudit}
                    onScheduleAudit={handleScheduleAudit}
                    onClientApproval={handleClientApproval}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
