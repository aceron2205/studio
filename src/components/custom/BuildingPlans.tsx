import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FireExtinguisher,
  Tag,
  MapPin,
  Gauge,
  BatteryCharging,
  Calendar,
  CheckCircle2,
  Clock3,
  XCircle
} from 'lucide-react';

import { ActionDropdownMenu } from '@/components/custom/action-dropdown-menu';
import { Client } from '@/mocks/extinguisherMocks';
import { ExtinguisherData } from '@/types/extinguisher';

interface BuildingPlansProps {
  selectedClient: Client;
  onBack: () => void;
  onScheduleAuditClick: (location: string) => void;
}

const BuildingPlans: React.FC<BuildingPlansProps> = ({ selectedClient, onBack, onScheduleAuditClick }) => {
  const router = useRouter();

  const clientExtinguisherPlan = selectedClient?.['extinguisher-plan'] || [];
  const audits = selectedClient.relatedAudits || {};

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

  const auditStatusByBuilding: Record<string, string> = useMemo(() => {
    const result: Record<string, string> = {};
    Object.values(audits).forEach(audit => {
      if (audit.edifi_id && audit.status) {
        result[audit.edifi_id] = audit.status;
      }
    });
    return result;
  }, [audits]);



  const sortedBuildingNames = useMemo(() => {
    return Object.keys(extinguishersByBuilding).sort();
  }, [extinguishersByBuilding]);

  const handleAuditBuilding = (buildingName: string) => {
    router.push(`/audit-scan/${selectedClient.id || 'new-audit'}`);
  };

  const handleDownloadBuildingPlan = (buildingName: string) => {
    console.log(`Descargar plano para edificio: ${buildingName}`);
  };

  const handleRescheduleBuildingAudit = (buildingName: string) => {
    const locationForScheduling = selectedClient.direccion || buildingName;
    onScheduleAuditClick(locationForScheduling);
  };

  const handleCancelBuildingAudit = (buildingName: string) => {
    console.log(`Cancelar auditoría para edificio: ${buildingName}`);
  };

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
                  {buildingName} ({extinguishersByBuilding[buildingName].length})
                </h2>
                <ActionDropdownMenu
                  itemId={buildingName}
                  itemName={buildingName}
                  onAudit={handleAuditBuilding}
                  onDownload={handleDownloadBuildingPlan}
                  onScheduleAudit={handleRescheduleBuildingAudit}
                  onCancelAudit={handleCancelBuildingAudit}
                />
              </div>
              <div className="space-y-3">
                {extinguishersByBuilding[buildingName].map(ext => (
                  <ExtinguisherDetailItem key={ext.id} extinguisher={ext} />
                ))}
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
