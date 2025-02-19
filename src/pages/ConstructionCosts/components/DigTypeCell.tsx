
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ExcavationDigType } from "@/types/excavation-dig-type";

interface DigTypeCellProps {
  digTypes: ExcavationDigType[];
  selectedDigType: string;
  onDigTypeChange: (value: string) => void;
  disabled: boolean;
}

export const DigTypeCell = ({ digTypes, selectedDigType, onDigTypeChange, disabled }: DigTypeCellProps) => {
  return (
    <TableCell>
      <Select
        value={selectedDigType}
        onValueChange={onDigTypeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {digTypes?.map((digType) => (
            <SelectItem key={digType.id} value={digType.id}>
              {digType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
};
