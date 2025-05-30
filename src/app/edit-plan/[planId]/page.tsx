"use client";

import React, { use } from 'react'; // Import use
import { PlanEditor } from '@/components/custom/plan-editor';
import { useSearchParams } from 'next/navigation';

interface EditPlanPageProps {
  params: Promise<{ // params is treated as a Promise
    planId: string;
  }>;
}

export default function EditPlanPage({ params: paramsPromise }: EditPlanPageProps) { // Renamed params to paramsPromise for clarity
  const { planId } = use(paramsPromise); // Unwrap the promise and destructure planId

  const searchParams = useSearchParams();
  const planNameFromSearch = searchParams.get('name');
  
  // Use the unwrapped planId
  const planName = planNameFromSearch || (planId === 'new' ? 'Nuevo Plano' : `Plano ${planId}`);
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-4xl">
        {/* Pass the unwrapped planId */}
        <PlanEditor planId={planId} planName={decodeURIComponent(planName)} />
      </div>
    </div>
  );
}
