
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
 { clientId: "CLIENT-001", clientName: "Cliente Innovador SA", date: "2024-07-28", status: "Completado" },
  { clientId: "CLIENT-002", clientName: "Soluciones Globales Ltda.", date: "2024-07-25", status: "En proceso" },
  { clientId: "CLIENT-003", clientName: "Manufacturas Alfa", date: "2024-07-22", status: "Pendiente" },
  { clientId: "CLIENT-004", clientName: "Consultores Asociados", date: "2024-07-20", status: "Completado" },
];

export default function AuditReportDisplay() {
  const router = useRouter();
  const { toast } = useToast();

  const handleViewAudit = (auditId: string) => {
    toast({ title: "Ver Auditoría", description: `Funcionalidad para ver detalles de la auditoría ${auditId} no implementada.` }); // Keep toast message generic or update if needed
    // In a real app, you would navigate to a detailed report page:
    // router.push(`/reports/${auditId}`);
  };

  const handleScheduleAudit = (auditId: string) => {
    toast({ title: "Agendar Auditoría", description: `Funcionalidad para agendar nueva auditoría no implementada.` }); // Keep toast message generic or update if needed
     // In a real app, you might open a scheduling modal/form
  };

  const handleClientApproval = (auditId: string) => {
    toast({ title: "Aprobación Cliente", description: `Funcionalidad de aprobación para ${auditId} no implementada.` }); // Keep toast message generic or update if needed
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-card p-4 sm:p-6 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead> {/* Changed header */}
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead> {/* Added Status header */}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow key={report.clientId}> {/* Changed key to clientId */}
                <TableCell className="font-medium">{report.clientId}</TableCell> {/* Display clientId */}
                <TableCell>{report.clientName}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status}</TableCell> {/* Display status */}
                <TableCell className="text-right">
                  <ActionDropdownMenu
                    itemId={report.clientId} // Pass clientId
                    itemName={`reporte cliente ${report.clientId}`} // Update item name
                    onView={() => handleViewAudit(report.clientId)} // Pass clientId to handler
                    onScheduleAudit={() => handleScheduleAudit(report.clientId)} // Pass clientId to handler
                    onClientApproval={() => handleClientApproval(report.clientId)} // Pass clientId to handler
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
