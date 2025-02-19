
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PoolCostActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PoolCostActions = ({ isEditing, onEdit, onSave, onCancel }: PoolCostActionsProps) => {
  return (
    <TableCell>
      {isEditing ? (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onEdit}
        >
          Edit
        </Button>
      )}
    </TableCell>
  );
};
