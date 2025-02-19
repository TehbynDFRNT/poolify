
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PoolCostTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap sticky left-0 z-20 bg-background">Range</TableHead>
        <TableHead className="whitespace-nowrap sticky left-[80px] z-20 bg-background">Name</TableHead>
        <TableHead className="whitespace-nowrap">Length</TableHead>
        <TableHead className="whitespace-nowrap">Width</TableHead>
        <TableHead className="whitespace-nowrap">Shallow End</TableHead>
        <TableHead className="whitespace-nowrap">Deep End</TableHead>
        <TableHead className="whitespace-nowrap">Pea Gravel/Backfill</TableHead>
        <TableHead className="whitespace-nowrap">Install Fee</TableHead>
        <TableHead className="whitespace-nowrap">Trucked Water</TableHead>
        <TableHead className="whitespace-nowrap">Salt Bags</TableHead>
        <TableHead className="whitespace-nowrap">Misc.</TableHead>
        <TableHead className="whitespace-nowrap">Coping Supply</TableHead>
        <TableHead className="whitespace-nowrap">Beam</TableHead>
        <TableHead className="whitespace-nowrap">Coping Lay</TableHead>
        <TableHead className="whitespace-nowrap">Dig Type</TableHead>
        <TableHead className="whitespace-nowrap">Excavation</TableHead>
        <TableHead className="whitespace-nowrap">Total</TableHead>
        <TableHead className="whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
