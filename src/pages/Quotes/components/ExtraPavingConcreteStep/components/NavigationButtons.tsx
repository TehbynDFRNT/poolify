
import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const NavigationButtons = ({
  onPrevious,
  onSave,
  onSaveAndContinue,
  isSubmitting,
  isDisabled
}: NavigationButtonsProps) => {
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
        >
          {isSubmitting ? "Saving..." : "Save"}
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
