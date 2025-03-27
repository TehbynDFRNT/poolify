
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash } from 'lucide-react';

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
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        onClick={onDelete}
        disabled={isSubmitting || isDeleting || !hasExistingData}
        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      >
        <Trash className="h-4 w-4" />
        {isDeleting ? "Removing..." : "Remove"}
      </Button>
      
      <Button
        onClick={onSave}
        disabled={isSubmitting || isDeleting}
        className="flex items-center gap-1.5"
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? "Saving..." : hasExistingData ? "Update" : "Save"}
      </Button>
    </div>
  );
};
