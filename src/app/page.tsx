
"use client";

import Link from 'next/link';
import { Plus, MapPin, Archive, ClipboardPlus, ChevronRight, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type React from 'react';
import { cn } from '@/lib/utils';

// Helper component for items in the "More" section
function MoreLinkItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:bg-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={label}
    >
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
        <span className="text-md font-medium text-card-foreground">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

interface RecentAudit {
  id: string;
  clientName: string;
  date: string; // Formatted date string
  status: 'Completada' | 'En Progreso' | 'Pendiente';
}

const mockRecentAudits: RecentAudit[] = [
  { id: 'audit-rec-1', clientName: 'Constructora Delta', date: '15 de Julio, 2024', status: 'Completada' },
  { id: 'audit-rec-2', clientName: 'Oficinas Epsilon', date: '20 de Julio, 2024', status: 'En Progreso' },
  { id: 'audit-rec-3', clientName: 'Almacén Zeta', date: '28 de Julio, 2024', status: 'Pendiente' },
];

export default function HomePage() {
  const userName = "Usuario"; 

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-6">
        <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Bienvenido, {userName}
            </h1>
        </div>
        <Link href="/start-audit" passHref>
          <Button size="lg" className="w-full py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg">
            <Plus className="mr-3 h-6 w-6" />
            Iniciar Auditoría
          </Button>
        </Link>
      </header>

      <main className="flex-grow p-4 md:p-6 space-y-8">
        {/* Auditorías Recientes Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Auditorías Recientes</h2>
          <div className="space-y-3">
            {mockRecentAudits.length > 0 ? (
              mockRecentAudits.map((audit) => (
                <Link
                  key={audit.id}
                  href={`/audit-scan/${audit.id}`}
                  className="block p-4 bg-card rounded-lg shadow-sm hover:bg-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Ver auditoría para ${audit.clientName}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{audit.clientName}</h3>
                      <p className="text-sm text-muted-foreground">{audit.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {audit.status === 'Completada' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      {audit.status === 'En Progreso' && <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />}
                      {audit.status === 'Pendiente' && <Clock className="h-5 w-5 text-blue-500" />}
                      <span className={cn(
                        "text-sm font-medium",
                        audit.status === 'Completada' && "text-green-600",
                        audit.status === 'En Progreso' && "text-orange-500",
                        audit.status === 'Pendiente' && "text-blue-500"
                      )}>
                        {audit.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground p-4 bg-card rounded-lg shadow-sm text-center">
                No hay auditorías recientes para mostrar.
              </p>
            )}
          </div>
        </section>

        <Separator className="my-6 md:my-8" />

        {/* Más Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Más</h2>
          <div className="space-y-3">
            <MoreLinkItem
              href="/view-plans"
              icon={MapPin}
              label="Planos Asignados"
            />
            <MoreLinkItem
              href="/inventory"
              icon={Archive}
              label="Inventario"
            />
            <MoreLinkItem
              href="/create-plan"
              icon={ClipboardPlus}
              label="Crear Nuevo Plan"
            />
          </div>
        </section>
      </main>
      {/* MobileNav is in RootLayout and will be displayed */}
    </div>
  );
}
