
import React from "react";
import { Droplets } from "lucide-react";
import { Pool } from "@/types/pool";

interface WaterFeaturePlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const WaterFeaturePlaceholder: React.FC<WaterFeaturePlaceholderProps> = ({ pool, customerId }) => {
  return (
    <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
      <Droplets className="h-12 w-12 text-muted-foreground mx-auto" />
      <h3 className="text-lg font-medium">Water Feature Placeholder</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        This section will allow you to add and customize water features for the selected pool.
      </p>
    </div>
  );
};
