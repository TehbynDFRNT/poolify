
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import type { Pool } from "@/types/pool";
import type { DigType } from "@/types/dig-type";

interface PoolDigTypeMatchesTableProps {
  pools?: Pool[];
  digTypes?: DigType[];
  isLoading: boolean;
  editingPoolMatches: Record<string, { digTypeId: string }>;
  getSelectedDigType: (poolId: string) => DigType | undefined;
  onEdit: (poolId: string) => void;
  onSave: (poolId: string) => void;
  onCancel: (poolId: string) => void;
  onDigTypeChange: (poolId: string, digTypeId: string) => void;
}

export const PoolDigTypeMatchesTable = ({
  pools,
  digTypes,
  isLoading,
  editingPoolMatches,
  getSelectedDigType,
  onEdit,
  onSave,
  onCancel,
  onDigTypeChange,
}: PoolDigTypeMatchesTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pool Dig Type Matching</h2>
        <p className="text-sm text-gray-500">Match pools with their appropriate dig types</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pool Range</TableHead>
            <TableHead>Pool Name</TableHead>
            <TableHead>Dig Type</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading pools...
              </TableCell>
            </TableRow>
          ) : pools?.map((pool) => {
            const isEditing = !!editingPoolMatches[pool.id];
            const selectedDigType = getSelectedDigType(pool.id);
            return (
              <TableRow key={pool.id}>
                <TableCell>{pool.range}</TableCell>
                <TableCell>{pool.name}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editingPoolMatches[pool.id]?.digTypeId || ''}
                      onValueChange={(value) => onDigTypeChange(pool.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select dig type" />
                      </SelectTrigger>
                      <SelectContent>
                        {digTypes?.map((digType) => (
                          <SelectItem key={digType.id} value={digType.id}>
                            {digType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="px-3 py-2">
                      {selectedDigType?.name || 'No dig type selected'}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {selectedDigType ? formatCurrency(calculateGrandTotal(selectedDigType)) : '-'}
                </TableCell>
                <TableCell>
                  <PoolTableActions
                    isEditing={isEditing}
                    onEdit={() => onEdit(pool.id)}
                    onSave={() => onSave(pool.id)}
                    onCancel={() => onCancel(pool.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
