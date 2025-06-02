
import { InventoryTable } from "@/components/custom/inventory-table";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Archive } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-8 md:pt-12">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="relative p-6 border-b">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Volver al Inicio"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:left-6"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="w-full text-center">
              <CardTitle className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
                <Archive className="h-6 w-6" />
                Inventario de Repuestos
              </CardTitle>
              <CardDescription className="mt-1">
                Listado de artículos y repuestos para mantenimiento de extintores.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <InventoryTable />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
