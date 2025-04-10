
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  submitLabel?: string;
  loadingLabel?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting,
  label = "Save Fencing Configuration",
  submitLabel,
  loadingLabel = "Saving..."
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? loadingLabel : (submitLabel || label)}
      </Button>
    </div>
  );
};

export default SubmitButton;
