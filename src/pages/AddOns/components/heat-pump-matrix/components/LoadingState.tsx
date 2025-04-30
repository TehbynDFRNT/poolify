
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center">
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
          <span>Loading heat pump matrix...</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
