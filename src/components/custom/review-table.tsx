import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface AuditResult {
  extinguisherId: string;
  agent: string;
  capacity: string;
  location: string;
  auditStatus: string;
  auditDate: string;
}

interface ReviewTableProps {
  auditResults: AuditResult[];
  handleViewDetails: (extinguisherId: string) => void;
  handleSaveAudit: () => void;
  getAuditStatus: (extinguisherId: string) => string;
  getAuditDate: (extinguisherId: string) => string;
}

const ReviewTableSign: React.FC<ReviewTableProps> = ({
  auditResults,
  handleViewDetails,
  handleSaveAudit,
  getAuditStatus,
  getAuditDate
}) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Extintor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditResults.map((result) => (
            <TableRow key={`ext-${result.extinguisherId}`}>
              <TableCell>{result.extinguisherId}</TableCell>
              <TableCell>{getAuditStatus(result.extinguisherId)}</TableCell>
              <TableCell>{getAuditDate(result.extinguisherId)}</TableCell>
              <TableCell>
                {getAuditStatus(result.extinguisherId) === "Auditado" && (
                  <Button onClick={() => handleViewDetails(result.extinguisherId)}>
                    Ver detalles
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button onClick={handleSaveAudit}>Guardar</Button>
      </div>
    </div>
  );
};

export default ReviewTableSign;
