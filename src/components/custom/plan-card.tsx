
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Edit3, FileCheck, Check, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Plan {
  id: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string; // Kept for data structure consistency
  clientName?: string;
  location?: string;
}

interface PlanCardProps {
  plan: Plan;
  isDownloading: boolean;
  isDownloaded: boolean;
  onViewPlan: (planId: string, planName: string) => void;
  onAuditPlan: (planId: string, planName: string) => void;
  onDownloadPlan: (planId: string, planName: string) => void;
}

export function PlanCard({
  plan,
  isDownloading,
  isDownloaded,
  onViewPlan,
  onAuditPlan,
  onEditPlan,
  onDownloadPlan,
}: PlanCardProps) {

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (e.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')) {
      return;
    }
    onViewPlan(plan.id, plan.name);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (e.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')) {
        return;
      }
      onViewPlan(plan.id, plan.name);
    }
  };

  return (
    <Card
      className="overflow-hidden shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background rounded-xl transition-shadow duration-200 ease-in-out flex flex-col h-full group"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="article"
      aria-labelledby={`plan-title-${plan.id}`}
    >
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 id={`plan-title-${plan.id}`} className="font-semibold text-md text-card-foreground truncate flex-grow pr-2 group-hover:text-primary" title={plan.name}>
            {plan.name}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={(e) => e.stopPropagation()} // Prevent card click from triggering
                aria-label={`Más opciones para ${plan.name}`}
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Más opciones para {plan.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onViewPlan(plan.id, plan.name)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Plano
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAuditPlan(plan.id, plan.name)}>
                <FileCheck className="mr-2 h-4 w-4" />
                Auditar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditPlan(plan.id, plan.name)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDownloadPlan(plan.id, plan.name)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isDownloaded ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading
                  ? 'Descargando...'
                  : isDownloaded
                  ? 'Descargado'
                  : 'Descargar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {plan.clientName && <p className="text-xs text-muted-foreground">Cliente: {plan.clientName}</p>}
        {plan.location && <p className="text-xs text-muted-foreground">Ubicación: {plan.location}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Última mod.: {plan.lastModified}
        </p>
      </div>
    </Card>
  );
}
