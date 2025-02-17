
import { type ExcavationDigType } from "@/types/excavation-dig-type";
import { type PoolExcavationType } from "@/types/pool-excavation-type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { calculateDigTypeCost } from "@/utils/calculations";

interface PoolExcavationTableProps {
  pools: PoolExcavationType[];
  digTypes: ExcavationDigType[];
}

export const PoolExcavationTable = ({ pools, digTypes }: PoolExcavationTableProps) => {
  return (
    <div className="space-y-8">
      {Object.entries(groupPoolsByRange(pools)).map(([range, rangePools]) => (
        <div key={range} className="space-y-4">
          <h3 className="text-lg font-semibold">{range}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Name</TableHead>
                <TableHead>Dig Type</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rangePools.map((pool) => {
                const digType = digTypes?.find(dt => dt.id === pool.dig_type_id);
                return (
                  <TableRow key={pool.id}>
                    <TableCell>{pool.name}</TableCell>
                    <TableCell>{pool.dig_type?.name}</TableCell>
                    <TableCell className="font-semibold">
                      {digType ? formatCurrency(calculateDigTypeCost(digType)) : 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

const groupPoolsByRange = (pools: PoolExcavationType[]) => {
  return pools?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, PoolExcavationType[]>) ?? {};
};
