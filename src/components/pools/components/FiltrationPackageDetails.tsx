
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { FiltrationPackageResponse } from "@/types/pool";

interface FiltrationPackageDetailsProps {
  package: FiltrationPackageResponse;
  colSpan: number;
}

export const FiltrationPackageDetails = ({ package: pkg, colSpan }: FiltrationPackageDetailsProps) => {
  return (
    <TableRow className="bg-muted/50">
      <TableCell colSpan={colSpan}>
        <div className="p-2 text-sm space-y-2">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <span className="font-medium">Light</span>
              <div className="mt-1 text-muted-foreground">
                {pkg.light?.model_number || 'None'}
              </div>
            </div>
            <div>
              <span className="font-medium">Pool Pump</span>
              <div className="mt-1 text-muted-foreground">
                {pkg.pump?.model_number || 'None'}
              </div>
            </div>
            <div>
              <span className="font-medium">Sanitiser</span>
              <div className="mt-1 text-muted-foreground">
                {pkg.sanitiser?.model_number || 'None'}
              </div>
            </div>
            <div>
              <span className="font-medium">Filter</span>
              <div className="mt-1 text-muted-foreground">
                {pkg.filter?.model_number || 'None'}
              </div>
            </div>
            <div>
              <span className="font-medium">Handover Kit</span>
              <div className="mt-1 text-muted-foreground">
                {pkg.handover_kit?.name || 'None'}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
