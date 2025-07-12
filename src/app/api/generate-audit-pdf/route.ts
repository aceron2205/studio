// src/app/api/generate-audit-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Helper function to build HTML from audit data (unchanged)
function buildPdfHtml(auditData: any): string {
  const { client, buildingName, auditedExtinguishers, clientSignature, selectedDate } = auditData;
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
  let browser;
  try {
    const auditData = await req.json();
    console.log("API Route: Received auditData (first 200 chars):", JSON.stringify(auditData).substring(0, 200));

    if (!auditData.client || !auditData.auditedExtinguishers || !auditData.clientSignature) {
      console.log("API Route: Validation failed - Missing required audit data.");
      return new NextResponse(JSON.stringify({ error: 'Missing required audit data' }), { status: 400 });
    }

    console.log("API Route: Validation passed. Attempting Puppeteer launch...");

    // FIX: More robust Puppeteer launch for cloud environments
    // Combine essential args, and try to find executable path if chrome-aws-lambda.executablePath fails
    const defaultArgs = [
      '--no-sandbox', // Always needed in constrained environments
      '--disable-setuid-sandbox', // Always needed in constrained environments
      '--disable-dev-shm-usage', // Recommended for memory-constrained environments
      '--disable-gpu',           // Recommended for some environments
      '--no-first-run',          // Skips first-run setup
      '--no-zygote',             // Can reduce memory
      '--single-process'         // Can help in some container environments
    ];

    let executablePath = await chromium.executablePath; // Path from chrome-aws-lambda

    // Try common system paths for Chromium/Chrome if chrome-aws-lambda's path doesn't work
    if (!executablePath) {
      console.warn("API Route: chrome-aws-lambda executablePath not found, trying common system paths.");
      const commonPaths = [
        '/usr/bin/chromium-browser', // Common Linux default
        '/usr/bin/google-chrome',    // Common Linux default
        '/usr/local/bin/chrome',
        // Add more paths if specific to Cloud Workstations documentation
      ];
      for (const path of commonPaths) {
        // Use Node.js 'fs' to check if the file exists and is executable
        try {
          const fs = await import('fs/promises'); // Dynamic import for fs
          await fs.access(path, fs.constants.X_OK); // Check if file exists and is executable
          executablePath = path;
          console.log(`API Route: Found executable at: ${path}`);
          break;
        } catch (e) {
          // Path not found or not executable
        }
      }
    }

    if (!executablePath) {
      console.error("API Route: No Chromium executable found at any path. Puppeteer cannot launch.");
      throw new Error("No Chromium executable found for PDF generation. Contact support.");
    }

    console.log("API Route: Launching browser with executablePath:", executablePath, "and args:", defaultArgs);
    
    browser = await puppeteer.launch({
      args: defaultArgs,
      executablePath: executablePath,
      headless: chromium.headless, // Use headless option from chrome-aws-lambda
      timeout: 60000, // Increase launch timeout
    });
    console.log("API Route: Puppeteer browser launched successfully.");

    const page = await browser.newPage();
    console.log("API Route: New page created.");

    await page.setViewport({ width: 1080, height: 1024 });

    const htmlContent = buildPdfHtml(auditData);
    console.log("API Route: HTML content built (first 500 chars):", htmlContent.substring(0, 500));
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    console.log("API Route: Page content set.");

    console.log("API Route: Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      timeout: 60000
    });
    console.log("API Route: PDF generated successfully.");

    if (browser) {
      await browser.close();
      console.log("API Route: Browser closed.");
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="auditoria-extintores.pdf"',
      },
    });

  } catch (error: any) {
    console.error('API Route: Error generating PDF (detailed):', error.message || error);
    if (error.stack) {
        console.error('API Route: Error Stack:', error.stack);
    }
    if (browser) {
      try {
        await browser.close();
        console.log("API Route: Browser closed due to error.");
      } catch (closeError) {
        console.error("API Route: Error closing browser after generation failure:", closeError);
      }
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF', details: error.message || 'Unknown error' }), { status: 500 });
  }
}