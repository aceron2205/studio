
import { PlanCreator } from '@/components/custom/plan-creator';

export default function CreatePlanPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <div className="w-full max-w-3xl">
        <PlanCreator />
      </div>
    </div>
  );
}
