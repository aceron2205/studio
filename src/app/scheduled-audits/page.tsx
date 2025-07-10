"use client";

import * as React from "react";
import { es } from 'date-fns/locale';
import { format, isSameDay } from "date-fns";
import { FilePlus2, ArrowLeft, ChevronDown, ChevronUp, CalendarIcon, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScheduledAuditListItem } from "@/components/custom/scheduled-audit-list-item";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { v4 as uuid } from "uuid";


import { ScheduleAuditForm } from "@/components/custom/schedule-form";
import { useRouter } from 'next/navigation';
import { mockClients, Client, createMockAudit } from "@/mocks/extinguisherMocks"; 


// NEW: Define ScheduledAudit interface locally as it's derived here from Client
export interface ScheduledAudit {
  id: string; // This will be the client.id
  clientName: string;
  edifi_id?: string;
  date: string; // MM-DD-YYYY format
  time: string; // Default time for now, or derived if client has it
  location: string; // Client's address
  status: 'Programada' | 'Pendiente' | 'Completada'; // Derived from business logic
}

const INITIAL_AUDITS_TO_SHOW = 2;
type ViewMode = "list" | "calendar";

export default function StartAuditOptions() {
  const router = useRouter();
  const [visibleAuditsCount, setVisibleAuditsCount] = React.useState(INITIAL_AUDITS_TO_SHOW);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [downloadingAuditIds, setDownloadingAuditIds] = React.useState<Set<string>>(new Set());
  const [downloadedAuditIds, setDownloadedAuditIds] = React.useState<Set<string>>(new Set());

  const [isScheduleFormOpen, setIsScheduleFormOpen] = React.useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = React.useState(false);

  // MODIFIED: Derive mockPendingAudits dynamically from mockClients
  const mockPendingAudits: ScheduledAudit[] = React.useMemo(() => {
    const audits: ScheduledAudit[] = [];
    mockClients.forEach(client => {
      if (client.scheduledAudit) {
        // Here you would add logic to determine time and status if needed from client data
        // For now, using placeholders as in original mockPendingAudits list
        audits.push({
          id: client.id, // Use client.id as the audit ID for routing
          clientName: client.name,
          date: client.scheduledAudit,
          time: '09:00 AM', // Placeholder time
          location: client.direccion, // Use client's address as location
          status: 'Programada', // Default status for generated audits
        });
      }
    });
    // Add specific hardcoded audits that don't directly map to a single client.id if necessary
    // E.g., if 'current-today' or 'current-day-5' are complex scenarios not client-specific:
    // This maintains the original audit IDs you were using, now treated as specific audit instances.
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Filter out duplicates if a client.id matches one of the hardcoded audit IDs
    const uniqueAudits = Array.from(new Map(audits.map(audit => [audit.id, audit])).values());
    return uniqueAudits;
  }, [mockClients]); // Dependency on mockClients ensures re-calculation if mockClients changes (though it's static here)


  const handleStartScheduledAudit = (auditId: string) => {
    console.log(`Navegando para auditar auditoría programada para cliente/auditoría: ${auditId}`);
    // Routes to /audit-scan/[auditId] where auditId can be client.id or specific audit ID
    router.push(`/audit-scan/${auditId}`); 
  };

  const handleDownloadAudit = (auditId: string, auditName: string) => {
    if (downloadingAuditIds.has(auditId)) {
      return;
    }

    setDownloadingAuditIds(prev => new Set(prev).add(auditId));
    setDownloadedAuditIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(auditId);
      return newSet;
    });

   /* toast({
      title: "Descarga Iniciada",
      description: `La descarga de la auditoría "${auditName}" ha comenzado.`,
    })*/;

    setTimeout(() => {
      setDownloadingAuditIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(auditId);
        return newSet;
      });
      setDownloadedAuditIds(prev => new Set(prev).add(auditId));
      /*toast({
        title: "Auditoría Descargada",
        description: `La auditoría "${auditName}" ha sido descargada. (Simulado)`,
      })*/;
    });
  };

  const handleStartNewAudit = async () => {
    setIsFabMenuOpen(false); 
    router.push('/audit-scan/new');
  };

  const handleScheduleAudit = () => {
    setIsFabMenuOpen(false); // Close menu after selection
    setIsScheduleFormOpen(true);
  };

  const displayedAudits = mockPendingAudits.slice(0, visibleAuditsCount);

  const toggleExpand = () => {
    if (isExpanded) {
      setVisibleAuditsCount(INITIAL_AUDITS_TO_SHOW);
    } else {
      setVisibleAuditsCount(mockPendingAudits.length);
    }
    setIsExpanded(!isExpanded);
  };

  const scheduledDays = React.useMemo(() => {
    const uniqueDates = new Set<string>();
    mockPendingAudits.forEach((audit: ScheduledAudit) => uniqueDates.add(audit.date));
    return Array.from(uniqueDates).map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
  }, [mockPendingAudits]);

  const auditsForSelectedDay = selectedDate
    ? mockPendingAudits.filter((audit: ScheduledAudit) => {
        const [year, month, day] = audit.date.split('-').map(Number);
        const auditDate = new Date(year, month - 1, day);
        return isSameDay(auditDate, selectedDate);
      })
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden"> 
      <div className="w-full mx-auto space-y-8 relative pb-16"> 
        <div className="relative py-6 px-4 sm:px-6 flex justify-center items-center">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Volver al Inicio"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-full text-center">
            <h1 className="text-2xl font-bold text-primary">
              Iniciar Auditoría
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Selecciona una auditoría programada o crea una nueva.
            </p>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Seleccionar vista">
                  <CalendarIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tipo de Vista</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  Lista
                  {viewMode === "list" && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("calendar")}>
                  Calendario
                  {viewMode === "calendar" && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="px-4 sm:px-6 space-y-6">
          {viewMode === "list" && (
            <div>
              {mockPendingAudits.length > 0 ? (
                <div className="space-y-4">
                  {displayedAudits.map((audit) => (
                    <ScheduledAuditListItem
                      key={`list-${audit.id}`}
                      audit={audit}
                      locale={es}
                      onAudit={() => handleStartScheduledAudit(audit.id)} 
                      onDownload={() => handleDownloadAudit(audit.id, audit.clientName)} 
                      isDownloading={downloadingAuditIds.has(audit.id)}
                      isDownloaded={downloadedAuditIds.has(audit.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No hay auditorías programadas pendientes.
                </p>
              )}
              {mockPendingAudits.length > INITIAL_AUDITS_TO_SHOW && displayedAudits.length < mockPendingAudits.length && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={toggleExpand} className="w-full sm:w-auto">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Ver más auditorías
                  </Button>
                </div>
              )}
              {isExpanded && displayedAudits.length === mockPendingAudits.length && mockPendingAudits.length > INITIAL_AUDITS_TO_SHOW && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={toggleExpand} className="w-full sm:w-auto">
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Ver menos auditorías
                  </Button>
                </div>
              )}
            </div>
          )}
          {viewMode === "calendar" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow"
                  locale={es} 
                  ISOWeek
                  modifiers={{ scheduled: scheduledDays }}
                  modifiersStyles={{
                    scheduled: {
                      color: 'hsl(var(--foreground))',
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                    }
                  }}
                />
              </div>
              {selectedDate && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-center text-primary">
                    Auditorías para el {format(selectedDate, "PPP", { locale: es })}
                  </h4>
                  {auditsForSelectedDay.length > 0 ? (
                    <div className="space-y-4">
                      {auditsForSelectedDay.map((audit) => (
                        <ScheduledAuditListItem
                          key={`cal-${audit.id}`}
                          audit={audit}
                          locale={es}
                          onAudit={() => handleStartScheduledAudit(audit.id)}
                          onDownload={() => handleDownloadAudit(audit.id, audit.clientName)}
                          isDownloading={downloadingAuditIds.has(audit.id)}
                          isDownloaded={downloadedAuditIds.has(audit.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No hay auditorías programadas para esta fecha.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-16 right-4 z-50 flex flex-col items-end gap-3">
        {isFabMenuOpen && (
          <>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 ease-in-out"
              onClick={handleScheduleAudit}
            >
              Agendar Auditoría
            </Button>
            <Button
              variant="default"
              size="lg"
              className="rounded-full shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 ease-in-out"
              onClick={handleStartNewAudit}
              style={{ transform: 'translateY(-160px)' }}
            >
              Nueva Auditoria
            </Button>
          </>
        )}

        <Button
          variant="default"
          size="icon"
          aria-label="Opciones de Auditoría"
          className="rounded-full h-14 w-14 z-50 shadow-lg"
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
        >
          <FilePlus2 className="h-7 w-7" />
        </Button>
      </div>
      <ScheduleAuditForm
        isOpen={isScheduleFormOpen}
        onSchedule={handleScheduleAudit} 
        onOpenChange={setIsScheduleFormOpen}
      />
    </div>
  );
}