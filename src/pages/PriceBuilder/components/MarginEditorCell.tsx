
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";

interface MarginEditorCellProps {
  poolId: string;
  margin: number;
  isEditing: boolean;
  tempMargin: string;
  onStartEdit: (poolId: string) => void;
  onSave: (poolId: string) => void;
  onCancel: () => void;
  onTempMarginChange: (value: string) => void;
}

export const MarginEditorCell = ({
  poolId,
  margin,
  isEditing,
  tempMargin,
  onStartEdit,
  onSave,
  onCancel,
  onTempMarginChange,
}: MarginEditorCellProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Input
          type="number"
          value={tempMargin}
          onChange={(e) => onTempMarginChange(e.target.value)}
          className="w-24 text-right"
          min={0}
          max={99.9}
          step={0.1}
        />
        <Button size="sm" variant="ghost" onClick={() => onSave(poolId)}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-end gap-2 group"
      onClick={() => onStartEdit(poolId)}
    >
      {margin?.toFixed(1) || '0.0'}%
      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
    </div>
  );
};
