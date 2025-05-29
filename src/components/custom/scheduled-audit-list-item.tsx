
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format, type Locale } from "date-fns";
import type { LucideIcon } from 'lucide-react';
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";

interface Audit {
  id: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  status: string;
}

export interface AuditAction {
  icon: LucideIcon;
  label: string; 
  onClick: (auditId: string) => void;
  variant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
  iconSize?: number; // Optional: specify icon size in pixels
}

interface ScheduledAuditListItemProps {
  audit: Audit;
  locale: Locale;
  actions: AuditAction[];
}

export function ScheduledAuditListItem({ audit, locale, actions }: ScheduledAuditListItemProps) {
  const [formattedFullDate, setFormattedFullDate] = useState<string | null>(null);

  useEffect(() => {
    const dateParts = audit.date.split('-').map(Number);
    // Ensure month is 0-indexed for Date constructor
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    
    setFormattedFullDate(`${format(localDate, "PPP", { locale })} a las ${audit.time}`);
  }, [audit.date, audit.time, locale]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-x-2 mb-1">
            <h3 className="text-lg font-semibold text-card-foreground">{audit.clientName}</h3>
            <Badge 
              variant={audit.status === 'Programada' ? 'secondary' : 'default'} 
              className="mt-1 sm:mt-0 self-start sm:self-baseline"
            >
              {audit.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formattedFullDate ? `Fecha: ${formattedFullDate}` : 'Fecha: Cargando...'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {actions.map((act, index) => {
            const ActionIcon = act.icon;
            return (
              <Button
                key={`${act.label}-${index}-${audit.id}`}
                variant={act.variant || "ghost"}
                size={act.buttonSize || "icon"}
                onClick={() => act.onClick(audit.id)}
                aria-label={`${act.label} para ${audit.clientName}`}
              >
                <ActionIcon size={act.iconSize} /> 
                {act.buttonSize && act.buttonSize !== 'icon' && act.buttonSize !== 'icon-lg' && act.label && (
                  act.label 
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>{audit.location}</span>
      </div>
    </div>
  );
}
