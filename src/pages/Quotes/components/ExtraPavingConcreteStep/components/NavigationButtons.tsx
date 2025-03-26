
import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const NavigationButtons = ({
  onPrevious,
  onSave,
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
      <Button 
        onClick={onSave}
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? "Saving..." : "Next"}
      </Button>
    </div>
  );
};
