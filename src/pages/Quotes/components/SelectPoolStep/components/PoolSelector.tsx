
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
  // Helper to get color display class
  const getColorClass = (color?: string) => {
    switch(color) {
      case "Silver Mist": return "bg-gray-300";
      case "Horizon": return "bg-gray-800";
      case "Twilight": return "bg-gray-700";
      default: return "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pool-select">Select a Pool Model</Label>
      <Select
        value={selectedPoolId || "default"}
        onValueChange={onSelectPool}
      >
        <SelectTrigger id="pool-select" className="w-full">
          <SelectValue placeholder="Select a pool" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(poolsByRange).length === 0 ? (
            <SelectItem value="no-options" disabled>
              No pools available
            </SelectItem>
          ) : (
            <>
              <SelectItem value="default" disabled>
                Select a pool
              </SelectItem>
              {Object.entries(poolsByRange).map(([range, poolsInRange]) => (
                <div key={range} className="py-2">
                  <div className="px-2 text-sm font-medium text-gray-500">{range}</div>
                  {poolsInRange.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      <div className="flex items-center gap-2">
                        {pool.color && (
                          <span className={`h-3 w-3 rounded-full ${getColorClass(pool.color)}`}></span>
                        )}
                        {pool.name} ({pool.length}m × {pool.width}m)
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
