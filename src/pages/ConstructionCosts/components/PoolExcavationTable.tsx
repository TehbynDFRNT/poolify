
import { type PoolExcavationType } from "@/types/excavation-dig-type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PoolExcavationTableProps {
  pools: PoolExcavationType[];
}

export const PoolExcavationTable = ({ pools }: PoolExcavationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead>Dig Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => (
          <TableRow key={pool.id} className="hover:bg-gray-50">
            <TableCell>{pool.range}</TableCell>
            <TableCell>{pool.name}</TableCell>
            <TableCell>{pool.dig_type?.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
