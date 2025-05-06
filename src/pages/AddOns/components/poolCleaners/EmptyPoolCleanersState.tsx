
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyPoolCleanersState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-sm text-muted-foreground mb-2">No pool cleaners found</p>
          <p className="text-xs text-muted-foreground">Add a new pool cleaner to get started</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
