
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  isEditMode,
  onCancel
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {isEditMode ? "Update" : "Add"} Blanket & Roller
      </Button>
    </DialogFooter>
  );
};
