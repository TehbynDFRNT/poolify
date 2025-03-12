
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PoolBlanketsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[180px]">Range / Model</TableHead>
        <TableHead className="w-[100px]">SKU</TableHead>
        <TableHead>Blanket Description</TableHead>
        <TableHead className="text-right">RRP ($)</TableHead>
        <TableHead className="text-right">Trade ($)</TableHead>
        <TableHead className="text-right">Margin ($)</TableHead>
        <TableHead className="w-[100px]">Heat Pump SKU</TableHead>
        <TableHead>Heat Pump Description</TableHead>
        <TableHead className="text-right">RRP ($)</TableHead>
        <TableHead className="text-right">Trade ($)</TableHead>
        <TableHead className="text-right">Margin ($)</TableHead>
        <TableHead className="w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
