
import AuditReportDisplay from '@/components/custom/audit-report-display';
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ReportPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-5xl mb-6">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
        <AuditReportDisplay />
      </div>
      <Toaster />
    </div>
  );
}
