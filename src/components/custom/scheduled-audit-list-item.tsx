
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format, type Locale } from "date-fns";
import { MapPin, Play, Download, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onAudit: (auditId: string) => void;
  onDownload: (auditId: string) => void;
}

export function ScheduledAuditListItem({ audit, locale, onAudit, onDownload }: ScheduledAuditListItemProps) {
  const [formattedFullDate, setFormattedFullDate] = useState<string | null>(null);

  useEffect(() => {
    const dateParts = audit.date.split('-').map(Number);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-1 sm:mt-0">
              <ChevronDown className="h-5 w-5" />
              <span className="sr-only">Más opciones para {audit.clientName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAudit(audit.id)}>
              <Play className="mr-2 h-4 w-4" />
              Auditar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(audit.id)}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>{audit.location}</span>
      </div>
    </div>
  );
}
