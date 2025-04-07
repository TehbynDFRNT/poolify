
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pool } from "@/types/pool";
import { ChevronDown } from "lucide-react";

interface PoolModelSelectorProps {
  poolsByRange: Record<string, Pool[]>;
  selectedPoolId: string;
  onSelect: (poolId: string) => void;
}

export const PoolModelSelector: React.FC<PoolModelSelectorProps> = ({ 
  poolsByRange, 
  selectedPoolId, 
  onSelect 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="pool-select">Pool Model</Label>
      <Select
        value={selectedPoolId}
        onValueChange={onSelect}
      >
        <SelectTrigger id="pool-select" className="w-full">
          <SelectValue placeholder="Select a pool model" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {Object.keys(poolsByRange).length === 0 ? (
            <SelectItem value="no-pools" disabled>
              No pools available
            </SelectItem>
          ) : (
            Object.entries(poolsByRange).map(([range, poolsInRange]) => (
              <div key={range} className="py-2">
                <div className="px-2 text-sm font-medium text-primary">{range}</div>
                {poolsInRange.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    {pool.name} ({pool.length}m × {pool.width}m)
                  </SelectItem>
                ))}
              </div>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
