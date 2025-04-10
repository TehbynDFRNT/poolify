
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
        <div className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-md flex items-start gap-3">
            <Fence className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-lg mb-1">Fencing Options</h3>
              <p className="text-muted-foreground">
                Choose from various fencing options for your pool, including frameless glass, semi-frameless glass, and aluminum fencing.
              </p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Frameless Glass Fencing</h4>
              <p className="text-sm text-muted-foreground mb-4">Premium 12mm toughened glass with stainless steel spigots.</p>
              <p className="text-sm"><span className="font-medium">Price:</span> $396 per linear meter</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Semi-Frameless Glass</h4>
              <p className="text-sm text-muted-foreground mb-4">10mm toughened glass with aluminum posts.</p>
              <p className="text-sm"><span className="font-medium">Price:</span> $295 per linear meter</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Aluminum Fencing</h4>
              <p className="text-sm text-muted-foreground mb-4">Powder-coated aluminum panels in various heights.</p>
              <p className="text-sm"><span className="font-medium">Price:</span> $175 per linear meter</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Gate Options</h4>
              <p className="text-sm text-muted-foreground mb-4">Self-closing gates with magnetic latches.</p>
              <p className="text-sm"><span className="font-medium">Price:</span> $495 per gate</p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-sm text-amber-800">
              Note: This is a placeholder. Fencing configuration functionality will be implemented in future updates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
