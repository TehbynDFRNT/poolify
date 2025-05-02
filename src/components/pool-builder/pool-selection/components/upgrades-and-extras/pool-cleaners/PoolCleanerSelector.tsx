
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Waves } from "lucide-react";

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
  setIncludeCleaner,
}) => {
  const handleCleanerChange = (cleanerId: string) => {
    const cleaner = availableCleaners.find((c) => c.id === cleanerId) || null;
    setSelectedCleaner(cleaner);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" />
          <Label htmlFor="include-cleaner" className="font-medium">
            Would you like to add an automatic pool cleaner?
          </Label>
        </div>
        <Switch
          id="include-cleaner"
          checked={includeCleaner}
          onCheckedChange={setIncludeCleaner}
        />
      </div>

      {includeCleaner && (
        <div className="pl-6 border-l-2 border-muted p-4">
          <Label htmlFor="cleaner-select" className="mb-2 block">
            Select a Pool Cleaner
          </Label>
          <Select
            value={selectedCleaner?.id || ""}
            onValueChange={handleCleanerChange}
          >
            <SelectTrigger className="w-full" id="cleaner-select">
              <SelectValue placeholder="Select a pool cleaner..." />
            </SelectTrigger>
            <SelectContent>
              {availableCleaners.map((cleaner) => (
                <SelectItem key={cleaner.id} value={cleaner.id}>
                  {cleaner.name} - {cleaner.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCleaner && (
            <div className="mt-4 bg-muted/30 p-4 rounded-md">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedCleaner.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedCleaner.description}</p>
                <div className="text-xs text-muted-foreground">SKU: {selectedCleaner.sku}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
