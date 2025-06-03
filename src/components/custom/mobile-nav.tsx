
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, RefreshCw, Search, BarChartBig, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/inventory', label: 'Reportes', icon: BarChartBig },
  { href: '#', icon: RefreshCw, isCentral: true, label: 'SyncAction' }, // Label for key, not displayed
  { href: '/search', label: 'Buscar', icon: Search },
  { href: '/settings', label: 'Ajustes', icon: Settings }, // Changed label here
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isCentral) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-full"
                aria-label="Sync Data" // Accessibility label for the central button
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <item.icon className="h-6 w-6" />
                </div>
                {/* Central button usually doesn't have a visible text label */}
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 p-2 text-xs rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
