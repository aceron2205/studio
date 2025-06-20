"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Assuming you have a Progress component


interface ProcessHeaderProps {
  title: string;
  currentStep?: number;
  totalSteps?: number;
}

const ProcessHeader: React.FC<ProcessHeaderProps> = ({ title, currentStep, totalSteps }) => {
  const router = useRouter();

  const progressPercentage = (currentStep && totalSteps) ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full bg-red-600 text-white flex flex-col gap-2 sticky top-0 z-10 shadow-md">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-red-700/50 text-white">
          <ArrowLeft className="h-6 w-6" />
 </Button>
        <h1 className="text-xl font-semibold flex-grow">{title}</h1>
      </div>
      {(currentStep !== undefined && totalSteps !== undefined) && (
        <Progress
            value={progressPercentage} 
            className="w-full h-2 bg-red-700" 
          />
      )}
    </div>
  );
};

export default ProcessHeader;