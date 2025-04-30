
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const HeatPumpMatrixHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[15%]">Pool Range</TableHead>
        <TableHead className="w-[15%]">Pool Model</TableHead>
        <TableHead className="w-[15%]">Heat Pump</TableHead>
        <TableHead className="w-[10%]">SKU</TableHead>
        <TableHead className="w-[20%]">Description</TableHead>
        <TableHead className="w-[8%] text-right">Cost</TableHead>
        <TableHead className="w-[8%] text-right">RRP</TableHead>
        <TableHead className="w-[8%] text-right">Margin</TableHead>
        <TableHead className="w-[5%]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
