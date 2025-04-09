
import React from "react";
import { Button } from "@/components/ui/button";
import { SaveAll } from "lucide-react";

interface SaveAllButtonProps {
  onSaveAll: () => void;
  isSubmitting: boolean;
  className?: string;
}

export const SaveAllButton: React.FC<SaveAllButtonProps> = ({
  onSaveAll,
  isSubmitting,
  className = ""
}) => {
  return (
    <Button
      onClick={onSaveAll}
      disabled={isSubmitting}
      variant="default"
      className={`flex items-center gap-2 ${className}`}
    >
      <SaveAll className="h-4 w-4" />
      {isSubmitting ? "Saving..." : "Save All"}
    </Button>
  );
};
