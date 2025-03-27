
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FormActionsProps {
  onSave: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasExistingData: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onDelete,
  isSubmitting,
  isDeleting,
  hasExistingData,
}) => {
  return (
    <div className="flex justify-between">
      {hasExistingData && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> 
          {isDeleting ? "Removing..." : "Remove"}
        </Button>
      )}
      
      <div className="ml-auto">
        <Button
          onClick={onSave}
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
