
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { PoolCleaner } from "@/types/pool-cleaner";

interface PoolCleanerSelectorProps {
  availableCleaners: PoolCleaner[];
  selectedCleaner: PoolCleaner | null;
  setSelectedCleaner: (cleaner: PoolCleaner | null) => void;
  includeCleaner: boolean;
  setIncludeCleaner: (include: boolean) => void;
}

export const PoolCleanerSelector: React.FC<PoolCleanerSelectorProps> = ({
  availableCleaners,
  selectedCleaner,
  setSelectedCleaner,
  includeCleaner,
  setIncludeCleaner
}) => {
  // Handle the change in the pool cleaner selection
  const handleCleanerSelect = (cleanerId: string) => {
    const cleaner = availableCleaners.find(c => c.id === cleanerId);
    if (cleaner) {
      setSelectedCleaner(cleaner);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pool Cleaner Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="include-cleaner" className="font-medium">
            Include Automatic Pool Cleaner
          </Label>
          <Switch 
            id="include-cleaner"
            checked={includeCleaner}
            onCheckedChange={setIncludeCleaner}
          />
        </div>
        
        {includeCleaner && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cleaner-select">Select Pool Cleaner</Label>
              <Select
                value={selectedCleaner?.id || ""}
                onValueChange={handleCleanerSelect}
                disabled={!includeCleaner}
              >
                <SelectTrigger id="cleaner-select">
                  <SelectValue placeholder="Select a pool cleaner" />
                </SelectTrigger>
                <SelectContent>
                  {availableCleaners.length > 0 ? (
                    availableCleaners.map(cleaner => (
                      <SelectItem key={cleaner.id} value={cleaner.id}>
                        <div className="flex justify-between w-full">
                          <span>{cleaner.name} ({cleaner.model_number})</span>
                          <span className="text-muted-foreground ml-4">
                            {formatCurrency(cleaner.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No pool cleaners available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCleaner && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">{selectedCleaner.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedCleaner.description || `Model: ${selectedCleaner.model_number}`}
                </p>
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span className="font-medium">{formatCurrency(selectedCleaner.price)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
