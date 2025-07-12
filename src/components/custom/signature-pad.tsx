// src/components/custom/signature-pad.tsx
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas'; // <--- CORRECT LIBRARY IMPORT
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast"; // Assuming toast is available for local messages


interface SignaturePadProps {
  initialSignature?: string | null;
  onSignatureEnd: (dataUrl: string) => void;
  onClear: () => void;
  onSaveClick?: (dataUrl: string) => void; // For the Guardar button
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialSignature,
  onSignatureEnd,
  onClear,
  onSaveClick,
}) => {
  // Ref for the SignatureCanvas component instance (NOT raw canvas)
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  // Ref to track if the signature was just captured by this component's onEnd
  // This helps prevent re-loading the same signature we just drew, avoiding visual glitches.
  const isCapturingRef = useRef(false);

  // Effect to load initial signature or clear on mount/initialSignature change
  // This runs when initialSignature (from parent context) changes.
  useEffect(() => {
    // Only attempt to load if sigCanvasRef.current exists (component is mounted)
    if (!sigCanvasRef.current) {
        console.log("SignaturePad: Canvas ref not ready for initial load effect.");
        return;
    }

    // Prevent re-loading the signature if it was just captured by our onEnd handler.
    // This stops the duplication we saw previously.
    if (isCapturingRef.current) {
        isCapturingRef.current = false; // Reset the flag after checking
        console.log("SignaturePad: Skipping initial load, signature was just captured by current component.");
        return;
    }

    if (initialSignature) {
      try {
        sigCanvasRef.current.fromDataURL(initialSignature);
        console.log("SignaturePad: Initial signature loaded from data URL.");
      } catch (error) {
        console.error("SignaturePad: Error loading initial signature from DataURL (corrupted data?):", error);
        sigCanvasRef.current.clear(); // Clear visually on error
        onClear(); // Clear parent state on error
      }
    } else {
      sigCanvasRef.current.clear(); // Clear the pad if no initial signature
      console.log("SignaturePad: Pad cleared (no initial signature).");
    }
  }, [initialSignature, onClear]); // Depend on initialSignature and onClear

  // Callback for when a stroke ends on the signature canvas (triggered by react-signature-canvas)
  const handleStrokeEnd = useCallback(() => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      isCapturingRef.current = true; // Set flag: we are about to capture the signature
      onSignatureEnd(sigCanvasRef.current.toDataURL());
      console.log("SignaturePad: Stroke ended, signature captured.");
    }
  }, [onSignatureEnd]);

  // Handler for the Clear button
  const handleClearClick = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear(); // Clear the pad visually
      isCapturingRef.current = false; // Reset capture flag on clear
      onClear(); // Inform parent component to clear the signature data
      console.log("SignaturePad: Clear button clicked, pad cleared.");
    }
  };

  // Handler for the "Guardar" button click
  const handleSaveClick = () => {
    if (sigCanvasRef.current) { // Always attempt to capture if pad instance exists
      const dataUrl = sigCanvasRef.current.toDataURL();
      console.log("SignaturePad: Guardar button clicked, capturing current signature.");
      if (onSaveClick) {
        onSaveClick(dataUrl); // Call the onSaveClick prop, passing the data URL
        // Optionally, reset capture flag if saving means it's finalized
        // isCapturingRef.current = false;
      }
    } else {
      console.log("SignaturePad: Guardar button clicked, but signature pad is not initialized or empty.");
      toast({ // Use the toast available via import
        title: "Firma Vacía",
        description: "El pad de firma está vacío. Por favor, firme antes de guardar.",
        variant: "destructive",
      });
    }
  };

  // The 'Test Draw' button is generally not needed with react-signature-canvas
  // as its onEnd/onBegin should work directly. But keeping a simplified version
  // if you still need to visually test direct drawing capabilities.
  const handleTestDrawAndEnd = () => {
      if (sigCanvasRef.current) {
          // This library doesn't have a direct 'drawPoint' method.
          // The best way to test drawing is via user input or by setting initialSignature.
          console.log("SignaturePad: To test drawing, please use mouse/finger. Manual draw via API is complex for this library.");
        //   toast({
        //     title: "Test de Dibujo",
        //     description: "Por favor, dibuje directamente en el pad.",
        //     variant: "info",
        //   });
      }
  };


  return (
    <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
      <SignatureCanvas
        ref={sigCanvasRef} // Attach ref to the SignatureCanvas component
        onEnd={handleStrokeEnd} // Fires when a stroke is completed by user
        canvasProps={{ // Props passed directly to the underlying <canvas> element
          width: 496, // Match your desired width
          height: 200, // Match your desired height
          className: 'w-full h-[200px] bg-gray-50', // Tailwind classes for visual styling
          style: {
            touchAction: 'none', // CRITICAL for preventing scrolling on touch devices
          },
        }}
        // Other options passed directly as props to SignatureCanvas
        dotSize={1}
        minWidth={0.5}
        maxWidth={2.5}
        penColor="black"
      />
      <div className="flex justify-end p-2 bg-gray-100">
        <Button onClick={handleClearClick} variant="outline" size="sm">
          Clear
        </Button>
        <Button onClick={handleSaveClick} variant="outline" size="sm" className="ml-2">
          Guardar
        </Button>
        <Button onClick={handleTestDrawAndEnd} variant="outline" size="sm" className="ml-2">
          Test Draw
        </Button>
      </div>
    </div>
  );
};

// Export as default
export default SignaturePad;