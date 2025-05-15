
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComponentsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Model Number</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Type</TableHead>
        <TableHead className="text-right">Price (ex GST)</TableHead>
        <TableHead className="text-right">Price (inc GST)</TableHead>
      </TableRow>
    </TableHeader>
  );
}
