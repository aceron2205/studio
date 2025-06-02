
import { WelcomeHeader } from '@/components/custom/welcome-header';
import { MenuCard } from '@/components/custom/menu-card';
import { Search, Archive, RefreshCw, Map, FilePlus2, ListChecks } from 'lucide-react';
// Download and Edit3 icons are no longer needed as Quick Actions are removed
// import { Download, Edit3 } from 'lucide-react';
// Button and Link for Quick Actions are no longer needed
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

export default function HomePage() {
  const userName = "Usuario"; // Placeholder, replace with actual user data logic

  const menuItems = [
    // Fila Superior
    { title: 'Inicia auditoría', icon: FilePlus2, href: '/start-audit', description: 'Comenzar una nueva auditoría' },
    { title: 'Planos Asignados', icon: ListChecks, href: '/view-plans', description: 'Visualizar y gestionar planos' },
    // Fila Central
    { title: 'Crear Diseño de Plano', icon: Map, href: '/create-plan', description: 'Diseñar o registrar auditoría' },
    { title: 'Inventario', icon: Archive, href: '/inventory', description: 'Consultar stock de repuestos' },
    // Fila Inferior
    { title: 'Buscador', icon: Search, href: '/search', description: 'Filtrar auditorías' },
    { title: 'Sincronizar', icon: RefreshCw, href: '#', description: 'Actualizar datos' },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background font-sans">
      <div className="w-full max-w-md p-5"> {/* Changed padding to p-5 for slightly less padding */}
        <WelcomeHeader userName={userName} />
        
        <main className="mt-4">
          <div className="grid grid-cols-2 gap-5"> {/* Changed gap to gap-5 */}
            {menuItems.map((item, index) => (
              <MenuCard
                key={item.title + index} // Added index to key for safety if titles aren't unique
                title={item.title}
                icon={item.icon}
                href={item.href}
                description={item.description}
              />
            ))}
          </div>
        </main>

        {/* Quick Actions section removed
        <section aria-labelledby="quick-actions-title" className="mt-10">
          <h2 id="quick-actions-title" className="text-xl font-semibold text-center mb-4 text-primary">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="#">
                Descargar Auditorías
                <Download className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="#">
                Editar auditoría
                <Edit3 className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
        */}
        
        <footer className="text-center py-10 mt-6">
          {/* The requested paragraph has been removed */}
        </footer>
      </div>
    </div>
  );
}
