import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

export function MenuCard({ title, icon: Icon, href, description }: MenuCardProps) {
  return (
    <Link 
      href={href} 
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
      aria-label={title}
    >
      <Card className="group-hover:shadow-xl group-focus-visible:shadow-lg transition-all duration-200 ease-in-out h-40 flex flex-col items-center justify-center p-4 rounded-xl bg-card text-card-foreground border-border hover:border-primary">
        <div className="flex flex-col items-center justify-center text-center">
          <Icon className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 px-1 leading-tight">
              {description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
