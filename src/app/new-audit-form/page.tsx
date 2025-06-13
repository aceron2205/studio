
import { NewExtinguisherForm } from '@/components/custom/new-audit-form';
import { Toaster } from "@/components/ui/toaster";

export default function NewAuditFormPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-4xl">
        <NewExtinguisherForm />
      </div>
      <Toaster />
    </div>
  );
}
