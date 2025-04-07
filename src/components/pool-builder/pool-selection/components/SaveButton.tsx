
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isSubmitting, 
  disabled 
}) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isSubmitting || disabled}
      className="mt-4 w-full sm:w-auto"
      size="lg"
      variant="primary"
    >
      {isSubmitting ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Pool Selection
        </>
      )}
    </Button>
  );
};
