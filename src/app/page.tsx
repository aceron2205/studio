
"use client";

import * as React from 'react'; // Added this line
import Link from 'next/link';
import { UserCircle, Plus, CheckCircle2, RefreshCw, Clock, MapPin, Archive, FilePlus2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RecentAudit {
  id: string;
  companyName: string;
  date: string;
  status: 'Completada' | 'En Progreso' | 'Pendiente';
  href: string;
}

interface MoreLink {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const recentAuditsData: RecentAudit[] = [
  { id: 'audit-1', companyName: 'Constructora Delta', date: '15 de Julio, 2024', status: 'Completada', href: '/reports/delta' },
  { id: 'audit-2', companyName: 'Oficinas Epsilon', date: '20 de Julio, 2024', status: 'En Progreso', href: '/reports/epsilon' },
  { id: 'audit-3', companyName: 'Almacén Zeta', date: '28 de Julio, 2024', status: 'Pendiente', href: '/reports/zeta' },
];

const moreLinksData: MoreLink[] = [
  { id: 'link-1', label: 'Planos Asignados', icon: MapPin, href: '/view-plans' },
  { id: 'link-2', label: 'Inventario', icon: Archive, href: '/inventory' },
  { id: 'link-3', label: 'Crear Nuevo Plan', icon: FilePlus2, href: '/create-plan' },
];

const statusStyles = {
  Completada: 'text-green-600',
  'En Progreso': 'text-orange-500',
  Pendiente: 'text-blue-500',
};

const statusIcons = {
  Completada: CheckCircle2,
  'En Progreso': RefreshCw,
  Pendiente: Clock,
};

export default function HomePage() {
  const userName = "Usuario";

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Bienvenido, {userName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Listo para tu próxima auditoría.
            </p>
          </div>
          <UserCircle className="h-10 w-10 text-muted-foreground" />
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 space-y-6">
        <Link href="/start-audit" passHref>
          <Button size="lg" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-6 w-6" />
            Iniciar Auditoría
          </Button>
        </Link>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Auditorías Recientes</h2>
          <div className="space-y-3">
            {recentAuditsData.map((audit, index) => (
              <React.Fragment key={audit.id}>
                <Link href={audit.href} className="block rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-card-foreground">{audit.companyName}</p>
                      <p className="text-xs text-muted-foreground">{audit.date}</p>
                    </div>
                    <div className={cn("flex items-center text-xs font-medium", statusStyles[audit.status])}>
                      {React.createElement(statusIcons[audit.status], { className: "mr-1.5 h-4 w-4" })}
                      {audit.status}
                    </div>
                  </div>
                </Link>
                {index < recentAuditsData.length - 1 && <Separator />}
              </React.Fragment>
            ))}
            {recentAuditsData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay auditorías recientes.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Más</h2>
          <div className="space-y-0.5">
            {moreLinksData.map((link, index) => (
               <React.Fragment key={link.id}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center">
                    <link.icon className="mr-3 h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">{link.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                {index < moreLinksData.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
      {/* MobileNav is in RootLayout and will be displayed */}
    </div>
  );
}
