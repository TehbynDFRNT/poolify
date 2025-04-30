
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { HeatPumpTableRow } from "./HeatPumpTableRow";
import { EmptyState } from "./EmptyState";

interface HeatPumpTableProps {
  products: HeatPumpProduct[];
  searchTerm: string;
  onEdit: (product: HeatPumpProduct) => void;
  onDelete: (product: HeatPumpProduct) => void;
  onManageCompatibility: (product: HeatPumpProduct) => void;
  poolCompatibilities?: Record<string, { pool_range: string; pool_model: string }[]>;
}

export const HeatPumpTable: React.FC<HeatPumpTableProps> = ({
  products,
  searchTerm,
  onEdit,
  onDelete,
  onManageCompatibility,
  poolCompatibilities = {}
}) => {
  if (products.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Compatible Pools</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="text-right">RRP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <HeatPumpTableRow
                key={product.id}
                product={product}
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product)}
                onManageCompatibility={() => onManageCompatibility(product)}
                compatiblePools={poolCompatibilities[product.id] || []}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
