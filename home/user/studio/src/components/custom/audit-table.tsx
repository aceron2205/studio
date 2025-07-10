"use client";

import * as React from "react";
// Import the necessary UI table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the interface for the audit data passed as props
interface Audit {
  fecha: string;
  client: {
    name: string;
    direccion: string;
  };
  status: string;
}

// Define the props for the AuditTable component
interface AuditTableProps {
  audits: Audit[]; // Expects an array of Audit objects
}

// The AuditTable component
export function AuditTable({ audits }: AuditTableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-card p-4 sm:p-6 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Update Table Headers */}
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the 'audits' prop to render rows */}
            {audits.map((audit, index) => (
              <TableRow key={index}> {/* Using index as key, consider a unique audit ID if available */}
                <TableCell className="font-medium">{audit.fecha}</TableCell>
                <TableCell>{audit.client.name}</TableCell>
                <TableCell>{audit.client.direccion}</TableCell>
                <TableCell>{audit.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}