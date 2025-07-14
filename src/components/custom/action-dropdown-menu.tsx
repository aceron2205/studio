// src/components/custom/ActionDropdownMenu.tsx
"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Play,       // For Auditar
  Download,   // For Descargar
  CalendarClock, // For Reagendar auditoria (Calendar with clock)
  Ban,        // For Cancelar Auditoría (Stop/Cancel icon)
  ThumbsUp,   // For Client Approval
  Eye,        // For View
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
 
} from "@/components/ui/dropdown-menu";

interface ActionDropdownMenuProps {
  itemId: string;
  itemName: string;
  onAudit?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onScheduleAudit?: (id: string) => void;
  onCancelAudit?: (id: string) => void;
  onClientApproval?: (id: string) => void;
  edifId?: string; // Add edifId prop
}

/**
 * A reusable dropdown menu component for common actions on an item.
 */
export const ActionDropdownMenu: React.FC<ActionDropdownMenuProps> = ({
  itemId,
  itemName,
  onAudit,
  onView,
  onDownload,
  onScheduleAudit,
  onCancelAudit,
  onClientApproval,
  edifId, // Destructure edifId
}) => {
  const hasPrimaryActions = onClientApproval || onView || onAudit || onDownload || onScheduleAudit;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Opciones para ${itemName}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onClientApproval && (
          <DropdownMenuItem onClick={() => onClientApproval(itemId)}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            Aprobación Cliente
          </DropdownMenuItem>
        )}
        {onView && (
          <DropdownMenuItem onClick={() => onView(itemId)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Auditoría
          </DropdownMenuItem>
        )}
        {onAudit && (
          <DropdownMenuItem onClick={() => onAudit(itemId)}>
            {/* Use Link for navigation */}
            {edifId ? (
              <a href={`/view-plans/${edifId}`} className="flex items-center w-full">
                <Play className="mr-2 h-4 w-4" />
                Auditar
              </a>
            ) : (
              <>
              <Play className="mr-2 h-4 w-4" />
              </>)}
            Auditar
          </DropdownMenuItem>
        )}
        {onDownload && (
          <DropdownMenuItem onClick={() => onDownload(itemId)}>
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </DropdownMenuItem>
        )}
        {onScheduleAudit && (
          <DropdownMenuItem onClick={() => onScheduleAudit(itemId)}>
            <CalendarClock className="mr-2 h-4 w-4" />
            Agendar auditoria
          </DropdownMenuItem>
        )}
        {hasPrimaryActions && onCancelAudit && <DropdownMenuSeparator />}
        {onCancelAudit && (
          <DropdownMenuItem
            onClick={() => onCancelAudit(itemId)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancelar Auditoría
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
