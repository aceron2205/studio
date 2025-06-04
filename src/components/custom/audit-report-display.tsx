
"use client";

import type React from 'react';
import Image from 'next/image'; // Import next/image for potential future use

const auditData = {
  auditId: "AUD-2025-001",
  fecha: "2025-06-03",
  ubicacion: "CDMX - Planta Norte",
  sistema: "Sistema de Extintores",
  auditor: "Juan Pérez",
  categorias: [
    {
      nombre: "Extintores",
      subcategorias: [
        {
          nombre: "Carga y presión",
          items: [
            {
              nombre: "Verificar presión",
              respuesta: "Aprobado",
              notas: "Presión en rango",
              evidencias: ["https://placehold.co/100x75.png?text=Evidencia+1"], // Placeholder image
              piezas: [],
            },
            {
              nombre: "Cambio de boquilla",
              respuesta: "Rechazado",
              notas: "Boquilla rota, se cambió",
              evidencias: ["https://placehold.co/100x75.png?text=Evidencia+2"], // Placeholder image
              piezas: ["Boquilla B-22"],
            },
          ],
        },
      ],
    },
  ],
};

export default function AuditReportDisplay() {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-background text-foreground rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-primary border-b pb-2">Reporte de Auditoría</h1>
      <div className="mb-6 text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <p><strong>ID de Auditoría:</strong> <span className="text-foreground">{auditData.auditId}</span></p>
        <p><strong>Fecha:</strong> <span className="text-foreground">{auditData.fecha}</span></p>
        <p><strong>Ubicación:</strong> <span className="text-foreground">{auditData.ubicacion}</span></p>
        <p><strong>Sistema Auditado:</strong> <span className="text-foreground">{auditData.sistema}</span></p>
        <p className="sm:col-span-2"><strong>Auditor Principal:</strong> <span className="text-foreground">{auditData.auditor}</span></p>
      </div>

      {auditData.categorias.map((cat) => (
        <div key={cat.nombre} className="mb-8 p-4 border rounded-lg bg-card shadow">
          <h2 className="text-xl font-semibold mb-3 text-primary">{cat.nombre}</h2>
          {cat.subcategorias.map((sub) => (
            <div key={sub.nombre} className="mb-4 last:mb-0">
              <h3 className="text-lg font-medium text-card-foreground mb-2">{sub.nombre}</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-3 py-2 text-left">Item de Revisión</th>
                      <th className="border px-3 py-2 text-left">Respuesta</th>
                      <th className="border px-3 py-2 text-left">Notas / Observaciones</th>
                      <th className="border px-3 py-2 text-left">Evidencias</th>
                      <th className="border px-3 py-2 text-left">Piezas Reemplazadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="border px-3 py-2">{item.nombre}</td>
                        <td className={`border px-3 py-2 font-medium ${item.respuesta === "Aprobado" ? "text-green-600" : item.respuesta === "Rechazado" ? "text-red-600" : "text-foreground"}`}>
                          {item.respuesta}
                        </td>
                        <td className="border px-3 py-2">{item.notas}</td>
                        <td className="border px-3 py-2">
                          {item.evidencias.map((e, i) => (
                            <a 
                              key={i} 
                              href={e.startsWith('https://placehold.co') ? e : '#'} // Make placeholder clickable, others not yet
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block text-accent hover:underline"
                              data-ai-hint={e.startsWith('https://placehold.co') ? 'evidence photo' : undefined}
                            >
                              {e.startsWith('https://placehold.co') ? `Ver Evidencia ${i + 1}` : e}
                            </a>
                          ))}
                           {item.evidencias.length === 0 && <span className="text-muted-foreground">-</span>}
                        </td>
                        <td className="border px-3 py-2">
                          {item.piezas.length > 0
                            ? item.piezas.map((p, i) => (
                                <span key={i} className="block bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-sm text-xs my-0.5">
                                  {p}
                                </span>
                              ))
                            : <span className="text-muted-foreground">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
