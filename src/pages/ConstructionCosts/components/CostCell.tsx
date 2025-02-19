
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";

interface CostCellProps {
  isEditing: boolean;
  value: number;
  onChange: (value: string) => void;
}

export const CostCell = ({ isEditing, value, onChange }: CostCellProps) => {
  return (
    <TableCell>
      {isEditing ? (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-32"
        />
      ) : (
        formatCurrency(value)
      )}
    </TableCell>
  );
};
