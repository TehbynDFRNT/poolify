
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

interface FormActionsProps {
  onSave: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
  isDeleting?: boolean;
  hasExistingData?: boolean;
  saveText?: string;
  deleteText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onDelete,
  isSubmitting,
  isDeleting = false,
  hasExistingData = false,
  saveText = "Save",
  deleteText = "Remove"
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      {hasExistingData && onDelete && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          disabled={isDeleting || isSubmitting}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> 
          {isDeleting ? "Removing..." : deleteText}
        </Button>
      )}
      
      <div className={hasExistingData && onDelete ? "ml-auto" : ""}>
        <Button
          onClick={onSave}
          disabled={isSubmitting}
          variant="default"
          size="sm"
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : saveText}
        </Button>
      </div>
    </div>
  );
};
