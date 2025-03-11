
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyPoolCleanersState = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6">
        No pool cleaners found. Add your first one!
      </TableCell>
    </TableRow>
  );
};
