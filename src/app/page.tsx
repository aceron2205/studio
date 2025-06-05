
"use client";

import { WelcomeHeader } from '@/components/custom/welcome-header';
import { MenuCard } from '@/components/custom/menu-card';
import { ClipboardList, LayoutGrid, Search, Users } from 'lucide-react'; // Using different icons for this version

export default function HomePage() {
  const userName = "Usuario"; // This can be dynamic in a real app

  const menuItems = [
    {
      title: 'Iniciar Auditoría', // Changed from "Gestión de Clientes"
      icon: Users, // Re-using Users icon, could be FileSearch or similar
      href: '/start-audit', 
      description: 'Comienza una nueva auditoría o continúa una existente.',
    },
    {
      title: 'Ver Planos Asignados', // Changed from "Buscador"
      icon: LayoutGrid, // Using LayoutGrid, could be Map
      href: '/view-plans',
      description: 'Visualiza y gestiona los planos de ubicación.',
    },
    {
      title: 'Crear Nuevo Plano', // Changed from "Inventario"
      icon: Search, // Re-using Search, could be FilePlus
      href: '/create-plan',
      description: 'Diseña un nuevo plano de extintores.',
    },
    {
      title: 'Auditorías Recientes', // Restored
      icon: ClipboardList,
      href: '/reports', // Assuming reports page shows recent audits
      description: 'Revisa informes de auditorías completadas.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <WelcomeHeader userName={userName} />

      <main className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
      </main>
      {/* MobileNav is in RootLayout and will be displayed */}
    </div>
  );
}
