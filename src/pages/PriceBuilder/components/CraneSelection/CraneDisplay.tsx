
import React from 'react';
import { Pencil } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { CraneCost } from "@/types/crane-cost";

interface CraneDisplayProps {
  selectedCrane: CraneCost | undefined;
  onClick: () => void;
}

export const CraneDisplay = ({ selectedCrane, onClick }: CraneDisplayProps) => {
  // Convert to number and handle possible non-numeric values
  const cranePrice = selectedCrane?.price ? Number(selectedCrane.price) : 0;
  
  return (
    <div 
      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {selectedCrane?.name || "Crane"}
        </span>
        {selectedCrane?.name === "Franna Crane-S20T-L1" && (
          <Badge variant="outline" className="text-primary border-primary">Default</Badge>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium">
          ${cranePrice.toFixed(2)}
        </span>
        <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
      </div>
    </div>
  );
};
