
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePools } from '@/hooks/usePools';

interface PoolSelectionFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const PoolSelectionForm: React.FC<PoolSelectionFormProps> = ({ onNext, onPrevious }) => {
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const { data: pools, isLoading } = usePools();

  const handlePoolChange = (value: string) => {
    setSelectedPoolId(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolId) {
      return;
    }
    
    // Here you would typically save the selection
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold">Select Pool</h2>
          <p className="text-sm text-muted-foreground">
            Choose the pool for your quote
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pool-select">Pool Model</Label>
                <Select 
                  value={selectedPoolId} 
                  onValueChange={handlePoolChange}
                >
                  <SelectTrigger id="pool-select">
                    <SelectValue placeholder="Select a pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {pools && pools.length > 0 ? (
                      pools.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id}>
                          {pool.model_name} - {pool.length}m × {pool.width}m
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-pools" disabled>
                        No pools available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedPoolId}
                >
                  Next
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
