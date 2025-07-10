
"use client";

import AuditReportDisplay from '@/components/custom/audit-report-display';
import { Toaster } from "@/components/ui/toaster";
import ProcessHeader from '@/components/custom/process-header';

// Define a type for the audit data in reports
interface ReportAudit {
  fecha: string;
  client: {
    name: string;
    direccion: string;
  };
  status: string;
}

const mockReportAudits: ReportAudit[] = [
  {
    fecha: "2023-10-27",
    client: { name: "Cliente A", direccion: "Calle Falsa 123" },
    status: "Completo",
  },
  {
    fecha: "2023-11-15",
    client: { name: "Cliente B", direccion: "Avenida Siempre Viva 45" },
    status: "En Progreso",
  },
  {
    fecha: "2023-12-01",
    client: { name: "Cliente C", direccion: "Boulevard del Sol 67" },
    status: "Agendado",
  },
];

const title = "Reportes de Auditoría"; // Title for the header

export default function ReportPage() {
  return (
    <>
      <ProcessHeader title={title} goBack={() => history.back()} />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Reportes de Auditoría</h1>

        {/* Render the AuditReportDisplay component */}
        <AuditReportDisplay />
      </div>
      <Toaster />
    </>
  );
}
