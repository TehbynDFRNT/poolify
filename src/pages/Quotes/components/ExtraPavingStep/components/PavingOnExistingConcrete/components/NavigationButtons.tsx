
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="flex justify-end gap-3 mt-6">
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </Button>
      <Button
        onClick={onSaveAndContinue}
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save & Continue"
        )}
      </Button>
    </div>
  );
};
