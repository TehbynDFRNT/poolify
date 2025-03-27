
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onSave,
  onSaveAndContinue,
  isSubmitting,
  isDisabled
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isSubmitting}
      >
        Previous
      </Button>
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
