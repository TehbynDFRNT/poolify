
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
  onRemove?: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  showRemoveButton?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onSave,
  onSaveAndContinue,
  onRemove,
  isSubmitting,
  isDisabled,
  showRemoveButton = false
}) => {
  return (
    <div className="flex justify-between mt-6">
      <div>
        {showRemoveButton && onRemove && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onRemove}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" /> 
            {isSubmitting ? "Removing..." : "Remove"}
          </Button>
        )}
        {!showRemoveButton && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={onSave}
          disabled={isSubmitting || isDisabled}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save All"}
        </Button>
        <Button 
          onClick={onSaveAndContinue}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};
