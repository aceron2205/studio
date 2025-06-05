
"use client";

import { WelcomeHeader } from '@/components/custom/welcome-header';
import { MenuCard } from '@/components/custom/menu-card';
import { Users, Search, Archive, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const userName = "Usuario"; // This can be dynamic in a real app

  const menuItems = [
    {
      title: 'Gestión de Clientes',
      icon: Users,
      href: '/customers', // Placeholder, can be changed to actual route
      description: 'Administra tus clientes y contactos.',
    },
    {
      title: 'Buscador',
      icon: Search,
      href: '/search', // Existing route
      description: 'Encuentra auditorías y clientes.',
    },
    {
      title: 'Inventario',
      icon: Archive,
      href: '/inventory', // Existing route
      description: 'Consulta y gestiona repuestos.',
    },
    {
      title: 'Sincronizar',
      icon: RefreshCw,
      href: '/sync', // Placeholder, can be changed to actual route
      description: 'Actualiza datos con el servidor.',
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
