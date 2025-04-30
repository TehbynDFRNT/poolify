
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const HeatPumpTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>SKU</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className="text-right">Cost</TableHead>
        <TableHead className="text-right">Margin</TableHead>
        <TableHead className="text-right">RRP</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
