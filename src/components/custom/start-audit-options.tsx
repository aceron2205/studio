
"use client";

import * as React from "react";
import esLocaleData from "date-fns/locale/es"; // Changed import style
import { format, isSameDay } from "date-fns";
import { FilePlus2, ArrowLeft, ChevronDown, ChevronUp, CalendarIcon, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScheduledAuditListItem } from "./scheduled-audit-list-item";
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
import { toast } from "@/hooks/use-toast";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

const mockPendingAudits = [
  { id: 'current-day-5', clientName: 'Auditoría Día 5 del Mes', date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0], time: '09:00 AM', location: 'Locación A - Mes Actual', status: 'Programada' },
  { id: 'current-day-15', clientName: 'Auditoría Día 15 del Mes', date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0], time: '11:00 AM', location: 'Locación B - Mes Actual', status: 'Pendiente' },
  { id: 'current-day-25', clientName: 'Auditoría Día 25 del Mes', date: new Date(currentYear, currentMonth, 25).toISOString().split('T')[0], time: '01:00 PM', location: 'Locación C - Mes Actual', status: 'Programada' },
  { id: 'current-today', clientName: 'Auditoría de Hoy', date: today.toISOString().split('T')[0], time: '03:00 PM', location: 'Locación Hoy - Mes Actual', status: 'Programada'},
  { id: 'sep-audit-1', clientName: 'Empresa Constructora Sol (Sept.)', date: '2024-09-10', time: '10:00 AM', location: 'Obra Central, Av. Principal 123', status: 'Programada' },
  { id: 'sep-audit-2', clientName: 'Restaurante Delicias Marinas (Sept.)', date: '2024-09-12', time: '02:30 PM', location: 'Sucursal Puerto, Calle del Mar 45', status: 'Programada' },
];

const INITIAL_AUDITS_TO_SHOW = 2;
type ViewMode = "list" | "calendar";

export function StartAuditOptions() {
  const router = useRouter();
  const [visibleAuditsCount, setVisibleAuditsCount] = React.useState(INITIAL_AUDITS_TO_SHOW);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [downloadingAuditIds, setDownloadingAuditIds] = React.useState<Set<string>>(new Set());
  const [downloadedAuditIds, setDownloadedAuditIds] = React.useState<Set<string>>(new Set());

  const handleStartScheduledAudit = (auditId: string) => {
    console.log(`Navegando para auditar auditoría programada: ${auditId}`);
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

    toast({
      title: "Descarga Iniciada",
      description: `La descarga de la auditoría "${auditName}" ha comenzado.`,
    });

    setTimeout(() => {
      setDownloadingAuditIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(auditId);
        return newSet;
      });
      setDownloadedAuditIds(prev => new Set(prev).add(auditId));
      toast({
        title: "Auditoría Descargada",
        description: `La auditoría "${auditName}" ha sido descargada. (Simulado)`,
      });
    }, 2000);
  };

  const handleStartNewAudit = () => {
    console.log("Starting new unscheduled audit - navigating to new audit form");
    router.push('/new-audit-form'); // Navigate to the form for unscheduled/new plan audits
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
    mockPendingAudits.forEach(audit => uniqueDates.add(audit.date));
    return Array.from(uniqueDates).map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
  }, []);

  const auditsForSelectedDay = selectedDate
    ? mockPendingAudits.filter(audit => {
        const [year, month, day] = audit.date.split('-').map(Number);
        const auditDate = new Date(year, month - 1, day);
        return isSameDay(auditDate, selectedDate);
      })
    : [];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="relative p-6">
        <Link href="/" passHref>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver al Inicio"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-semibold text-primary">
            Iniciar Auditoría
          </CardTitle>
          <CardDescription className="mt-1">
            Selecciona una auditoría programada o crea una nueva.
          </CardDescription>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 sm:right-6">
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
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {viewMode === "list" && (
          <div>
            {mockPendingAudits.length > 0 ? (
              <div className="space-y-4">
                {displayedAudits.map((audit) => (
                  <ScheduledAuditListItem
                    key={`list-${audit.id}`}
                    audit={audit}
                    locale={esLocaleData} // Use the new import name
                    onAudit={handleStartScheduledAudit}
                    onDownload={handleDownloadAudit}
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
                locale={esLocaleData} // Use the new import name
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
                  Auditorías para el {format(selectedDate, "PPP", { locale: esLocaleData })} {/* Use new import name */}
                </h4>
                {auditsForSelectedDay.length > 0 ? (
                  <div className="space-y-4">
                    {auditsForSelectedDay.map((audit) => (
                      <ScheduledAuditListItem
                        key={`cal-${audit.id}`}
                        audit={audit}
                        locale={esLocaleData} // Use new import name
                        onAudit={handleStartScheduledAudit}
                        onDownload={handleDownloadAudit}
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

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">
            O Iniciar una Auditoría Nueva (No Programada)
          </h3>
          <Button
            onClick={handleStartNewAudit}
            className="w-full md:w-auto"
            size="lg"
          >
            <FilePlus2 className="mr-2 h-5 w-5" />
            Crear Nueva Auditoría
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Perfecto para auditorías no planificadas o de seguimiento inmediato. Se abrirá el formulario de nuevo plano/auditoría.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
