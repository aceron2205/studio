
import Link from 'next/link';
import { MenuCard } from '@/components/custom/menu-card';
import { WelcomeHeader } from '@/components/custom/welcome-header';
import {
  FileText, // For Reportes
  Settings, // For Configuración
  ListChecks, // For Auditorías Programadas (Start Audit)
  ClipboardPlus, // For Crear Nuevo Plan
  MapPinned, // For Planos Asignados / Ver Planos
  // Search was removed when "Buscador" card was removed
  // RefreshCw was removed when Sincronizar card was removed
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const menuItems = [
    { title: 'Iniciar Auditoría', icon: ListChecks, href: '/start-audit', description: 'Comenzar una nueva inspección o continuar una programada.' },
    { title: 'Crear Nuevo Plan', icon: ClipboardPlus, href: '/create-plan', description: 'Diseñar un nuevo plano de ubicación de extintores.' },
    { title: 'Ver Planos Asignados', icon: MapPinned, href: '/view-plans', description: 'Revisar y gestionar planos existentes.' },
    { title: 'Reportes', icon: FileText, href: '#', description: 'Visualizar informes y estadísticas de auditorías.' }, // Placeholder href
    { title: 'Configuración', icon: Settings, href: '#', description: 'Ajustar preferencias de la aplicación.' }, // Placeholder href
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <WelcomeHeader userName="Usuario" />
      <main className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.title}
              title={item.title}
              icon={item.icon}
              href={item.href}
              description={item.description}
            />
          ))}
        </div>
        <Separator className="my-8" />
        {/* Placeholder for any other content or quick actions */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Más funcionalidades próximamente.
          </p>
        </div>
      </main>
      {/* Footer is handled by MobileNav or a dedicated footer component if needed outside this page */}
    </div>
  );
}
