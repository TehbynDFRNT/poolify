
import React from "react";
import { RetainingWall } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";

interface WallTypeDetailsProps {
  selectedWall: RetainingWall | null;
}

export const WallTypeDetails: React.FC<WallTypeDetailsProps> = ({ selectedWall }) => {
  if (!selectedWall) return null;

  return (
    <div className="bg-slate-50 rounded-md p-3 border mt-2">
      <h4 className="font-medium text-sm mb-2">Wall Type Details:</h4>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Base Rate:</p>
          <p>{formatCurrency(selectedWall.rate)}/m²</p>
        </div>
        <div>
          <p className="text-muted-foreground">Extra Rate:</p>
          <p>{formatCurrency(selectedWall.extra_rate)}/m²</p>
        </div>
        <div>
          <p className="text-muted-foreground">Margin:</p>
          <p>{formatCurrency(selectedWall.margin)}/m²</p>
        </div>
      </div>
    </div>
  );
};
