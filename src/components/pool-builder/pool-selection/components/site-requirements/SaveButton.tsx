
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  isSubmitting: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  isSubmitting
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave}
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : "Save Site Requirements"}
      </Button>
    </div>
  );
};
