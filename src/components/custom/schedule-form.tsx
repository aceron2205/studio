// src/components/custom/ScheduleAuditForm.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, isDate } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, MessageSquare, Save, XCircle, Building as BuildingIcon } from "lucide-react"; // Added BuildingIcon
import { es } from 'date-fns/locale/es'; // Using NAMED import for locale as per date-fns module structure

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// NEW IMPORTS for Select dropdowns
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// NEW IMPORTS for mock data
import { mockClients, Client } from "@/mocks/extinguisherMocks"; // Import mockClients and Client interface


// 1. Define the Zod Schema for form validation
const formSchema = z.object({
  clientId: z.string().min(1, "El cliente es requerido."), // NEW: Client ID dropdown
  buildingId: z.string().min(1, "El edificio es requerido."), // NEW: Building ID dropdown
  auditDate: z.date({
    required_error: "La fecha de auditoría es requerida.",
  }),
  auditTime: z.string().min(1, "La hora de auditoría es requerida."),
  assignedTechnician: z.string().optional(),
  notes: z.string().optional(),
});

// Define the type for the form data
export type ScheduleAuditFormData = z.infer<typeof formSchema>;

interface ScheduleAuditFormProps {
  buildingName?: string; // Optional: Pass the building name if scheduling for a specific building (for header)
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSchedule: (data: ScheduleAuditFormData, buildingName?: string) => void; // buildingName is from prop, not form data
}


/**
 * A component to schedule audits. It provides a form for date, time,
 * technician, and notes. This component is now a full Dialog.
 */
export const ScheduleAuditForm: React.FC<ScheduleAuditFormProps> = ({
  buildingName,
  isOpen,
  onOpenChange,
  onSchedule,
}) => {
  const form = useForm<ScheduleAuditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "", // Initialize new fields
      buildingId: "", // Initialize new fields
      auditDate: undefined,
      auditTime: "",
      assignedTechnician: "",
      notes: "",
    },
  });

  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = React.useState(false);

  // Watch selected client to dynamically populate buildings
  const selectedClientId = form.watch("clientId");

  // Dynamically get building options based on selected client
  const buildingOptions = React.useMemo(() => {
    if (!selectedClientId) return [];
    const client = mockClients.find(c => c.id === selectedClientId);
    if (!client || !client['extinguisher-plan']) return [];

    // Extract unique building names from the client's extinguisher plan
    const uniqueBuildings = new Set<string>();
    client['extinguisher-plan'].forEach(ext => {
      if (ext.edificio && ext.edificio.trim() !== '') {
        uniqueBuildings.add(ext.edificio);
      } else {
        uniqueBuildings.add("Sin Edificio Asignado"); // Handle extinguishers without a building name
      }
    });
    return Array.from(uniqueBuildings).sort();
  }, [selectedClientId, mockClients]); // Depend on selectedClientId and mockClients


  // Handle form submission
  const onSubmit = (data: ScheduleAuditFormData) => {
    console.log("Scheduling audit:", data);
    // Call the parent's onSchedule callback, passing the original buildingName prop
    // and the new form data including clientId and buildingId
    onSchedule(data, buildingName);

    toast({
      title: "Auditoría Agendada",
      description: `Auditoría programada para ${data.clientId} - ${data.buildingId} el ${format(data.auditDate, "PPP", { locale: es })} a las ${data.auditTime}.`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Programar Auditoría
          </DialogTitle>
          {buildingName && (
            <DialogDescription className="text-lg font-medium text-gray-600 text-center">
              para {buildingName}
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Client Dropdown */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset buildingId when client changes to avoid invalid selection
                      form.setValue("buildingId", ""); 
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Building Dropdown */}
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edificio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedClientId || buildingOptions.length === 0} // Disable if no client selected or no buildings
                  >
                    <FormControl>
                      <SelectTrigger>
                        <BuildingIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder={selectedClientId ? "Seleccionar edificio" : "Seleccione un cliente primero"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildingOptions.map((buildingName) => (
                        <SelectItem key={buildingName} value={buildingName}>
                          {buildingName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Audit Date Field */}
            <FormField
              control={form.control}
              name="auditDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Auditoría</FormLabel>
                  <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
                    <DialogTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 " />
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </FormControl>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-0">
                      <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Seleccionar Fecha</DialogTitle>
                        <DialogDescription>
                          Elige la fecha para la auditoría.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center p-4">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (isDate(date)) {
                              field.onChange(date);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          initialFocus
                          locale={es}
                        />
                      </div>
                      <DialogFooter className="p-4 pt-0">
                        <Button type="button" onClick={() => setIsCalendarDialogOpen(false)} className="w-full">Confirmar Fecha</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Audit Time Field */}
            <FormField
              control={form.control}
              name="auditTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Auditoría</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Ej: 10:00 AM, 14:30"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Notes Field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Textarea
                        placeholder="Cualquier detalle relevante..."
                        className="min-h-[80px] pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Agendar Auditoría
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
