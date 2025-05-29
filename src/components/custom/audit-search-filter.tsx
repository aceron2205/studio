
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale/es"; // Import Spanish locale
import { CalendarIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { cn } from "@/lib/utils";

const auditSearchSchema = z.object({
  clientName: z.string().optional(),
  location: z.string().optional(),
  scheduledDate: z.date().optional(),
});

type AuditSearchFormValues = z.infer<typeof auditSearchSchema>;

const mockClients = [
  { id: '1', name: 'Cliente Innovador SA', lastAudit: '2024-07-15', location: 'Parque Tecnológico Norte' },
  { id: '2', name: 'Soluciones Globales Ltda.', lastAudit: '2024-06-20', location: 'Centro Empresarial Metropolitano' },
  { id: '3', name: 'Consultores Asociados', lastAudit: '2024-07-01', location: 'Distrito Financiero Oeste' },
  { id: '4', name: 'Manufacturas Alfa', lastAudit: '2024-05-10', location: 'Polígono Industrial Sur' },
];

export function AuditSearchFilter() {
  const form = useForm<AuditSearchFormValues>({
    resolver: zodResolver(auditSearchSchema),
    defaultValues: {
      clientName: "",
      location: "",
    },
  });

  function onSubmit(data: AuditSearchFormValues) {
    // Placeholder for search logic
    console.log("Search filters applied:", data);
    // Here you would typically call an API or filter data based on these values
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <SearchIcon className="w-6 h-6" />
          Filtrar Auditorías
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="generalSearchInput" className="text-sm font-medium">Búsqueda Rápida</Label>
          <Input
            id="generalSearchInput"
            placeholder="Nombre de cliente, fecha de auditoría, etc..."
            className="mt-1"
          />
        </div>

        <Separator className="my-6" />

        <h3 className="text-lg font-semibold mb-4 text-foreground">Filtros Específicos</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ciudad Principal, Sucursal Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Programada de Auditoría</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
                        }
                        initialFocus
                        locale={es} // Set locale for Calendar
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2"> {/* Added mt-2 for spacing */}
              <SearchIcon className="mr-2 h-4 w-4" />
              Aplicar Filtros Específicos
            </Button>
          </form>
        </Form>

        <div className="mt-10 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-6 text-primary">Clientes Registrados</h3>
          {mockClients.length > 0 ? (
            <ul className="space-y-4">
              {mockClients.map((client) => (
                <li key={client.id} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-md text-card-foreground">{client.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Última Auditoría: {format(new Date(client.lastAudit), "PPP", { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">Ubicación: {client.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">No se encontraron clientes.</p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
