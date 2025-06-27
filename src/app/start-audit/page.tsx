
import { StartAuditOptions } from '@/components/custom/start-audit-options';
// Button, Link, ArrowLeft are no longer needed here

export default function StartAuditPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <div className="w-full max-w-2xl">
        {/* The div containing the "Volver al Inicio" button is removed */}
        <StartAuditOptions />
      </div>
    </div>
  );
}
