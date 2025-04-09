
import React from "react";
import { Droplets } from "lucide-react";
import { Pool } from "@/types/pool";
import { WaterFeatureForm } from "./WaterFeatureForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WaterFeaturePlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const WaterFeaturePlaceholder: React.FC<WaterFeaturePlaceholderProps> = ({ pool, customerId }) => {
  if (!pool) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
        <Droplets className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">Water Feature Options</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please select a pool first to configure water feature options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            <CardTitle>Water Feature</CardTitle>
          </div>
          <CardDescription>
            Configure water feature options for {pool.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            All prices include margin and will be calculated according to the water feature formula.
            Base pricing is determined by the selected size, with optional add-ons for back cladding
            and LED blades.
          </p>
          
          <WaterFeatureForm pool={pool} customerId={customerId} />
        </CardContent>
      </Card>
    </div>
  );
};
