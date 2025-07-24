// types/html2pdf.d.ts

// Declare the module to tell TypeScript its shape
declare module 'html2pdf.js' {
  // Define the options interface, matching what html2pdf.js accepts
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number]; // [top, left, bottom, right]
    filename?: string;
    image?: {
      type?: 'jpeg' | 'png';
      quality?: number; // 0 to 1
    };
    html2canvas?: {
      scale?: number;
      dpi?: number; // Dots per inch, affects resolution
      letterRendering?: boolean;
      useCORS?: boolean; // Important for images loaded from different origins
      logging?: boolean;
      // You can add more html2canvas options here as needed
    };
    jsPDF?: {
      unit?: 'pt' | 'mm' | 'cm' | 'in';
      format?: string | [number, number]; // e.g., 'a4', 'letter', [width, height]
      orientation?: 'portrait' | 'landscape';
      // You can add more jsPDF options here as needed
    };
    enableLinks?: boolean; // Set to true to make links in the PDF clickable
    pagebreak?: {
      mode?: 'avoid-all' | 'css' | 'legacy' | 'always';
      after?: string | string[]; // CSS selector(s) to break after
      before?: string | string[]; // CSS selector(s) to break before
      avoid?: string | string[]; // CSS selector(s) to avoid breaking inside
    };
    // Add other top-level options if you discover them in html2pdf.js docs
  }

  // Define the chainable interface for the html2pdf object
  // This represents the object returned by html2pdf() that you chain methods on
  interface Html2PdfChainable {
    set(opt: Html2PdfOptions): Html2PdfChainable;
    from(element: HTMLElement | string): Html2PdfChainable; // Takes an HTML element or a selector string
    toPdf(): Html2PdfChainable; // Method to convert to PDF (often internal)
    get(type: 'jsPDF', cb: (jsPDF: any) => void): Html2PdfChainable; // Get underlying jsPDF object
    output(type: 'datauristring'): Promise<string>; // Returns Data URI as string
    output(type: 'arraybuffer'): Promise<ArrayBuffer>; // Returns as ArrayBuffer
    output(type: 'blob'): Promise<Blob>; // Returns as Blob
    output(type: 'arraybuffer', callback: (data: ArrayBuffer) => void): Html2PdfChainable;
    output(type: 'blob', callback: (data: Blob) => void): Html2PdfChainable;
    output(type: 'datauristring', callback: (data: string) => void): Html2PdfChainable;
    output(type: 'string', callback: (data: string) => void): Html2PdfChainable;
    output(type: string, callback?: (data: any) => void): Html2PdfChainable | Promise<any>;

    save(filename?: string): Promise<void>; // Saves the PDF directly
    // Add other methods if you use them, e.g., .then(), .catch() as they return promises
  }

  // Declare the main function that `html2pdf.js` exports.
  // This is the function you call like `html2pdf()`
  function html2pdf(): Html2PdfChainable;

  // Since `dynamic(() => import('html2pdf.js').then(mod => mod))` means it's likely a default export
  export default html2pdf;
}