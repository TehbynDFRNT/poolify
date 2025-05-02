
import React from "react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";

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
  const handleCleanerChange = (cleanerId: string) => {
    const cleaner = availableCleaners.find(c => c.id === cleanerId);
    setSelectedCleaner(cleaner || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pool Cleaner Selection</CardTitle>
        <CardDescription>
          Select an automatic pool cleaner for your installation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="include-cleaner" className="flex-1">
            Include automatic pool cleaner
          </Label>
          <Switch 
            id="include-cleaner" 
            checked={includeCleaner} 
            onCheckedChange={setIncludeCleaner} 
          />
        </div>

        {includeCleaner && availableCleaners.length > 0 && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="cleaner-select">Select Pool Cleaner Model</Label>
            <Select 
              value={selectedCleaner?.id || ''} 
              onValueChange={handleCleanerChange} 
              disabled={!includeCleaner}
            >
              <SelectTrigger id="cleaner-select">
                <SelectValue placeholder="Select a pool cleaner" />
              </SelectTrigger>
              <SelectContent>
                {availableCleaners.map(cleaner => (
                  <SelectItem key={cleaner.id} value={cleaner.id}>
                    {cleaner.name} ({formatCurrency(cleaner.rrp)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {includeCleaner && availableCleaners.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-4">
            <p className="text-amber-700">
              No compatible pool cleaners found for this pool model. Please contact support for assistance.
            </p>
          </div>
        )}

        {selectedCleaner && includeCleaner && (
          <div className="bg-slate-50 p-4 rounded-md mt-4 space-y-2">
            <h4 className="font-medium">{selectedCleaner.name}</h4>
            {selectedCleaner.description && (
              <p className="text-sm text-muted-foreground">{selectedCleaner.description}</p>
            )}
            <div className="flex justify-between">
              <span className="text-sm">Model:</span>
              <span className="text-sm font-medium">{selectedCleaner.model_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Price:</span>
              <span className="text-sm font-medium">{formatCurrency(selectedCleaner.rrp)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
