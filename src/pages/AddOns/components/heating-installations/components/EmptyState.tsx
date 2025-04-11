
import { TableRow, TableCell } from "@/components/ui/table";

export const EmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-24 text-center">
        No heating installations added yet
      </TableCell>
    </TableRow>
  );
};
