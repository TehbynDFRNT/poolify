
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pool } from "@/types/pool";

interface PoolSelectorProps {
  poolsByRange: Record<string, Pool[]>;
  selectedPoolId: string;
  onSelectPool: (poolId: string) => void;
}

export const PoolSelector = ({ 
  poolsByRange, 
  selectedPoolId, 
  onSelectPool 
}: PoolSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="pool-select">Select a Pool Model</Label>
      <Select
        value={selectedPoolId}
        onValueChange={onSelectPool}
      >
        <SelectTrigger id="pool-select" className="w-full">
          <SelectValue placeholder="Select a pool" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(poolsByRange).map(([range, poolsInRange]) => (
            <div key={range} className="py-2">
              <div className="px-2 text-sm font-medium text-gray-500">{range}</div>
              {poolsInRange.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  {pool.name} ({pool.length}m × {pool.width}m)
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
