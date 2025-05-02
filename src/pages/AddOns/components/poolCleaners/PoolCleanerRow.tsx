
import { PoolCleaner } from "@/types/pool-cleaner";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { calculateMarginValue } from "@/types/pool-cleaner";

interface PoolCleanerRowProps {
  cleaner: PoolCleaner;
  editingCells: Record<string, boolean>;
  editValues: Record<string, any>;
  onEditStart: (field: string, value: any) => void;
  onEditSave: (field: string) => void;
  onEditCancel: (field: string) => void;
  onEditChange: (field: string, value: any) => void;
  onEditKeyDown: (e: React.KeyboardEvent, field: string) => void;
  onDelete: () => void;
}

export const PoolCleanerRow = ({
  cleaner,
  editingCells,
  editValues,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onEditKeyDown,
  onDelete
}: PoolCleanerRowProps) => {
  const renderEditableCell = (field: string, value: any, type: string = 'text') => {
    const isEditing = editingCells[field];
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type={type}
            value={editValues[field]}
            onChange={(e) => onEditChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
            onKeyDown={(e) => onEditKeyDown(e, field)}
            className="h-8 w-full"
            autoFocus
          />
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" onClick={() => onEditSave(field)} className="h-8 w-8">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onEditCancel(field)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between group">
        <span>{value}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEditStart(field, value)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const marginAmount = calculateMarginValue(cleaner.rrp, cleaner.trade);
  const marginPercent = cleaner.rrp > 0 ? Math.round((marginAmount / cleaner.rrp) * 100) : 0;

  return (
    <TableRow>
      <TableCell className="font-medium">
        {renderEditableCell('model_number', cleaner.model_number || '-')}
      </TableCell>
      <TableCell>
        {renderEditableCell('name', cleaner.name)}
      </TableCell>
      <TableCell className="text-right">
        {renderEditableCell('rrp', formatCurrency(cleaner.rrp), 'number')}
      </TableCell>
      <TableCell className="text-right">
        {renderEditableCell('trade', formatCurrency(cleaner.trade), 'number')}
      </TableCell>
      <TableCell className="text-right">
        {`${marginPercent}%`}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(marginAmount)}
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
