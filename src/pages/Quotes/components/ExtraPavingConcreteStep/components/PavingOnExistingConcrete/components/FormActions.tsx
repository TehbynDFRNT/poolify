
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

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
    <div className="flex justify-between mt-6">
      {hasExistingData && (
        <Button 
          variant="outline"
          onClick={onDelete}
          disabled={isSubmitting || isDeleting}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Removing..." : "Remove"}
        </Button>
      )}
      
      <div className={hasExistingData ? "ml-auto" : ""}>
        <Button
          onClick={onSave}
          disabled={isSubmitting || isDeleting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : hasExistingData ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};
