
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyPoolBlanketsState = () => {
  return (
    <TableRow>
      <TableCell colSpan={12} className="text-center py-6">
        No pool blankets found. Add your first one!
      </TableCell>
    </TableRow>
  );
};
