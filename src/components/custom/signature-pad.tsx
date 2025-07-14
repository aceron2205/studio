"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";


interface SignaturePadProps {
  initialSignature?: string | null;
  onSignatureEnd: (dataUrl: string) => void;
  onClear: () => void;
  onSaveClick?: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialSignature,
  onSignatureEnd,
  onClear,
  onSaveClick,
}) => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const isCapturingRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Log to see every render attempt for debugging
  console.log("SignaturePad Component: Render cycle initiated. Mounted state:", mounted);

  // Effect to set mounted to true (runs once on client mount)
  useEffect(() => {
    console.log("SignaturePad Component: Primary mounting useEffect triggered.");
    setMounted(true); // <-- This should make the component render in the next cycle
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to load initial signature or clear on initialSignature change
  useEffect(() => {
    if (!mounted) {
        console.log("SignaturePad Component: Skipping initial signature load, component not yet mounted.");
        return;
    }

    if (!sigCanvasRef.current) {
        console.log("SignaturePad Component: Canvas ref not ready for initial signature load (inside second useEffect).");
        return;
    }

    if (isCapturingRef.current) {
        isCapturingRef.current = false;
        console.log("SignaturePad Component: Skipping initial load, signature was just captured locally.");
        return;
    }

    if (initialSignature) {
      const loadTimeout = setTimeout(() => {
        if (sigCanvasRef.current && sigCanvasRef.current.isEmpty()) {
          try {
            sigCanvasRef.current.fromDataURL(initialSignature);
            console.log("SignaturePad Component: Initial signature loaded from data URL.");
          } catch (error) {
            console.error("SignaturePad Component: Error loading initial signature (corrupted data?):", error);
            sigCanvasRef.current.clear();
            onClear();
          }
        } else {
            console.log("SignaturePad Component: Skipping initial load, canvas is not empty or ref is null.");
        }
      }, 0);

      return () => clearTimeout(loadTimeout);
    } else {
      sigCanvasRef.current.clear();
      console.log("SignaturePad Component: Pad cleared (no initial signature provided).");
    }
  }, [mounted, initialSignature, onClear]);

  // Callback for when a stroke ends
  const handleStrokeEnd = useCallback(() => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      isCapturingRef.current = true;
      onSignatureEnd(sigCanvasRef.current.toDataURL());
      console.log("SignaturePad Component: Stroke ended, signature captured.");
    }
  }, [onSignatureEnd]);

  // Handler for the Clear button
  const handleClearClick = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      isCapturingRef.current = false;
      onClear();
      console.log("SignaturePad Component: Clear button clicked, pad cleared.");
    }
  };

  // Handler for the "Guardar" button click
  const handleSaveClick = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL();
      console.log("SignaturePad Component: Guardar button clicked, capturing current signature.");
      if (onSaveClick) {
        onSaveClick(dataUrl);
      }
    } else {
      console.log("SignaturePad Component: Guardar button clicked, but signature pad is empty.");
      toast({
        title: "Firma Vacía",
        description: "El pad de firma está vacío. Por favor, firme antes de guardar.",
        variant: "destructive",
      });
    }
  };

  const handleTestDrawAndEnd = () => {
      console.log("SignaturePad Component: To test drawing, please use mouse/finger.");
  };

  // Crucial: Only render SignatureCanvas and its logic if mounted on the client
  if (!mounted) {
    console.log("SignaturePad Component: Returning null because not yet mounted on client.");
    return null;
  }

  // Moved console.log statement outside of JSX
  console.log("SignaturePad Component: Rendering SignatureCanvas JSX (mounted is true).");

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

export default SignaturePad;