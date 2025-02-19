
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { PoolCosts } from "../types";

interface EditableCostCellProps {
  value: number | undefined;
  isEditing: boolean;
  field: keyof PoolCosts;
  onValueChange: (value: string) => void;
}

export const EditableCostCell = ({
  value,
  isEditing,
  onValueChange,
}: EditableCostCellProps) => {
  if (isEditing) {
    return (
      <Input
        type="number"
        value={value || 0}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full"
      />
    );
  }

  return (
    <div className="cursor-pointer p-1 rounded">
      {formatCurrency(value || 0)}
    </div>
  );
};
