
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format, type Locale, parseISO } from "date-fns";
import { MapPin, Play, Download, ChevronDown, Loader2, Check, CalendarClock, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScheduleAuditForm } from "./schedule-form";
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

  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);

  useEffect(() => {
    const localDate = parseISO(audit.date);
    setFormattedFullDate(`${format(localDate, "PPP", { locale })} a las ${audit.time}`);
  }, [audit.date, audit.time, locale]);


  const handleReschedule = () => {
     toast({
      title: "Funcionalidad Pendiente",

      description: "La opción de reagendar auditoría aún no está implementada.",
    });
    console.log(`Intento de reagendar auditoría: ${audit.id} - ${audit.clientName}`);
  };

  const handleConfirmCancelAudit = () => {
    toast({
      title: "Cancelación Solicitada",
      description: "Se ha solicitado la cancelación de la auditoría. Requiere autorización del administrador.",
      variant: "destructive"
    });
    console.log(`Solicitud de cancelación para auditoría: ${audit.id} - ${audit.clientName}. Pendiente de autorización.`);
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent card click if the click originated from within the dropdown trigger or content
    if ((event.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (event.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')) {
      return;
    }
    onAudit(audit.id);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Prevent card keydown if focus is within the dropdown trigger (e.g. if user is navigating dropdown with keyboard)
      if ((event.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]')) {
          return;
      }
      onAudit(audit.id);
    }
  };


  return (
    <div
      className="relative p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Iniciar auditoría para ${audit.clientName}`}
    >
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
      <div className="flex justify-between items-center mb-2 pr-8"> 
        <div className="flex-1"> 
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
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => e.stopPropagation()} 
                aria-label={`Más opciones para ${audit.clientName}`}
                className="absolute top-2 right-0" // Positioned to not interfere with status icons
              > 
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
              <DropdownMenuItem onClick={() => setIsScheduleFormOpen(true)}>
                <CalendarClock className="mr-2 h-4 w-4" />
                Agendar auditoria
              </DropdownMenuItem>


              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()} 
                  className="text-destructive focus:text-destructive"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Cancelar Auditoría
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Solicitud de Cancelación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas solicitar la cancelación de esta auditoría?
                Esta acción requerirá la autorización de un administrador.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Volver</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmCancelAudit}>
                Confirmar Solicitud
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
        <span>{audit.location}</span>
      </div>

      <ScheduleAuditForm
        isOpen={isScheduleFormOpen}
        onOpenChange={setIsScheduleFormOpen}
        onSchedule={(data, buildingName) => {
          console.log("Audit scheduled with data:", data);
          console.log("For building:", buildingName);
        }}
      />
    </div>
  );
}

