
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <span className="text-lg font-medium text-muted-foreground">Loading heat pump matrix...</span>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while we retrieve the pool and heat pump data
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};
