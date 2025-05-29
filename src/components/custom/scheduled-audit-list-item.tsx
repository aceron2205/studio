
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

interface AuditAction {
  icon: LucideIcon;
  label: string;
  onClick: (auditId: string) => void;
  variant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
}

interface ScheduledAuditListItemProps {
  audit: Audit;
  locale: Locale;
  action: AuditAction;
}

export function ScheduledAuditListItem({ audit, locale, action }: ScheduledAuditListItemProps) {
  const [formattedFullDate, setFormattedFullDate] = useState<string | null>(null);

  useEffect(() => {
    const dateParts = audit.date.split('-').map(Number);
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    
    setFormattedFullDate(`${format(localDate, "PPP", { locale })} a las ${audit.time}`);
  }, [audit.date, audit.time, locale]);

  const ActionIcon = action.icon;

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
        <Button
          variant={action.variant || "ghost"}
          size={action.buttonSize || "icon"}
          onClick={() => action.onClick(audit.id)}
          aria-label={`${action.label} para ${audit.clientName}`}
        >
          <ActionIcon className="h-4 w-4" />
          {(action.buttonSize && action.buttonSize !== 'icon' && action.label) && (
            <span>{action.label}</span>
          )}
        </Button>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>{audit.location}</span>
      </div>
    </div>
  );
}
