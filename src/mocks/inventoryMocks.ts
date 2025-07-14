// src/mocks/inventoryMocks.ts (or src/types/inventory.ts)

export interface InventoryItem {
    id: string;
    articleName: string; // Your original field
    description: string;
    stockQuantity: number;
    unit: string;
    suggestedSupplier?: string;
    lastUpdated: string; // YYYY-MM-DD
    lowStockThreshold: number;
    
    // === NEW FIELDS ADDED FOR SEARCHING PURPOSES (making them optional) ===
    sku?: string;      // Added for search
    location?: string; // Added for search
    category?: string; // Added for search
    // =====================================================================
  }
  
  export const mockInventoryItems: InventoryItem[] = [
    {
      id: "item-001",
      articleName: "Manómetro 175 PSI",
      description: "Manómetro estándar para extintores PQS ABC.",
      stockQuantity: 120,
      unit: "piezas",
      suggestedSupplier: "ExtinMex S.A.",
      lastUpdated: "2024-07-15",
      lowStockThreshold: 20,
      sku: "MANO-175PSI", // Added for search
      location: "Almacén Principal A1", // Added for search
      category: "Componente" // Added for search
    },
    {
      id: "item-002",
      articleName: "Sello de Seguridad (Plástico)",
      description: "Sello de garantía para válvula de extintor.",
      stockQuantity: 550,
      unit: "piezas",
      suggestedSupplier: "SeguriTech Global",
      lastUpdated: "2024-07-20",
      lowStockThreshold: 100,
      sku: "SELLO-PLAST",
      location: "Almacén Secundario B2",
      category: "Insumo"
    },
    {
      id: "item-003",
      articleName: "Polvo Químico Seco ABC (Saco)",
      description: "Agente extintor tipo ABC, presentación en saco de 20kg.",
      stockQuantity: 15,
      unit: "sacos",
      suggestedSupplier: "Químicos Industriales GDA",
      lastUpdated: "2024-06-30",
      lowStockThreshold: 5,
      sku: "PQS-ABC-20KG",
      location: "Almacén Principal A1",
      category: "Agente"
    },
    {
      id: "item-004",
      articleName: "Manguera para PQS 10 lbs",
      description: "Manguera de descarga completa con boquilla para PQS de 10 lbs.",
      stockQuantity: 35,
      unit: "piezas",
      suggestedSupplier: "ExtinMex S.A.",
      lastUpdated: "2024-07-05",
      lowStockThreshold: 10,
      sku: "MANG-PQS10",
      location: "Almacén Secundario B2",
      category: "Componente"
    },
    {
      id: "item-005",
      articleName: "Nitrógeno (Cilindro de recarga)",
      description: "Gas para presurización de extintores.",
      stockQuantity: 5,
      unit: "cilindros",
      suggestedSupplier: "Infra Gas",
      lastUpdated: "2024-07-01",
      lowStockThreshold: 2,
      sku: "N2-CIL",
      location: "Almacén Especializado C3",
      category: "Insumo"
    },
    {
      id: "item-006",
      articleName: "Etiqueta de Recarga/Mantenimiento",
      description: "Collarín/etiqueta para registro de servicio.",
      stockQuantity: 800,
      unit: "piezas",
      suggestedSupplier: "Imprenta Segura",
      lastUpdated: "2024-07-22",
      lowStockThreshold: 200,
      sku: "ETIQ-REC",
      location: "Oficina Administrativa",
      category: "Papeleria"
    },
     {
      id: "item-007",
      articleName: "Válvula para PQS",
      description: "Válvula completa para extintor de Polvo Químico Seco.",
      stockQuantity: 8,
      unit: "piezas",
      suggestedSupplier: "ExtinMex S.A.",
      lastUpdated: "2024-05-10",
      lowStockThreshold: 5,
      sku: "VALV-PQS-STD",
      location: "Almacén Principal A1",
      category: "Componente"
    },
  ];