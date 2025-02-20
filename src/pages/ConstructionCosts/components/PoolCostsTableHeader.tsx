
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PoolCostsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Range</TableHead>
        <TableHead>Pool Name</TableHead>
        <TableHead>Excavation Cost</TableHead>
        <TableHead>Pea Gravel/Backfill</TableHead>
        <TableHead>Install Fee</TableHead>
        <TableHead>Trucked Water</TableHead>
        <TableHead>Salt Bags</TableHead>
        <TableHead>Misc.</TableHead>
        <TableHead>Coping Supply</TableHead>
        <TableHead>Beam</TableHead>
        <TableHead>Coping Lay</TableHead>
        <TableHead>Total</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
