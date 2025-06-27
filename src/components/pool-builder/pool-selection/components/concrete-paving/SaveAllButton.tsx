
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveAllButtonProps {
  onSaveAll: () => void;
  isSubmitting: boolean;
}

export const SaveAllButton: React.FC<SaveAllButtonProps> = ({
  onSaveAll,
  isSubmitting
}) => {
  return (
    <div className="flex justify-end mt-4">
      <Button 
        onClick={onSaveAll}
        disabled={isSubmitting}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
      >
        <Save className="mr-2 h-5 w-5" />
        {isSubmitting ? "Saving..." : "Save All Concrete & Paving"}
      </Button>
    </div>
  );
};
