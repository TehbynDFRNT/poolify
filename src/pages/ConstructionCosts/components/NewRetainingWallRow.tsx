
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { RetainingWall } from "@/types/retaining-wall";

interface NewRetainingWallRowProps {
  newCost: Partial<RetainingWall>;
  onNewCostChange: (updates: Partial<RetainingWall>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NewRetainingWallRow = ({ 
  newCost, 
  onNewCostChange, 
  onSave, 
  onCancel 
}: NewRetainingWallRowProps) => {
  const handleRateChange = (value: string) => {
    const rate = parseFloat(value);
    onNewCostChange({ 
      rate,
      total: rate + (newCost.extra_rate || 0) + (newCost.margin || 0)
    });
  };

  const handleExtraRateChange = (value: string) => {
    const extraRate = parseFloat(value);
    onNewCostChange({ 
      extra_rate: extraRate,
      total: (newCost.rate || 0) + extraRate + (newCost.margin || 0)
    });
  };

  const handleMarginChange = (value: string) => {
    const margin = parseFloat(value);
    onNewCostChange({ 
      margin,
      total: (newCost.rate || 0) + (newCost.extra_rate || 0) + margin
    });
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          value={newCost.type}
          onChange={(e) => onNewCostChange({ type: e.target.value })}
          placeholder="Enter wall type"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={newCost.rate}
          onChange={(e) => handleRateChange(e.target.value)}
          placeholder="Enter rate"
          className="text-right"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={newCost.extra_rate}
          onChange={(e) => handleExtraRateChange(e.target.value)}
          placeholder="Enter extra rate"
          className="text-right"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={newCost.margin}
          onChange={(e) => handleMarginChange(e.target.value)}
          placeholder="Enter margin"
          className="text-right"
        />
      </TableCell>
      <TableCell className="text-right">
        {newCost.total || 0}
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
