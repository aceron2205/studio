"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/mocks/extinguisherMocks';
import { ExtinguisherData } from '@/types/extinguisher'

// Define the shape of your audit context state
interface AuditContextState {
  client: Client | null;
  buildingName: string | null;
  auditedExtinguishers: ExtinguisherData[];
  clientSignature: string | null;
}

// Define the shape of your audit context actions
interface AuditContextActions {
  setClient: (client: Client | null) => void;
  setBuildingName: (buildingName: string | null) => void;
  setAuditedExtinguishers: React.Dispatch<React.SetStateAction<ExtinguisherData[]>>;
  setClientSignature: (signatureDataUrl: string | null) => void;
  clearAuditState: () => void;
}

// Combine state and actions into the context value type
type AuditContextType = AuditContextState & AuditContextActions;

// Create the context
const AuditContext = createContext<AuditContextType | undefined>(undefined);

// Create the provider component
 export const AuditProvider = ({ children }: { children: ReactNode }) => { // <--- FIX IS HERE
  const [client, setClient] = useState<Client | null>(null);
  const [buildingName, setBuildingName] = useState<string | null>(null);
  const [auditedExtinguishers, setAuditedExtinguishers] = useState<ExtinguisherData[]>([]);
  const [clientSignature, setClientSignature] = useState<string | null>(null); // This line was correctly added in our previous step

  const clearAuditState = () => {
    setClient(null);
    setBuildingName(null);
    setAuditedExtinguishers([]);
    setClientSignature(null);
  };

  const contextValue: AuditContextType = {
    client,
    setClient,
    buildingName,
    setBuildingName,
    auditedExtinguishers,
    setAuditedExtinguishers,
    clientSignature,
    setClientSignature,
    clearAuditState,
  };

  return (
    <AuditContext.Provider value={contextValue}>
      {children}
    </AuditContext.Provider>
  );
};

// Custom hook to use the audit context
export const useAudit = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};