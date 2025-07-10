// src/components/custom/signature-pad.tsx
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  initialSignature?: string | null;
  onSignatureEnd: (dataUrl: string) => void; // This fires when a stroke ends
  onClear: () => void;
  onSaveClick?: (dataUrl: string) => void; // <--- NEW PROP: Fires when Save button is clicked
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialSignature,
  onSignatureEnd,
  onClear,
  onSaveClick, // <--- Destructure the new prop
}) => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  const isCapturingRef = useRef(false);

  useEffect(() => {
    if (!sigCanvasRef.current) {
        console.log("SignaturePad: Canvas ref not ready for initial load effect.");
        return;
    }

    if (isCapturingRef.current) {
        isCapturingRef.current = false;
        console.log("SignaturePad: Skipping initial load, signature was just captured.");
        return;
    }

    if (initialSignature) {
      try {
        sigCanvasRef.current.fromDataURL(initialSignature);
        console.log("SignaturePad: Initial signature loaded from data URL.");
      } catch (error) {
        console.error("SignaturePad: Error loading initial signature from DataURL (corrupted data?):", error);
        sigCanvasRef.current.clear();
        onClear();
      }
    } else {
      sigCanvasRef.current.clear();
      console.log("SignaturePad: Pad cleared (no initial signature).");
    }
  }, [initialSignature, onClear]);

  const handleStrokeEnd = useCallback(() => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      isCapturingRef.current = true;
      onSignatureEnd(sigCanvasRef.current.toDataURL());
      console.log("SignaturePad: Stroke ended, signature captured.");
    }
  }, [onSignatureEnd]);

  const handleClearClick = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      isCapturingRef.current = false;
      onClear();
      console.log("SignaturePad: Clear button clicked, pad cleared.");
    }
  };

  // <--- NEW: Handler for the Guardar button click
  const handleSaveClick = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL();
      console.log("SignaturePad: Guardar button clicked, capturing current signature.");
      // Call the onSaveClick prop, passing the data URL
      if (onSaveClick) {
        onSaveClick(dataUrl);
      } else {
        // If no onSaveClick prop is provided, you might want to log or show a local toast
        console.warn("SignaturePad: onSaveClick prop not provided to save signature.");
        // Optional: show a toast here if you want local feedback even without parent handler
        // toast({ title: "Firma Guardada", description: "Firma capturada y lista para ser procesada.", variant: "default" });
      }
      // Since onSaveClick might not immediately trigger parent's onSignatureEnd if it was empty,
      // we might want to ensure the parent's signature state is updated.
      // If onSaveClick exists, it should handle the update in the parent.
      // If onSaveClick doesn't exist, we'll still call onSignatureEnd to ensure data is present in context.
      // onSignatureEnd(dataUrl); // This might be redundant if onSaveClick also updates context.
    } else {
      console.log("SignaturePad: Guardar button clicked, but signature pad is empty.");
    //   toast({
    //     title: "Firma Vacía",
    //     description: "El pad de firma está vacío. Por favor, firme antes de guardar.",
    //     variant: "destructive",
    //   });
    }
  };
  // END NEW HANDLER

  return (
    <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
      <SignatureCanvas
        ref={sigCanvasRef}
        onEnd={handleStrokeEnd}
        canvasProps={{
          width: 496,
          height: 200,
          className: 'w-full h-[200px] bg-gray-50',
          style: {
            touchAction: 'none',
          },
        }}
        dotSize={1}
        minWidth={0.5}
        maxWidth={2.5}
        penColor="black"
      />
      <div className="flex justify-end p-2 bg-gray-100">
        <Button onClick={handleClearClick} variant="outline" size="sm">
          Clear
        </Button>
        {/* NEW: Guardar Button */}
        <Button onClick={handleSaveClick} variant="outline" size="sm" className="ml-2">
          Guardar
        </Button>
      </div>
    </div>
  );
};