
import React from "react";
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
import { EditableCell } from "./EditableCell";
import { Skeleton } from "@/components/ui/skeleton";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[] | null;
  isLoading?: boolean;
  onUpdateCost?: (id: string, field: string, value: number) => void;
}

export const PavingCostsTable: React.FC<PavingCostsTableProps> = ({ 
  pavingCosts, 
  isLoading = false, 
  onUpdateCost
}) => {
  // Calculate totals for each category
  const totals = pavingCosts?.reduce(
    (acc, cost) => {
      return {
        category1: acc.category1 + cost.category1,
        category2: acc.category2 + cost.category2,
        category3: acc.category3 + cost.category3,
        category4: acc.category4 + cost.category4,
      };
    },
    { category1: 0, category2: 0, category3: 0, category4: 0 }
  ) || { category1: 0, category2: 0, category3: 0, category4: 0 };

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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

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
          {pavingCosts?.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.name}</TableCell>
              <TableCell>
                {onUpdateCost ? (
                  <EditableCell 
                    value={cost.category1} 
                    onSave={(value) => onUpdateCost(cost.id, "category1", value)} 
                  />
                ) : (
                  formatCurrency(cost.category1)
                )}
              </TableCell>
              <TableCell>
                {onUpdateCost ? (
                  <EditableCell 
                    value={cost.category2} 
                    onSave={(value) => onUpdateCost(cost.id, "category2", value)} 
                  />
                ) : (
                  formatCurrency(cost.category2)
                )}
              </TableCell>
              <TableCell>
                {onUpdateCost ? (
                  <EditableCell 
                    value={cost.category3} 
                    onSave={(value) => onUpdateCost(cost.id, "category3", value)} 
                  />
                ) : (
                  formatCurrency(cost.category3)
                )}
              </TableCell>
              <TableCell>
                {onUpdateCost ? (
                  <EditableCell 
                    value={cost.category4} 
                    onSave={(value) => onUpdateCost(cost.id, "category4", value)} 
                  />
                ) : (
                  formatCurrency(cost.category4)
                )}
              </TableCell>
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
