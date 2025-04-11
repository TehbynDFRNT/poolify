
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  searchTerm: string;
}

export const EmptyState = ({ searchTerm }: EmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-24 text-center">
        {searchTerm ? "No matching heat pump products found" : "No heat pump products added yet"}
      </TableCell>
    </TableRow>
  );
};

import { TableRow, TableCell } from "@/components/ui/table";
