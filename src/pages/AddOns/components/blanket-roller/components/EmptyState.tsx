
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Layers } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm = "" }) => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center space-y-1 py-4 text-muted-foreground">
          <Layers className="h-10 w-10 text-muted-foreground/60" />
          <div className="text-sm font-medium">
            {searchTerm ? "No matching items found" : "No blanket & roller items yet"}
          </div>
          <div className="text-xs">
            {searchTerm 
              ? "Try a different search term" 
              : "Add your first blanket & roller item to get started"}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
