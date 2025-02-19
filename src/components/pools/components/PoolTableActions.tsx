
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PoolTableActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const PoolTableActions: React.FC<PoolTableActionsProps> = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
}) => {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="ghost" onClick={onEdit}>
      Edit
    </Button>
  );
};
