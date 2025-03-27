
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

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
  hasExistingData
}) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      {hasExistingData && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isSubmitting || isDeleting}
          className="flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {isDeleting ? "Removing..." : "Remove"}
        </Button>
      )}
      
      <Button
        variant="default"
        size="sm"
        onClick={onSave}
        disabled={isSubmitting || isDeleting}
        className="flex items-center"
      >
        <Save className="w-4 h-4 mr-1" />
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};
