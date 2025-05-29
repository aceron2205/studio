
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format, type Locale } from "date-fns";
import { MapPin, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Audit {
  id: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  status: string;
}

interface ScheduledAuditListItemProps {
  audit: Audit;
  locale: Locale;
  onDownload: (auditId: string) => void;
}

export function ScheduledAuditListItem({ audit, locale, onDownload }: ScheduledAuditListItemProps) {
  const [formattedFullDate, setFormattedFullDate] = useState<string | null>(null);

  useEffect(() => {
    // Parse date string 'YYYY-MM-DD' as local date components
    // new Date(year, monthIndex, day) treats components as local time
    const dateParts = audit.date.split('-').map(Number);
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    
    setFormattedFullDate(`${format(localDate, "PPP", { locale })} a las ${audit.time}`);
  }, [audit.date, audit.time, locale]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-semibold text-card-foreground">{audit.clientName}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formattedFullDate ? `Fecha: ${formattedFullDate}` : 'Fecha: Cargando...'}
          </p>
          <Badge variant={audit.status === 'Programada' ? 'secondary' : 'default'} className="mt-1">
            {audit.status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(audit.id)}
          aria-label={`Descargar auditoría de ${audit.clientName}`}
          className="text-primary hover:text-primary/80 flex items-center justify-center h-10 w-10 flex-shrink-0"
        >
          <Download className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>{audit.location}</span>
      </div>
    </div>
  );
}
