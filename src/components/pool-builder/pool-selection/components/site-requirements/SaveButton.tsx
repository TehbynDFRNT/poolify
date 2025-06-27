
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  isSubmitting: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  isSubmitting
}) => {
  return (
    <div className="flex justify-end mt-4">
      <Button 
        onClick={onSave}
        disabled={isSubmitting}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
      >
        <Save className="mr-2 h-5 w-5" />
        {isSubmitting ? "Saving..." : "Save Site Requirements"}
      </Button>
    </div>
  );
};
