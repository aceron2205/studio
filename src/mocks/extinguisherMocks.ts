import { ExtinguisherData } from "@/types/extinguisher";

// Client Interface, now including the embedded 'extinguisher-plan'
export interface Client {
  id: string;
  name: string;
  scheduledAudit?: string; // Optional field
  direccion: string;
  pendingExtinguishers: number;
  'extinguisher-plan'?: ExtinguisherData[]; // The embedded extinguisher plan, now optional if a client has none
}


export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: '123Cliente Innovador SA',
    scheduledAudit: '2024-08-15',
    direccion: 'Parque Tecnológico Norte',
    pendingExtinguishers: 5,
    'extinguisher-plan': [ // Embedded extinguisher plan for this client
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
        cliente: '123Cliente Innovador SA', // Still part of extinguisher's own data
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
  },
  {
    id: 'client-2',
    name: '123Soluciones Globales Ltda.',
    scheduledAudit: '2024-09-20',
    direccion: 'Centro Empresarial Metropolitano',
    pendingExtinguishers: 2,
    'extinguisher-plan': [ // Embedded extinguisher plan for this client
      {
        id: 'ext-5',
        agenteExtintor: 'Dióxido de Carbono (CO2)',
        capacidadLibras: '5 kg',
        modelo: 'Kidde K05',
        pressure_indicator: 'N/A (CO2)',
        charge_status: 'Cargado (11/2023)',
        fabricacionDate: '05-2019',
        ultimoServicioDate: '11-2023',
        pruebaHidrostaticaDate: '11-2028',
        cliente: '123Soluciones Globales Ltda.',
        edificio: 'Edificio Principal',
        ubicacion: 'Segundo Piso',
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
  },
  {
    id: 'client-3',
    name: '123Consultores Asociados',
    scheduledAudit: '2024-08-01',
    direccion: 'Distrito Financiero Oeste',
    pendingExtinguishers: 8,
    'extinguisher-plan': [], // This client has no associated extinguishers in this mock
  },
  {
    id: 'client-4',
    name: '123Manufacturas Alfa',
    scheduledAudit: '2024-10-10',
    direccion: 'Polígono Industrial Sur',
    pendingExtinguishers: 3,
    'extinguisher-plan': [], // No plan for this client
  },
  {
    id: 'client-5',
    name: '123Tecnología Vanguardista',
    scheduledAudit: '2024-11-05',
    direccion: 'Zona Industrial Este',
    pendingExtinguishers: 6,
    'extinguisher-plan': [], // No plan for this client
  },
  {
    id: 'client-6',
    name: '123Servicios Integrales del Norte',
    scheduledAudit: '2024-12-12',
    direccion: 'Sector Comercial Norte',
    pendingExtinguishers: 1,
    'extinguisher-plan': [], // No plan for this client
  },
];

export const getClientsWithExistingExtinguisherPlans = (): Client[] => {
  return mockClients.filter(client => client['extinguisher-plan'] && client['extinguisher-plan'].length > 0);
};