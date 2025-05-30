
"use client"; // Mark as client component to use hooks like useSearchParams

import React from 'react';
import { PlanEditor } from '@/components/custom/plan-editor';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

interface EditPlanPageProps {
  params: {
    planId: string;
  };
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  const searchParams = useSearchParams();
  const planName = searchParams.get('name') || (params.planId === 'new' ? 'Nuevo Plano' : `Plano ${params.planId}`);
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-4xl">
        <PlanEditor planId={params.planId} planName={decodeURIComponent(planName)} />
      </div>
    </div>
  );
}
