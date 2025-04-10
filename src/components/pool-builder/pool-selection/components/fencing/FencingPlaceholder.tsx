
import React from "react";
import { Fence } from "lucide-react";
import { Pool } from "@/types/pool";
import { Card } from "@/components/ui/card";

interface FencingPlaceholderProps {
  pool: Pool | null;
  customerId: string | null;
}

export const FencingPlaceholder: React.FC<FencingPlaceholderProps> = ({ pool, customerId }) => {
  if (!pool) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border text-center space-y-3">
        <Fence className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">Please Select a Pool First</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Fencing options are specific to the pool model. Please select a pool in the Pool Selection tab to view fencing options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pool Fencing</h2>
      </div>

      <Card className="p-6">
        <div className="bg-amber-50 p-4 rounded-md">
          <div className="flex items-start gap-3">
            <Fence className="h-5 w-5 text-amber-800 mt-0.5" />
            <div>
              <h3 className="font-medium text-lg mb-1">Coming Soon</h3>
              <p className="text-amber-800">
                The Pool Fencing configuration functionality will be implemented in future updates.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
