// src/mocks/extinguisherMocks.ts

import { ExtinguisherData } from "@/types/extinguisher";

// Client Interface
export interface Client {
  id: string;
  name: string;
  scheduledAudit?: string;
  direccion: string;
  edifi_id?: string; // ✅ Optional, safe for backend linking
  pendingExtinguishers: number;
  'extinguisher-plan'?: ExtinguisherData[];
  relatedAudits?: Record<string, {
    date: string;
    time: string;
    location: string;
    edifi_id?: string; // ✅ Optional here as well
    status: 'Programada' | 'Pendiente' | 'Completada';
    extinguishers?: ExtinguisherData[];
  }>;
}


export interface Client {
  id: string;
  name: string;
  scheduledAudit?: string;
  direccion: string;
  edifi_id?: string;
  pendingExtinguishers: number;
  'extinguisher-plan'?: ExtinguisherData[];
  relatedAudits?: Record<string, {
    date: string;
    time: string;
    location: string;
    edifi_id?: string;
    status: 'Programada' | 'Pendiente' | 'Completada';
    extinguishers?: ExtinguisherData[];
  }>;
}

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: '123Cliente Innovador SA',
    scheduledAudit: '2024-08-15',
    direccion: 'Parque Tecnológico Norte',
    edifi_id: '9a3e83e7-a809-4f14-99e4-94cb01da933f',
    pendingExtinguishers: 5,
    'extinguisher-plan': [
      {
        id: 'ext-1',
        agenteExtintor: 'Polvo Químico Seco (ABC)',
        capacidadLibras: '10 lbs',
        modelo: 'Amerex B402',
        pressure_indicator: 'En Verde',
        charge_status: 'Cargado (01/2024)',
        fabricacionDate: '01-2020',
        ultimoServicioDate: '01-2024',
        pruebaHidrostaticaDate: '01-2025',
        cliente: '123Cliente Innovador SA',
        edificio: 'Edificio Principal',
        ubicacion: 'Planta Baja',
      },
      {
        id: 'ext-2',
        agenteExtintor: 'Dióxido de Carbono (CO2)',
        capacidadLibras: '5 kg',
        modelo: 'Kidde K05',
        pressure_indicator: 'N/A (CO2)',
        charge_status: 'Cargado (11/2023)',
        fabricacionDate: '05-2019',
        ultimoServicioDate: '11-2023',
        pruebaHidrostaticaDate: '11-2028',
        cliente: '123Cliente Innovador SA',
        edificio: 'Edificio Principal',
        ubicacion: 'Segundo Piso',
      },
    ],
    relatedAudits: {
      'sep-audit-1': {
        date: '2024-09-10',
        time: '10:00 AM',
        location: 'Obra Central, Av. Principal 123',
        edifi_id: '9a3e83e7-a809-4f14-99e4-94cb01da933f',
        status: 'Programada',
        extinguishers: [
          {
            id: 'ext-1',
            cliente: 'Empresa Constructora Sol',
            edificio: 'Principal',
            ubicacion: 'Entrada principal, junto a recepción',
            agenteExtintor: 'Polvo Químico Seco (ABC)',
            capacidadLibras: '10 lbs',
            modelo: 'Amerex B402',
            pressure_indicator: 'En Verde',
            charge_status: 'Cargado (01/2024)',
            ultimoServicioDate: '01-2024',
            fabricacionDate: '01-2020',
            pruebaHidrostaticaDate: '01-2029',
          },
        ],
      },
    }
  },
  {
    id: 'client-2',
    name: '123Soluciones Globales Ltda.',
    scheduledAudit: '2024-09-20',
    direccion: 'Centro Empresarial Metropolitano',
    edifi_id: '81182a69-d045-4ce6-92f0-b08c6788237d',
    pendingExtinguishers: 2,
    'extinguisher-plan': [
      {
        id: 'ext-5',
        agenteExtintor: 'Polvo Químico Seco (ABC)',
        capacidadLibras: '10 lbs',
        modelo: 'Amerex B402',
        pressure_indicator: 'En Verde',
        charge_status: 'Cargado (01/2024)',
        fabricacionDate: '01-2020',
        ultimoServicioDate: '01-2024',
        pruebaHidrostaticaDate: '01-2025',
        cliente: '123Soluciones Globales Ltda.',
        edificio: 'Edificio Principal',
        ubicacion: 'Planta Baja',
      },
      {
        id: 'ext-4',
        cliente: '123Soluciones Globales Ltda.',
        edificio: 'Edificio Principal',
        ubicacion: 'Almacén Gamma - Punto Central',
        agenteExtintor: 'Polvo Químico Seco (PQS)',
        capacidadLibras: '20 lbs',
        modelo: 'Amerex B500',
        fabricacionDate: '01-2020',
        ultimoServicioDate: '08-2023',
        pruebaHidrostaticaDate: '08-2028',
        pressure_indicator: 'En Verde',
        charge_status: 'Pendiente Recarga'
      },
    ],
    relatedAudits: {
      'current-day-5': {
        date: '2024-07-05',
        time: '09:00 AM',
        location: 'Locación A - Mes Actual',
        edifi_id: '81182a69-d045-4ce6-92f0-b08c6788237d',
        status: 'Programada',
        extinguishers: [
          {
            id: 'ext-4',
            cliente: 'Industrias Alfa',
            edificio: 'Principal',
            ubicacion: 'Almacén Gamma - Punto Central',
            agenteExtintor: 'Polvo Químico Seco (PQS)',
            capacidadLibras: '20 lbs',
            modelo: 'Amerex B500',
            fabricacionDate: '01-2020',
            ultimoServicioDate: '08-2023',
            pruebaHidrostaticaDate: '08-2028',
            pressure_indicator: 'En Verde',
            charge_status: 'Pendiente Recarga',
          },
          {
            id: 'ext-5',
            cliente: 'Industrias Alfa',
            edificio: 'Principal',
            ubicacion: 'Almacén Gamma - Zona Líquidos',
            agenteExtintor: 'Espuma AFFF',
            capacidadLibras: '6 lts',
            modelo: 'Buckeye AFFF-6L',
            pressure_indicator: 'En Verde',
            charge_status: 'Cargado (05/2024)',
            ultimoServicioDate: '05-2024',
            fabricacionDate: '05-2019',
            pruebaHidrostaticaDate: '05-2029',
          },
        ],
      },
    }
  },
  {
    id: 'client-3',
    name: '123Consultores Asociados',
    scheduledAudit: '2024-08-01',
    direccion: 'Distrito Financiero Oeste',
    edifi_id: 'eacfa09b-bb36-4aba-b750-c3ef343752f8',
    pendingExtinguishers: 8,
    'extinguisher-plan': [],
    relatedAudits: {
      'current-today': {
        date: new Date().toISOString().split('T')[0],
        time: '03:00 PM',
        location: 'Locación Hoy - Mes Actual',
        edifi_id: 'eacfa09b-bb36-4aba-b750-c3ef343752f8',
        status: 'Programada',
        extinguishers: [
          {
            id: 'ext-6',
            cliente: 'Cliente Omega (Hoy)',
            edificio: 'Principal',
            ubicacion: 'Taller de mantenimiento',
            agenteExtintor: 'Polvo Químico Seco (ABC)',
            capacidadLibras: '10 lbs',
            modelo: 'Generic PQS-10',
            pressure_indicator: 'En Verde',
            charge_status: 'Cargado (02/2024)',
            ultimoServicioDate: '02-2024',
            fabricacionDate: '02-2019',
            pruebaHidrostaticaDate: '02-2029',
          },
        ],
      },
    }
  },
];

