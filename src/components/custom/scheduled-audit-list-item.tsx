
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format, type Locale } from "date-fns";
import { MapPin, Play, Download, ChevronDown, Loader2, Check, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
  onDownload: (auditId: string, auditName: string) => void;
  isDownloading?: boolean;
  isDownloaded?: boolean;
}

export function ScheduledAuditListItem({
  audit,
  locale,
  onAudit,
  onDownload,
  isDownloading = false,
  isDownloaded = false,
}: ScheduledAuditListItemProps) {
  const [formattedFullDate, setFormattedFullDate] = useState<string | null>(null);

  useEffect(() => {
    const dateParts = audit.date.split('-').map(Number);
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    setFormattedFullDate(`${format(localDate, "PPP", { locale })} a las ${audit.time}`);
  }, [audit.date, audit.time, locale]);

  const handleReschedule = () => {
    toast({
      title: "Funcionalidad Pendiente",
      description: "La opción de reagendar auditoría aún no está implementada.",
    });
    console.log(`Intento de reagendar auditoría: ${audit.id} - ${audit.clientName}`);
  };

  return (
    <div className="relative p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
      {isDownloading && (
        <div className="absolute top-2 right-2 bg-background/70 p-1.5 rounded-full">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
      )}
      {!isDownloading && isDownloaded && (
         <div className="absolute top-2 right-2 bg-green-500/80 text-white p-1.5 rounded-full">
          <Check className="h-5 w-5" />
        </div>
      )}
      <div className="flex justify-between items-center mb-2 pr-8"> {/* Align items center, add padding for status icon */}
        <div className="flex-1"> {/* Removed specific pr-8 from here */}
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
            <Button variant="ghost" size="icon"> {/* Removed custom margin classes */}
              <ChevronDown className="h-5 w-5" />
              <span className="sr-only">Más opciones para {audit.clientName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAudit(audit.id)}>
              <Play className="mr-2 h-4 w-4" />
              Auditar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(audit.id, audit.clientName)} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isDownloaded ? (
                <Check className="mr-2 h-4 w-4 text-green-600" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isDownloading
                ? 'Descargando...'
                : isDownloaded
                ? 'Descargado'
                : 'Descargar'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReschedule}>
              <CalendarClock className="mr-2 h-4 w-4" />
              Reagendar auditoria
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
