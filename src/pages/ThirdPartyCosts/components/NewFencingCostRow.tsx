
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { FencingCost, FENCE_CATEGORIES, FENCE_TYPES, FenceCategory, FenceType } from "../types/fencing";

interface NewFencingCostRowProps {
  newCost: Partial<FencingCost>;
  onNewCostChange: (updates: Partial<FencingCost>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NewFencingCostRow = ({ 
  newCost, 
  onNewCostChange, 
  onSave, 
  onCancel 
}: NewFencingCostRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Input
          value={newCost.item}
          onChange={(e) => onNewCostChange({ item: e.target.value })}
          placeholder="Enter item name"
        />
      </TableCell>
      <TableCell>
        <Select 
          value={newCost.category} 
          onValueChange={(value: FenceCategory) => onNewCostChange({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {FENCE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select 
          value={newCost.type} 
          onValueChange={(value: FenceType) => onNewCostChange({ type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {FENCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={newCost.unit_price}
          onChange={(e) => onNewCostChange({ unit_price: parseFloat(e.target.value) })}
          placeholder="Enter unit price"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave}>Save</Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
