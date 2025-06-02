
import Link from 'next/link';
import { UserCircle, Plus, MapPin, Archive, ClipboardPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type React from 'react';

// Helper component for items in the "Más" section
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
      className="flex items-center p-4 bg-card rounded-lg shadow-sm hover:bg-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={label}
    >
      <Icon className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
      <span className="text-md font-medium text-card-foreground">{label}</span>
    </Link>
  );
}

export default function HomePage() {
  const userName = "Usuario"; // Placeholder

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Bienvenido, {userName}
          </h1>
          <Link href="#" aria-label="Perfil de usuario"> {/* Placeholder for profile/settings */}
            <UserCircle className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
        <Link href="/start-audit" passHref>
          <Button size="lg" className="w-full py-3 text-lg">
            <Plus className="mr-2 h-5 w-5" />
            Iniciar Auditoría
          </Button>
        </Link>
      </header>

      <main className="flex-grow p-4 md:p-6 space-y-8">
        {/* Auditorías Recientes Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Auditorías Recientes</h2>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            {/* Placeholder content for recent audits */}
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-5/6 animate-pulse"></div>
            </div>
            {/* Future: Link to a page with all recent audits
            <div className="text-right mt-3">
              <Link href="#" className="text-sm text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            */}
          </div>
        </section>

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
