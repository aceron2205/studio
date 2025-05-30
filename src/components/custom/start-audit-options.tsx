
"use client";

import * as React from "react";
import { es } from "date-fns/locale/es";
import { format, isSameDay } from "date-fns";
import { FilePlus2, Play, Download, ArrowLeft, ChevronDown, ChevronUp, Menu as MenuIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScheduledAuditListItem, type AuditAction } from "./scheduled-audit-list-item";
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

// Mock data - in a real app, this would come from a data source
const mockPendingAudits = [
  { id: '1', clientName: 'Empresa Constructora Sol', date: '2024-09-10', time: '10:00 AM', location: 'Obra Central, Av. Principal 123', status: 'Programada' },
  { id: '2', clientName: 'Restaurante Delicias Marinas', date: '2024-09-12', time: '02:30 PM', location: 'Sucursal Puerto, Calle del Mar 45', status: 'Programada' },
  { id: '3', clientName: 'Oficinas Corporativas Sigma', date: '2024-09-15', time: '09:00 AM', location: 'Edificio Alfa, Piso 10', status: 'Pendiente' },
  { id: '4', clientName: 'Taller Mecánico "El Rápido"', date: '2024-09-18', time: '11:00 AM', location: 'Zona Industrial Este, Lote 7B', status: 'Programada' },
  { id: '5', clientName: 'Colegio "Nueva Era"', date: '2024-09-22', time: '01:00 PM', location: 'Campus Principal, Sector Educativo', status: 'Pendiente' },
  // Add an audit for the current month to make calendar testing easier
  { id: '6', clientName: 'Cliente de Prueba Mes Actual', date: new Date().toISOString().split('T')[0], time: '11:00 AM', location: 'Ubicación de Prueba', status: 'Programada' },
];

// In a real application, mockPendingAudits would be fetched from a database.
// Example:
// const [auditsFromDb, setAuditsFromDb] = React.useState([]);
// React.useEffect(() => {
//   async function fetchAudits() {
//     // const data = await yourDatabaseService.getPendingAudits();
//     // setAuditsFromDb(data);
//   }
//   fetchAudits();
// }, []);
// Then use auditsFromDb instead of mockPendingAudits.

const INITIAL_AUDITS_TO_SHOW = 2;

type ViewMode = "list" | "calendar";

export function StartAuditOptions() {
  const [visibleAuditsCount, setVisibleAuditsCount] = React.useState(INITIAL_AUDITS_TO_SHOW);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const handleStartScheduledAudit = (auditId: string) => {
    console.log(`Starting scheduled audit: ${auditId}`);
    // Navigate to audit screen or perform start action
  };

  const handleDownloadAudit = (auditId: string) => {
    console.log(`Downloading audit for start: ${auditId}`);
    // Implement actual download logic here if different from other download
  };

  const handleStartNewAudit = () => {
    console.log("Starting new unscheduled audit");
    // Navigate to new audit creation screen
  };

  const getAuditActions = (auditId: string): AuditAction[] => [
    {
      icon: Play,
      label: "Iniciar esta auditoría",
      onClick: () => handleStartScheduledAudit(auditId),
      variant: 'ghost',
      buttonSize: 'icon-lg',
      iconSize: 28, // h-7 w-7
    },
    {
      icon: Download,
      label: "Descargar auditoría",
      onClick: () => handleDownloadAudit(auditId),
      variant: 'ghost',
      buttonSize: 'icon-lg',
      iconSize: 28, // h-7 w-7
    }
  ];

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
    // In a real app, you would process the audits fetched from the database here.
    return mockPendingAudits.map(audit => {
      const [year, month, day] = audit.date.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    }).filter((date, index, self) => // Ensure unique dates
      index === self.findIndex(d => d.getTime() === date.getTime())
    );
  }, []); // If mockPendingAudits were state from a DB, it would be a dependency: [auditsFromDb]

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
                <MenuIcon className="h-5 w-5" />
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
                    locale={es}
                    actions={getAuditActions(audit.id)}
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
                    color: 'hsl(var(--accent))', // Use accent color for text
                    fontWeight: '600', // Make it semi-bold
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
                        actions={getAuditActions(audit.id)}
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
            O Iniciar una Auditoría Nueva
          </h3>
          <Button
            onClick={handleStartNewAudit}
            className="w-full md:w-auto"
            size="lg"
          >
            <FilePlus2 className="mr-2 h-5 w-5" />
            Crear Nueva Auditoría No Programada
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Perfecto para auditorías no planificadas o de seguimiento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

