
import React from "react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleSlash } from "lucide-react";
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
  const handleSwitchChange = (checked: boolean) => {
    setIncludeCleaner(checked);
    if (!checked) {
      setSelectedCleaner(null);
    } else if (availableCleaners.length > 0 && !selectedCleaner) {
      setSelectedCleaner(availableCleaners[0]);
    }
  };

  const handleSelectChange = (value: string) => {
    const cleaner = availableCleaners.find(c => c.id === value) || null;
    setSelectedCleaner(cleaner);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="include-cleaner" className="font-medium">
          Include pool cleaner
        </Label>
        <Switch 
          id="include-cleaner" 
          checked={includeCleaner} 
          onCheckedChange={handleSwitchChange}
        />
      </div>

      {includeCleaner && (
        <div className="bg-muted/30 p-4 rounded-md space-y-3">
          <div className="space-y-2">
            <Label htmlFor="cleaner-select">Select Pool Cleaner</Label>
            <Select
              value={selectedCleaner?.id || ""}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="cleaner-select" className="w-full">
                <SelectValue placeholder="Select a pool cleaner" />
              </SelectTrigger>
              <SelectContent>
                {availableCleaners.length > 0 ? (
                  availableCleaners.map((cleaner) => (
                    <SelectItem key={cleaner.id} value={cleaner.id}>
                      {cleaner.name} - {formatCurrency(cleaner.price)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center px-2 py-4 text-muted-foreground">
                    <CircleSlash className="h-4 w-4 mr-2" />
                    No pool cleaners available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedCleaner && (
            <div className="bg-white rounded-md p-3 text-sm border">
              <h4 className="font-medium">{selectedCleaner.name}</h4>
              <div className="text-muted-foreground mt-1">
                <p>Model: {selectedCleaner.model_number}</p>
                {selectedCleaner.description && (
                  <p className="mt-1">{selectedCleaner.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
