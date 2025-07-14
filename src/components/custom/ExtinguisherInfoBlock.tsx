// En tu archivo: src/components/custom/ExtinguisherInfoBlock.tsx

"use client";
import * as React from "react";
import { ShieldAlert, Calendar } from "lucide-react";
import { ExtinguisherData } from "@/types/extinguisher";

// Las props del componente ahora son más simples.
interface ExtinguisherInfoBlockProps {
  data: ExtinguisherData;
  showVencePronto: boolean;
}

export function ExtinguisherInfoBlock({
  data,
  showVencePronto,
}: ExtinguisherInfoBlockProps) {

  return (
    <div className="space-y-6 py-4">
      {/* SECCIÓN DE IDENTIFICACIÓN PRINCIPAL */}
      <div className="flex items-center justify-between text-lg">
        <span className="flex items-center text-primary font-semibold">
          <ShieldAlert className="w-5 h-5 mr-2" />
          ID del Equipo:
        </span>
        {/* Se accede al ID a través del objeto 'data' */}
        <span className="font-bold text-foreground">{data.id}</span>
      </div>

      {/* SECCIÓN DE DATOS GENERALES */}
      <div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Datos Generales del Extinguidor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Cliente:</span>
            <span className="text-foreground text-right">{data.cliente || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Edificio:</span>
            <span className="text-foreground text-right">{data.edificio || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Ubicación:</span>
            <span className="text-foreground text-right">{data.ubicacion || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Agente Extintor:</span>
            <span className="text-foreground text-right">{data.agenteExtintor || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Capacidad:</span>
            <span className="text-foreground text-right">{data.capacidadLibras || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Modelo:</span>
            <span className="text-foreground text-right">{data.modelo || "N/A"}</span>
          </div>
        </div>
      </div>
      
      {/* SECCIÓN DE FECHAS CLAVE */}
      <div className="pt-2">
        <h4 className="text-lg font-semibold text-muted-foreground mb-2 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Fechas Clave
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Fabricación:</span>
            <span className="text-foreground">{data.fabricacionDate || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b">
            <span className="font-medium text-muted-foreground">Último Servicio:</span>
            <span className="text-foreground">{data.ultimoServicioDate || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b md:col-span-2">
            <span className="font-medium text-muted-foreground">Prueba Hidrostática:</span>
            <span className="text-foreground flex items-center">
              {data.pruebaHidrostaticaDate || "N/A"}
              {showVencePronto && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  VENCE PRONTO
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}