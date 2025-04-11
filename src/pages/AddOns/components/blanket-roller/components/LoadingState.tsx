
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <div className="text-sm text-muted-foreground">Loading blanket & roller data...</div>
        </div>
      </TableCell>
    </TableRow>
  );
};
