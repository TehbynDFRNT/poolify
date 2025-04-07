
import React from "react";
import { Button } from "@/components/ui/button";

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
      className="mt-4"
    >
      {isSubmitting ? "Saving..." : "Save Pool Selection"}
    </Button>
  );
};
