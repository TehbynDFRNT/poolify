
import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onSave: () => void;
  onSaveAndContinue: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const NavigationButtons = ({
  onSave,
  onSaveAndContinue,
  isSubmitting,
  isDisabled
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-end mt-6 gap-3">
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
        className="bg-teal-500 hover:bg-teal-600"
      >
        {isSubmitting ? "Saving..." : "Save & Continue"}
      </Button>
    </div>
  );
};
