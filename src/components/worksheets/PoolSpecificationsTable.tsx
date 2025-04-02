
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Pool } from "@/types/pool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PoolSpecificationsTable() {
  // Using the existing hook that properly sorts by range order
  const { data: pools, isLoading, error } = usePoolSpecifications();

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading pool specifications...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Error loading pool specifications</div>;
  }

  if (!pools || pools.length === 0) {
    return (
      <div className="text-center p-16 border border-dashed rounded-md">
        <p className="text-muted-foreground">No pool specifications available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Range</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Length (m)</TableHead>
            <TableHead className="text-right">Width (m)</TableHead>
            <TableHead className="text-right">Depth - Shallow (m)</TableHead>
            <TableHead className="text-right">Depth - Deep (m)</TableHead>
            <TableHead className="text-right">Volume (L)</TableHead>
            <TableHead className="text-right">Waterline (L/m)</TableHead>
            <TableHead className="text-right">Weight (kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell>{pool.range}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell className="text-right">{pool.length}</TableCell>
              <TableCell className="text-right">{pool.width}</TableCell>
              <TableCell className="text-right">{pool.depth_shallow}</TableCell>
              <TableCell className="text-right">{pool.depth_deep}</TableCell>
              <TableCell className="text-right">{pool.volume_liters ? pool.volume_liters.toLocaleString() : '-'}</TableCell>
              <TableCell className="text-right">{pool.waterline_l_m || '-'}</TableCell>
              <TableCell className="text-right">{pool.weight_kg ? pool.weight_kg.toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
