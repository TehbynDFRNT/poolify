
import React from "react";
import { Fence } from "lucide-react";
import { Pool } from "@/types/pool";
import { RetainingWallCalculator } from "./RetainingWallCalculator";

interface RetainingWallsPlaceholderProps {
  pool: Pool;
  customerId: string | null;
}

export const RetainingWallsPlaceholder: React.FC<RetainingWallsPlaceholderProps> = ({
  pool,
  customerId,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Fence className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Retaining Walls</h2>
      </div>
      
      <div className="text-muted-foreground text-sm mb-6">
        Calculate retaining wall costs based on dimensions and wall type.
      </div>
      
      <RetainingWallCalculator />
    </div>
  );
};
