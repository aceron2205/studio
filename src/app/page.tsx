
import { WelcomeHeader } from '@/components/custom/welcome-header';
import { MenuCard } from '@/components/custom/menu-card';
import { Search, Archive, RefreshCw, Download, CalendarDays, Edit3, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const userName = "Usuario"; // Placeholder, replace with actual user data logic

  const menuItems = [
    { title: 'Auditorías', icon: CalendarDays, href: '/scheduled-audits', description: 'Gestionar auditorías' },
    { title: 'Buscador', icon: Search, href: '/search', description: 'Filtrar auditorías' },
    { title: 'Inventario', icon: Archive, href: '#', description: 'Consultar stock' },
    { title: 'Sincronizar', icon: RefreshCw, href: '#', description: 'Actualizar datos' },
    { title: 'Inicia auditoría', icon: FilePlus2, href: '/start-audit', description: 'Comenzar una nueva auditoría' },
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
        
        <footer className="text-center py-10 mt-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MobileFlow. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}
