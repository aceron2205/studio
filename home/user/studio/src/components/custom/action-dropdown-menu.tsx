typescriptreact
import * as React from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Column } from "@tanstack/react-table"; // Import Column type
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  edifId?: string; // Add buildingId prop
}

export function DataTableViewOptions<TData>({
  table,
  edifId, // Destructure buildingId
}: DataTableViewOptionsProps<TData>) {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column: Column<TData, unknown>) => // Add type annotation
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column: Column<TData, unknown>) => { // Add type annotation
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        {/* Add the "Auditar" option */}
        <DropdownMenuCheckboxItem
          className="capitalize"
          onClick={() => {
            if (edifId) {
              navigate(`/view-plans/${edifId}`); // Navigate to view-plans with buildingId
            } else {
              // Handle case where buildingId is not available (optional)
              console.warn("Building ID is not available for navigation.");
            }
          }}
        >
          Auditar
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}