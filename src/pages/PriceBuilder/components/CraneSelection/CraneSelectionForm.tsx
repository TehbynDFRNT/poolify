
import React from 'react';
import { Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CraneCost } from "@/types/crane-cost";

interface CraneSelectionFormProps {
  craneCosts: CraneCost[] | undefined;
  selectedCraneId: string | null;
  onCraneChange: (craneId: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const CraneSelectionForm = ({
  craneCosts,
  selectedCraneId,
  onCraneChange,
  onSave,
  onCancel
}: CraneSelectionFormProps) => {
  const defaultCraneId = craneCosts?.find(crane => 
    crane.name === "Franna Crane-S20T-L1"
  )?.id || '';

  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={selectedCraneId || defaultCraneId} 
        onValueChange={onCraneChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select crane type" />
        </SelectTrigger>
        <SelectContent>
          {craneCosts?.map(crane => (
            <SelectItem key={crane.id} value={crane.id}>
              <div className="flex items-center gap-2">
                {crane.name}
                {crane.name === "Franna Crane-S20T-L1" && (
                  <Badge variant="outline" className="text-xs text-primary border-primary">Default</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={onSave}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
