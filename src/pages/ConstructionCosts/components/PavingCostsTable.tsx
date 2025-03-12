
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
import { PavingCostRow } from "./PavingCostRow";
import { PavingTableLoadingRows } from "./PavingTableLoadingRows";
import { PavingTotalRow } from "./PavingTotalRow";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[] | null;
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<PavingCost>) => Promise<void>;
}

export const PavingCostsTable: React.FC<PavingCostsTableProps> = ({ 
  pavingCosts, 
  isLoading,
  onUpdate 
}) => {
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <PavingTableLoadingRows />
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
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pavingCosts.map((cost) => (
            <PavingCostRow 
              key={cost.id} 
              cost={cost} 
              onUpdate={onUpdate} 
            />
          ))}
          <PavingTotalRow totals={totals} />
        </TableBody>
      </Table>
    </div>
  );
};
