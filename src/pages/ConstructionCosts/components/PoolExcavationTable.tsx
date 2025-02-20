
import { useState } from "react";
import { type PoolExcavationType, type ExcavationDigType } from "@/types/excavation-dig-type";
import { Button } from "@/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";

interface PoolExcavationTableProps {
  pools: PoolExcavationType[];
  digTypes: ExcavationDigType[];
}

export const PoolExcavationTable = ({ pools, digTypes }: PoolExcavationTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const calculateDigCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  const handleDigTypeChange = async (poolId: string, newDigTypeId: string) => {
    try {
      const { error } = await supabase
        .from("pool_excavation_types")
        .update({ dig_type_id: newDigTypeId })
        .eq("id", poolId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dig type updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["pool-excavation-types"] });
      setEditingId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Group pools by range (case-insensitive)
  const groupedPools = pools.reduce((acc, pool) => {
    const normalizedRange = pool.range.toLowerCase();
    if (!acc[normalizedRange]) {
      acc[normalizedRange] = [];
    }
    acc[normalizedRange].push(pool);
    return acc;
  }, {} as Record<string, PoolExcavationType[]>);

  // Sort ranges and create a flat list of pools
  const sortedPools = Object.entries(groupedPools)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([range, poolGroup]) => poolGroup);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead>Dig Type</TableHead>
          <TableHead>Dig Cost</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPools.map((pool) => (
          <TableRow key={pool.id} className="hover:bg-gray-50">
            <TableCell className="capitalize">{pool.range.toLowerCase()}</TableCell>
            <TableCell>{pool.name}</TableCell>
            <TableCell>
              {editingId === pool.id ? (
                <Select
                  defaultValue={pool.dig_type_id}
                  onValueChange={(value) => handleDigTypeChange(pool.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {digTypes.map((digType) => (
                      <SelectItem key={digType.id} value={digType.id}>
                        {digType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                pool.dig_type?.name
              )}
            </TableCell>
            <TableCell className="font-medium">
              {pool.dig_type && formatCurrency(calculateDigCost(pool.dig_type))}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingId(editingId === pool.id ? null : pool.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
