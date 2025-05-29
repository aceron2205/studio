
import { AuditSearchFilter } from '@/components/custom/audit-search-filter';
// Button, Link, ArrowLeft are no longer needed here

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-lg">
        {/* The div containing the "Volver al Inicio" button is removed */}
        <AuditSearchFilter />
      </div>
    </div>
  );
}
