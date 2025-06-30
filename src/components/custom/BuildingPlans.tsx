import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, FireExtinguisher, Tag, MapPin, Gauge, BatteryCharging, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import your new ActionDropdownMenu component
import { ActionDropdownMenu } from '@/components/custom/action-dropdown-menu';
import { ExtinguisherData } from '@/types/extinguisher';
import { Client } from '@/mocks/extinguisherMocks'; // Import Client interface


interface BuildingPlansProps {
  clientExtinguisherPlan: ExtinguisherData[];
  onBack: () => void;
  selectedClient?: Client; // NEW: Receive the selected client object
  // Renamed to be more generic as it receives a location string (building or client address)
  onScheduleAuditClick: (location: string) => void;
}

const BuildingPlans: React.FC<BuildingPlansProps> = ({ clientExtinguisherPlan, onBack, selectedClient, onScheduleAuditClick }) => {
  const router = useRouter();

  // Group extinguishers by building
  const extinguishersByBuilding = useMemo(() => {
    const grouped: { [key: string]: ExtinguisherData[] } = {};
    clientExtinguisherPlan.forEach(ext => {
      const buildingKey = ext.edificio && ext.edificio.trim() !== '' ? ext.edificio : 'Sin Edificio Asignado';
      if (!grouped[buildingKey]) {
        grouped[buildingKey] = [];
      }
      grouped[buildingKey].push(ext);
    });
    return grouped;
  }, [clientExtinguisherPlan]);

  // Get and sort building names for display order
  const sortedBuildingNames = useMemo(() => {
    return Object.keys(extinguishersByBuilding).sort();
  }, [extinguishersByBuilding]);


  const handleAuditBuilding = (buildingName: string) => {
    console.log(`Auditar edificio: ${buildingName}`);
    router.push(`/audit-scan/${selectedClient?.id || 'new-unscheduled'}`); // Assuming audit-scan needs client ID or a new/unscheduled identifier
  };

  const handleDownloadBuildingPlan = (buildingName: string) => {
    console.log(`Descargar plano para edificio: ${buildingName}`);
    // Implement PDF generation/download logic here
  };

  const handleRescheduleBuildingAudit = (buildingName: string) => {
    console.log(`Reagendar auditoría para edificio: ${buildingName}`);
    // MODIFIED: Pass the client's main address (direccion) if available, otherwise the building name
    const locationForScheduling = selectedClient?.direccion || buildingName;
    onScheduleAuditClick(locationForScheduling);
  };

  const handleCancelBuildingAudit = (buildingName: string) => {
    console.log(`Cancelar auditoría para edificio: ${buildingName}`);
    // Implement logic to cancel an audit
  };


  // Helper component to render Extinguisher Details
  const ExtinguisherDetailItem: React.FC<{ extinguisher: ExtinguisherData }> = ({ extinguisher }) => (
    <div
      key={extinguisher.id}
      className="p-4 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors mb-2"
    >
      <h3 className="font-semibold text-base text-gray-800 flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        {extinguisher.agenteExtintor} ({extinguisher.capacidadLibras})
      </h3>
      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
        <MapPin className="h-3 w-3" /> Ubicación: {extinguisher.ubicacion}
      </p>
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-1"><Tag className="h-3 w-3" /> ID: {extinguisher.id} | Modelo: {extinguisher.modelo}</p>
        {extinguisher.pressure_indicator && (
          <p className="flex items-center gap-1"><Gauge className="h-3 w-3" /> Presión: {extinguisher.pressure_indicator}</p>
        )}
        {extinguisher.charge_status && (
          <p className="flex items-center gap-1"><BatteryCharging className="h-3 w-3" /> Carga: {extinguisher.charge_status}</p>
        )}
        {extinguisher.ultimoServicioDate && (
          <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Último Servicio: {extinguisher.ultimoServicioDate}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
      <div className="space-y-8">
        {sortedBuildingNames.length > 0 ? (
          sortedBuildingNames.map((buildingName: string) => (
            <section key={buildingName} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <FireExtinguisher className="h-6 w-6 text-orange-500" />
                  {buildingName || 'Edificio No Asignado'} ({extinguishersByBuilding[buildingName].length})
                </h2>
                <div className="flex flex-col gap-2">
                  <ActionDropdownMenu
                    itemId={buildingName}
                    itemName={buildingName}
                    onAudit={handleAuditBuilding}
                    onDownload={handleDownloadBuildingPlan}
                    onScheduleAudit={handleRescheduleBuildingAudit}
                    onCancelAudit={handleCancelBuildingAudit}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {extinguishersByBuilding[buildingName].length > 0 ? (
                  extinguishersByBuilding[buildingName].map(extinguisher => (
                    <ExtinguisherDetailItem key={extinguisher.id} extinguisher={extinguisher} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No se encontraron extintores para este edificio.</p>
                )}
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">Este cliente no tiene edificios asociados con planes de extintores.</p>
        )}
      </div>
    </div>
  );
};

export default BuildingPlans;
