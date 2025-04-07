
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePools } from "@/hooks/usePools";

const PoolSelectionSection: React.FC = () => {
  const { data: pools, isLoading, error } = usePools();
  const [selectedPoolId, setSelectedPoolId] = React.useState("");

  // Group pools by range for better organization
  const poolsByRange = React.useMemo(() => {
    if (!pools) return {};
    
    return pools.reduce((acc, pool) => {
      if (!acc[pool.range]) {
        acc[pool.range] = [];
      }
      acc[pool.range].push(pool);
      return acc;
    }, {} as Record<string, any[]>);
  }, [pools]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pool Selection</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select a Pool Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading pool models...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md">
              <p className="text-destructive">Failed to load pools. Please try again.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="pool-select">Pool Model</Label>
                <Select
                  value={selectedPoolId}
                  onValueChange={setSelectedPoolId}
                >
                  <SelectTrigger id="pool-select" className="w-full">
                    <SelectValue placeholder="Select a pool model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(poolsByRange).length === 0 ? (
                      <SelectItem value="no-pools" disabled>
                        No pools available
                      </SelectItem>
                    ) : (
                      Object.entries(poolsByRange).map(([range, poolsInRange]) => (
                        <div key={range} className="py-2">
                          <div className="px-2 text-sm font-medium text-gray-500">{range}</div>
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

              {selectedPoolId && (
                <div className="bg-primary/10 p-4 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Selected Pool</h3>
                  <p className="text-sm">
                    {pools?.find(p => p.id === selectedPoolId)?.name || 'Pool details'}
                  </p>
                  <div className="mt-4">
                    <Button size="sm">Continue with this pool</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSelectionSection;