export const createMockAudit = (
  id: string,
  clientId: string,
  clientName: string,
  date: string,
  time: string,
  location: string,
  status: 'Programada' | 'Pendiente' | 'Completada',
  edifi_id?: string,
  extinguishers: ExtinguisherData[] = []
): ScheduledAudit => ({
  id,
  auditClientId: clientId,
  clientName,
  date,
  time,
  location,
  status,
  extinguishersForAudit: extinguishers,
  ...(edifi_id ? { edifi_id } : {}), // optional fallback
});

export const getClientsWithExistingExtinguisherPlans = (): Client[] => {
  return mockClients.filter(client => client['extinguisher-plan']?.length);
};

export const getExtinguisherPlanByClientId = (clientId: string): ExtinguisherData[] => {
  const client = mockClients.find(c => c.id === clientId);
  return client?.['extinguisher-plan'] || [];
};

export interface ScheduledAudit {
  id: string;
  auditClientId: string;
  clientName: string;
  date: string;
  time: string;
  location: string;
  edifi_id?: string;


  status: 'Programada' | 'Pendiente' | 'Completada';
  extinguishersForAudit?: ExtinguisherData[];
}

export const getMockPendingAudits = (): ScheduledAudit[] => {
  const audits: ScheduledAudit[] = [];
  const defaultTime = '09:00 AM';

  mockClients.forEach(client => {
    if (client.relatedAudits) {
      for (const auditId in client.relatedAudits) {
        const auditDetails = client.relatedAudits[auditId];
        audits.push({
          id: auditId,
          auditClientId: client.id,
          clientName: client.name,
          date: auditDetails.date,
          time: auditDetails.time,
          location: auditDetails.location,
          status: auditDetails.status,
          extinguishersForAudit: auditDetails.extinguishers,
        });
      }
    }

    if (client.scheduledAudit && !audits.some(a => a.id === client.id)) {
      audits.push({
        id: client.id,
        auditClientId: client.id,
        clientName: client.name,
        date: client.scheduledAudit,
        time: defaultTime,
        location: client.direccion,
        status: 'Programada',
        extinguishersForAudit: client['extinguisher-plan'],
      });
    }
  });

  return Array.from(new Map(audits.map(audit => [audit.id, audit])).values());
};

export const mockPlanExtinguishers: Record<string, ExtinguisherData[]> = {};

mockClients.forEach(client => {
  if (client['extinguisher-plan']?.length) {
    mockPlanExtinguishers[client.id] = client['extinguisher-plan'];
  }
  if (client.relatedAudits) {
    for (const auditId in client.relatedAudits) {
      const extinguishers = client.relatedAudits[auditId].extinguishers;
      if (extinguishers?.length) {
        mockPlanExtinguishers[auditId] = extinguishers;
      }
    }
  }
});
