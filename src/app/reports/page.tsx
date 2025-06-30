
import AuditReportDisplay from '@/components/custom/audit-report-display';
import { Toaster } from "@/components/ui/toaster";
import ProcessHeader from '@/components/custom/process-header';

export default function ReportPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <ProcessHeader title="Reportes" />
      <div className="w-full max-w-5xl p-4 sm:p-6">
        <AuditReportDisplay />
      </div>
      <Toaster />
    </div>
  );
}
