// src/app/api/generate-audit-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, Content, TFontDictionary, TableCell } from 'pdfmake/interfaces';


// Helper function to build PDF definition from audit data
function buildPdfDefinition(auditData: any): TDocumentDefinitions {
  const { client, buildingName, auditedExtinguishers, clientSignature, selectedDate } = auditData;

  const dateString = selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No especificada';

  const tableBody: TableCell[][] = []; 

  // Add table headers
  tableBody.push([
    { text: 'ID', style: 'tableHeader' },
    { text: 'Agente', style: 'tableHeader' },
    { text: 'Capacidad', style: 'tableHeader' },
    { text: 'Ubicación', style: 'tableHeader' },
    { text: 'Estado', style: 'tableHeader' }
  ]);

  // Add table data rows
  if (auditedExtinguishers && auditedExtinguishers.length > 0) {
    (auditedExtinguishers as any[]).forEach((ext) => {
      tableBody.push([
        { text: ext.id || 'N/A' },
        { text: ext.agenteExtintor || 'N/A' },
        { text: ext.capacidadLibras || 'N/A' },
        { text: ext.ubicacion || 'N/A' },
        { text: 'Auditado' }
      ]);
    });
  } else {
    tableBody.push([{ text: 'No se auditaron extintores.', colSpan: 5 }]);
  }


  let signatureImageContent: Content;
  if (clientSignature && typeof clientSignature === 'string' && clientSignature.startsWith('data:image/')) {
    signatureImageContent = { image: clientSignature, width: 200, height: 100, margin: [0, 10, 0, 0] };
  } else {
    signatureImageContent = { text: 'No se proporcionó firma.', margin: [0, 10, 0, 0] };
  }

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'Reporte de Auditoría de Extintores', style: 'header' },
      {
        text: 'Información del Cliente',
        style: 'subheader',
        margin: [0, 10, 0, 5],
      },
      { text: `Cliente: ${client?.name || 'N/A'}` },
      { text: `Dirección: ${client?.direccion || 'N/A'}` },
      { text: `Edificio: ${buildingName || 'N/A'}` },
      { text: `Fecha de Auditoría: ${dateString}` },

      {
        text: 'Detalles de la Auditoría',
        style: 'subheader',
        margin: [0, 15, 0, 5],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', 'auto'],
          body: tableBody,
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5, 0, 15],
      },
      {
        text: 'Firma del Cliente',
        style: 'subheader',
        margin: [0, 15, 0, 5],
      },
      signatureImageContent,
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20],
        color: '#A00',
      },
      subheader: {
        fontSize: 16,
        bold: true,
        color: '#555',
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        fillColor: '#f2f2f2'
      },
    },
    // FIX: defaultPageMargins goes directly at the root of docDefinition
    pageMargins: [40, 40, 40, 40], // <--- FIX IS HERE: Correct placement
  };

  return docDefinition;
}

// Define fonts here, outside the POST function so it's initialized once
const fonts: TFontDictionary = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
};

// Create a PdfPrinter instance here, outside the POST function so it's initialized once
const printer = new PdfPrinter(fonts);

export async function POST(req: NextRequest) {
  try {
    const auditData = await req.json();
    console.log("API Route (pdfmake): Received auditData (first 200 chars):", JSON.stringify(auditData).substring(0, 200));

    if (!auditData.client || !auditData.auditedExtinguishers || !auditData.clientSignature) {
      console.log("API Route: Validation failed - Missing required audit data.");
      return new NextResponse(JSON.stringify({ error: 'Missing required audit data' }), { status: 400 });
    }

    console.log("API Route (pdfmake): Validation passed. Building PDF definition...");
    const docDefinition = buildPdfDefinition(auditData);

    // FIX: Use type assertion for createPdfKit as TypeScript might be overly strict here
    const pdfDoc = (printer as any).createPdfKit(docDefinition); // <--- FIX IS HERE: Use type assertion

    let pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: any[] = [];
      pdfDoc.on('data', (chunk: any) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err: any) => reject(err));
      pdfDoc.end(); // Don't forget to call .end() to finalize the PDF
    });

    console.log("API Route (pdfmake): PDF generated successfully with pdfmake.");

    // FIX: Convert Buffer to Uint8Array for NextResponse.
    return new NextResponse(new Uint8Array(pdfBuffer), { // <--- FIX IS HERE: Convert to Uint8Array
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="auditoria-extintores.pdf"',
      },
    });

  } catch (error: any) {
    console.error('API Route (pdfmake): Error generating PDF (detailed):', error.message || error);
    if (error.stack) {
        console.error('API Route: Error Stack:', error.stack);
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF', details: error.message || 'Unknown error' }), { status: 500 });
  }
}