
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PoolCleanersTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[15%]">Model #</TableHead>
        <TableHead className="w-[25%]">Name</TableHead>
        <TableHead className="w-[12%] text-right">RRP</TableHead>
        <TableHead className="w-[12%] text-right">Cost Price</TableHead>
        <TableHead className="w-[12%] text-right">Margin %</TableHead>
        <TableHead className="w-[12%] text-right">Margin $</TableHead>
        <TableHead className="w-[12%]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
