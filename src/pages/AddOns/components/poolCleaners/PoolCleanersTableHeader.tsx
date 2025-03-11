
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PoolCleanersTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Model Number</TableHead>
        <TableHead>Name</TableHead>
        <TableHead className="text-right">RRP ($)</TableHead>
        <TableHead className="text-right">Cost Price ($)</TableHead>
        <TableHead className="text-right">Margin (%)</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
