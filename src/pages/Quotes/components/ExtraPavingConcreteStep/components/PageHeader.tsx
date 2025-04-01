
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface PageHeaderProps {
  hasUnsavedChanges: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ hasUnsavedChanges }) => {
  return (
    <div className="flex items-center justify-end">
      {hasUnsavedChanges && (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 px-3 py-1">
          <AlertCircle className="h-4 w-4" />
          Unsaved changes
        </Badge>
      )}
    </div>
  );
};
