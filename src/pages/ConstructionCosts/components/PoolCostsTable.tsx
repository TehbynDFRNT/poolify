
import { Table, TableBody } from "@/components/ui/table";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { usePoolCosts } from "../hooks/usePoolCosts";
import { PoolCostTableHeader } from "./PoolCostTableHeader";
import { PoolCostTableRow } from "./PoolCostTableRow";

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
  const poolCosts = usePoolCosts(initialPoolCosts);

  return (
    <Table>
      <PoolCostTableHeader />
      <TableBody>
        {pools?.map((pool) => {
          const fixedName = pool.name.replace("Westminister", "Westminster");
          const isEditing = poolCosts.editingRow === fixedName;
          const currentCosts = isEditing ? poolCosts.editedCosts[fixedName] : poolCosts.costs[pool.id] || {
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
            <PoolCostTableRow
              key={pool.id}
              pool={pool}
              isEditing={isEditing}
              currentCosts={currentCosts}
              digTypes={digTypes}
              selectedDigTypes={selectedDigTypes}
              onDigTypeChange={onDigTypeChange}
              getExcavationCost={getExcavationCost}
              onEdit={() => poolCosts.handleEdit(fixedName)}
              onSave={() => poolCosts.handleSave(pool.id, fixedName)}
              onCancel={poolCosts.handleCancel}
              onCostChange={(field, value) => poolCosts.handleCostChange(fixedName, field, value)}
              calculateTotal={() => poolCosts.calculateTotal(pool.id) + (getExcavationCost(pool.id) || 0)}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};
