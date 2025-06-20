
import { AssignedPlansViewer } from '@/components/custom/assigned-plans-viewer';
import { Toaster } from "@/components/ui/toaster";

export default function ViewPlansPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <AssignedPlansViewer key={Date.now()} />
      <Toaster />
    </div>
  );
}
