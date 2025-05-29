
import { ScheduledAuditsCalendar } from '@/components/custom/scheduled-audits-calendar';
// Button, Link, ArrowLeft are no longer needed here as the back button is in the Card component

export default function ScheduledAuditsPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-2xl">
        {/* The div containing the "Volver al Inicio" button is removed */}
        <ScheduledAuditsCalendar />
      </div>
    </div>
  );
}
