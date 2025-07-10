// src/app/api/generate-audit-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Helper function to build HTML from audit data
function buildPdfHtml(auditData: any): string {
  // Destructure auditData for easier access
  const { client, buildingName, auditedExtinguishers, clientSignature, selectedDate } = auditData;

  // Basic styling for the PDF. You can make this much more sophisticated with inline CSS or linked CSS.
  // For images (like signature), ensure they are correctly base64 encoded.
  const signatureImageHtml = clientSignature ? `<img src="${clientSignature}" style="max-width: 200px; max-height: 100px; border: 1px solid #ccc; margin-top: 10px;" alt="Client Signature"/>` : '<p>No signature provided.</p>';

  const dateString = selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No especificada';

  const extinguishersTableHtml = auditedExtinguishers && auditedExtinguishers.length > 0 ? `
    <h3>Extintores Auditados:</h3>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Agente</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Capacidad</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Ubicación</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Estado</th>
        </tr>
      </thead>
      <tbody>
        ${auditedExtinguishers.map((ext: any) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${ext.id || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${ext.agenteExtintor || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${ext.capacidadLibras || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${ext.ubicacion || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">Auditado</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '<p>No se auditaron extintores.</p>';


  // Construct the full HTML page content for Puppeteer
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte de Auditoría</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #A00; text-align: center; }
        h2 { color: #555; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { color: #777; margin-top: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        .section { margin-bottom: 20px; padding: 10px; border: 1px solid #eee; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Reporte de Auditoría de Extintores</h1>

      <div class="section">
        <h2>Información del Cliente</h2>
        <p><strong>Cliente:</strong> ${client?.name || 'N/A'}</p>
        <p><strong>Dirección:</strong> ${client?.direccion || 'N/A'}</p>
        <p><strong>Edificio:</strong> ${buildingName || 'N/A'}</p>
        <p><strong>Fecha de Auditoría:</strong> ${dateString}</p>
      </div>

      <div class="section">
        <h2>Detalles de la Auditoría</h2>
        ${extinguishersTableHtml}
      </div>

      <div class="section">
        <h2>Firma del Cliente</h2>
        ${signatureImageHtml}
      </div>

      <p style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #888;">Reporte generado por su sistema de auditoría.</p>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const auditData = await req.json();

    // Basic validation (add more robust validation as needed)
    if (!auditData.client || !auditData.auditedExtinguishers || !auditData.clientSignature) {
      return new NextResponse(JSON.stringify({ error: 'Missing required audit data' }), { status: 400 });
    }

    const browser = await puppeteer.launch({
      headless: true, // Use new headless mode (more modern)
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recommended for production environments (e.g., Vercel, Docker)
    });
    const page = await browser.newPage();

    // Set the HTML content for the PDF
    const htmlContent = buildPdfHtml(auditData);
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0', // Wait until network activity is minimal
    });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensure background colors/images are printed
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    // Return the PDF buffer as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="auditoria-extintores.pdf"', // Forces download
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF' }), { status: 500 });
  }
}