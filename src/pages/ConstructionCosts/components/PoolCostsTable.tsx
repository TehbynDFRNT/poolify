
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";

interface PoolCostsTableProps {
  pools: Pool[];
  digTypes: ExcavationDigType[];
  selectedDigTypes: Record<string, string>;
  onDigTypeChange: (poolId: string, value: string) => void;
  getExcavationCost: (poolId: string) => number | null;
  initialPoolCosts: Record<string, PoolCosts>;
}

export const PoolCostsTable = ({
  pools,
  digTypes,
  selectedDigTypes,
  onDigTypeChange,
  getExcavationCost,
  initialPoolCosts,
}: PoolCostsTableProps) => {
  return (
    <Table>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const costs = initialPoolCosts[pool.name.replace("Westminister", "Westminster")] || {
            truckedWater: 0,
            saltBags: 0,
            misc: 2700,
            copingSupply: 0,
            beam: 0,
            copingLay: 0,
            peaGravel: 0,
            installFee: 0
          };
          
          return (
            <TableRow key={pool.id}>
              <TableCell className="sticky left-0 z-20 bg-background">{pool.range}</TableCell>
              <TableCell className="sticky left-[80px] z-20 bg-background">
                {pool.name.replace("Westminister", "Westminster")}
              </TableCell>
              <TableCell>{pool.length}m</TableCell>
              <TableCell>{pool.width}m</TableCell>
              <TableCell>{pool.depth_shallow}m</TableCell>
              <TableCell>{pool.depth_deep}m</TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.peaGravel}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.installFee}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.truckedWater}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.saltBags}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.misc}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.copingSupply}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.beam}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  className="w-32"
                  defaultValue={costs.copingLay}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={selectedDigTypes[pool.id]}
                  onValueChange={(value) => onDigTypeChange(pool.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {digTypes?.map((digType) => (
                      <SelectItem key={digType.id} value={digType.id}>
                        {digType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {getExcavationCost(pool.id) ? 
                  formatCurrency(getExcavationCost(pool.id)!) :
                  "-"
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
