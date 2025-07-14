
// En tu archivo: src/types/extinguisher.ts

// --- SOLUCIÓN 1: Se añade la palabra 'export' ---
// Este tipo de datos es para el componente ExtinguisherInfoBlock.
export interface ExtinguisherData {
  id: string;
  cliente?: string;
  edificio?: string;
  ubicacion?: string;
  agenteExtintor?: string;
  capacidadLibras?: string;
  modelo?: string;
  fabricacionDate?: string;
  ultimoServicioDate?: string;
  pruebaHidrostaticaDate?: string;
  pressure_indicator?: string;
  charge_status?: string;
  edifi_id?: string;
}

export interface ArticulosReemplazados {
  sello?: boolean;
  pasador?: boolean;
  etiqueta?: boolean;
  correaManguera?: boolean;
  manguera?: boolean;
  manometro?: boolean;
  soporte?: boolean;
  recargaAgente?: boolean;
  extintorCompleto?: boolean;
}

// --- SOLUCIÓN 2: Centralizamos también el tipo del formulario de auditoría ---
// Este tipo unificado representa todos los campos posibles en el formulario de auditoría.
export interface ExtinguisherAuditFormData {
  // Datos del equipo que se reciben
  id?: string;
  cliente?: string;
  edificio?: string;
  ubicacion?: string;
  agenteExtintor?: string;
  capacidadLibras?: string;
  modelo?: string;
  fabricacionDate?: string;
  ultimoServicioDate?: string;
  pruebaHidrostaticaDate?: string;
  pressure_indicator?: string;
  charge_status?: string;

  // Preguntas del checklist de la auditoría
  ubicacionDesignado?: "Sí" | "No";
  visibleSinObstrucciones?: "Sí" | "No";
  manometroZonaVerde?: "Sí" | "No";
  pasadorSelloIntactos?: "Sí" | "No";
  danosFisicos?: "Sí" | "No";
  instrucciones?: "Sí" | "No";
  calcomaniasPlacas?: "Sí" | "No";
  selloSeguridad?: "Sí" | "No";
  pinPasador?: "Sí" | "No";
  pinturaBuenEstado?: "Sí" | "No";
  cilindroMangueraBoquillas?: "Sí" | "No";
  alturaAdecuada?: "Sí" | "No";
  accesoLibre?: "Sí" | "No";

  // Otros campos del formulario
  articulosReemplazados?: ArticulosReemplazados;
  articulosReemplazadosNotas?: string;
  observacionesGenerales?: string;
  photoEvidenceDataUrls?: string[];
}

