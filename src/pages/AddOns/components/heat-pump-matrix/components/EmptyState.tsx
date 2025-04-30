
import { TableRow, TableCell } from "@/components/ui/table";

export const EmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-muted-foreground">No heat pump assignments found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use the "Add Missing Pool Matches" button to create assignments for all pools
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};
