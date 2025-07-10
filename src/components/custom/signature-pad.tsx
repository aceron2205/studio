// src/components/custom/signature-pad.tsx
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import SignaturePadLib from 'signature_pad'; // Aliased import
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  initialSignature?: string | null;
  onSignatureEnd: (dataUrl: string) => void;
  onClear: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialSignature,
  onSignatureEnd,
  onClear,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadInstance = useRef<SignaturePadLib | null>(null);

  const testPointerDownListenerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const testPointerMoveListenerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const testPointerUpListenerRef = useRef<((e: PointerEvent) => void) | null>(null);


  const initPad = useCallback(() => {
    console.log("SignaturePad: initPad called.");
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      console.log("SignaturePad: Canvas ref is available.");
      console.log("SignaturePad: canvas.offsetWidth:", canvas.offsetWidth, "canvas.offsetHeight:", canvas.offsetHeight);

      if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
        console.warn("SignaturePad: Canvas has zero dimensions. Check parent CSS or element visibility.");
        return;
      }

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      console.log("SignaturePad: Canvas internal resolution set to:", canvas.width, "x", canvas.height);

      if (!signaturePadInstance.current) {
        console.log("SignaturePad: Initializing new SignaturePadLib instance...");
        try {
          signaturePadInstance.current = new SignaturePadLib(canvas, {
            // FIX: Ensure all options are explicitly passed again
            minDistance: 0, // <--- This should be working
            dotSize: 1,
            minWidth: 0.5,
            maxWidth: 2.5,
            penColor: 'black',
          });

          // FIX: Add a direct check for minDistance on the instance after creation
          // The library might not expose _options publicly, but the effective options should be applied.
          console.log("SignaturePad: Actual minDistance on instance:", (signaturePadInstance.current as any).minDistance);


          (signaturePadInstance.current as any).onBegin = () => {
              console.log("SignaturePad: Drawing started (onBegin event from library).");
          };

          (signaturePadInstance.current as any).onEnd = () => {
            if (signaturePadInstance.current && !signaturePadInstance.current.isEmpty()) {
              onSignatureEnd(signaturePadInstance.current.toDataURL());
            }
          };
          console.log("SignaturePad: SignaturePadLib instance created successfully and onBegin/onEnd assigned.");

          (window as any).mySignaturePad = signaturePadInstance.current;
          console.log("SignaturePad: Instance exposed as window.mySignaturePad for testing.");

        } catch (error) {
          console.error("SignaturePad: Error creating SignaturePadLib instance:", error);
        }
      } else {
        console.log("SignaturePad: SignaturePadLib instance already exists.");
      }

      // --- Debugging Points: Raw Pointer Event Listeners ---
      if (!testPointerDownListenerRef.current) {
        const listenerDown = (e: PointerEvent) => { console.log("SignaturePad: Raw Pointer Down on Canvas Element!"); };
        canvas.addEventListener('pointerdown', listenerDown);
        testPointerDownListenerRef.current = listenerDown;

        const listenerMove = (e: PointerEvent) => {
          console.log("SignaturePad: Raw Pointer Move on Canvas Element! (Coords:", e.clientX, e.clientY, ")");
        };
        canvas.addEventListener('pointermove', listenerMove);
        testPointerMoveListenerRef.current = listenerMove;

        const listenerUp = (e: PointerEvent) => { console.log("SignaturePad: Raw Pointer Up on Canvas Element!"); };
        canvas.addEventListener('pointerup', listenerUp);
        testPointerUpListenerRef.current = listenerUp;

        console.log("SignaturePad: Raw 'pointerdown/move/up' listeners attached to canvas.");
      }
      // --- End Debugging Points ---

      // Ensure the pad is clear if initialSignature loading is skipped for now
      if (signaturePadInstance.current && !initialSignature) {
        signaturePadInstance.current.clear();
      }

    } else {
      console.log("SignaturePad: Canvas ref is null, cannot initialize.");
    }
  }, [initialSignature, onSignatureEnd, onClear]);

  useEffect(() => {
    initPad();
    return () => {
      // Cleanup
      if (signaturePadInstance.current) {
        signaturePadInstance.current.off();
      }
      if (canvasRef.current) {
        if (testPointerDownListenerRef.current) {
          canvasRef.current.removeEventListener('pointerdown', testPointerDownListenerRef.current);
          testPointerDownListenerRef.current = null;
        }
        if (testPointerMoveListenerRef.current) {
          canvasRef.current.removeEventListener('pointermove', testPointerMoveListenerRef.current);
          testPointerMoveListenerRef.current = null;
        }
        if (testPointerUpListenerRef.current) {
          canvasRef.current.removeEventListener('pointerup', testPointerUpListenerRef.current);
          testPointerUpListenerRef.current = null;
        }
      }
    };
  }, [initPad]);

  const handleClearClick = () => {
    if (signaturePadInstance.current) {
      signaturePadInstance.current.clear();
      onClear();
    }
  };

  const handleTestDrawAndEnd = () => {
    if (signaturePadInstance.current && canvasRef.current) {
      console.log("SignaturePad: Attempting manual draw and end sequence...");
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.stroke();
        console.log("SignaturePad: Manual red line drawn.");

        (signaturePadInstance.current as any).onEnd();
        console.log("SignaturePad: Manually triggered onEnd.");
      } else {
        console.error("SignaturePad: Could not get 2D canvas context for manual draw.");
      }
    } else {
      console.warn("SignaturePad: SignaturePad instance or canvas ref not ready for manual test.");
    }
  };


  return (
    <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-[200px] bg-gray-50 touch-action-none"
      ></canvas>
      <div className="flex justify-end p-2 bg-gray-100">
        <Button onClick={handleClearClick} variant="outline" size="sm">
          Clear
        </Button>
        <Button onClick={handleTestDrawAndEnd} variant="outline" size="sm" className="ml-2">
          Test Draw
        </Button>
      </div>
    </div>
  );
};