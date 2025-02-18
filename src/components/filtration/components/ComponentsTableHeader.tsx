
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComponentsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Model Number</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Type</TableHead>
        <TableHead className="text-right">Flow Rate</TableHead>
        <TableHead className="text-right">Power Usage</TableHead>
        <TableHead className="text-right">Price</TableHead>
      </TableRow>
    </TableHeader>
  );
}
