
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PavingCost } from "@/types/paving-cost";
import { formatCurrency } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[] | null;
  isLoading: boolean;
  onUpdate: (id: string, field: string, value: number) => Promise<void>;
}

export const PavingCostsTable: React.FC<PavingCostsTableProps> = ({ 
  pavingCosts, 
  isLoading,
  onUpdate 
}) => {
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  if (isLoading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Paving</TableHead>
              <TableHead>Category 1</TableHead>
              <TableHead>Category 2</TableHead>
              <TableHead>Category 3</TableHead>
              <TableHead>Category 4</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Cat Total</TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!pavingCosts || pavingCosts.length === 0) {
    return <div>No paving costs available</div>;
  }

  // Calculate totals for each category
  const totals = pavingCosts.reduce(
    (acc, cost) => {
      return {
        category1: acc.category1 + cost.category1,
        category2: acc.category2 + cost.category2,
        category3: acc.category3 + cost.category3,
        category4: acc.category4 + cost.category4,
      };
    },
    { category1: 0, category2: 0, category3: 0, category4: 0 }
  );

  const handleCellClick = (id: string, field: string, currentValue: number) => {
    setEditingCell({ id, field });
    setEditValue(currentValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = async () => {
    if (editingCell) {
      const { id, field } = editingCell;
      const numValue = parseFloat(editValue);
      
      if (!isNaN(numValue)) {
        try {
          await onUpdate(id, field, numValue);
          toast.success("Updated successfully");
        } catch (error) {
          console.error("Failed to update value:", error);
          toast.error("Failed to update value");
        }
      }
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const renderCell = (cost: PavingCost, field: string) => {
    const value = cost[field as keyof PavingCost] as number;
    const isEditing = editingCell?.id === cost.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <Input
          type="number"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-24 h-8"
          autoFocus
        />
      );
    }

    return (
      <div 
        className="cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded"
        onClick={() => handleCellClick(cost.id, field, value)}
      >
        {formatCurrency(value)}
      </div>
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Paving</TableHead>
            <TableHead>Category 1</TableHead>
            <TableHead>Category 2</TableHead>
            <TableHead>Category 3</TableHead>
            <TableHead>Category 4</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pavingCosts.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell>{renderCell(cost, 'category1')}</TableCell>
              <TableCell>{renderCell(cost, 'category2')}</TableCell>
              <TableCell>{renderCell(cost, 'category3')}</TableCell>
              <TableCell>{renderCell(cost, 'category4')}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-semibold bg-muted/50">
            <TableCell>Cat Total</TableCell>
            <TableCell>{formatCurrency(totals.category1)}</TableCell>
            <TableCell>{formatCurrency(totals.category2)}</TableCell>
            <TableCell>{formatCurrency(totals.category3)}</TableCell>
            <TableCell>{formatCurrency(totals.category4)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
