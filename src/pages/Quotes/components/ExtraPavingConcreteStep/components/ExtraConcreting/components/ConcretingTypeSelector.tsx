
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExtraConcreting } from "@/types/extra-concreting";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface ConcretingTypeSelectorProps {
  selectedType: string;
  extraConcretingItems?: ExtraConcreting[];
  isLoading: boolean;
  onTypeChange: (value: string) => void;
}

export const ConcretingTypeSelector: React.FC<ConcretingTypeSelectorProps> = ({
  selectedType,
  extraConcretingItems,
  isLoading,
  onTypeChange
}) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="concrete-type">Concrete Type</Label>
      <Select
        value={selectedType || "default"}
        onValueChange={onTypeChange}
      >
        <SelectTrigger id="concrete-type">
          <SelectValue placeholder="Select concrete type" />
        </SelectTrigger>
        <SelectContent>
          {!extraConcretingItems || extraConcretingItems.length === 0 ? (
            <SelectItem value="no-options" disabled>
              No concrete types available
            </SelectItem>
          ) : (
            <>
              <SelectItem value="default" disabled>
                Select concrete type
              </SelectItem>
              {extraConcretingItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.type} ({formatCurrency(item.price)}/m²)
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
