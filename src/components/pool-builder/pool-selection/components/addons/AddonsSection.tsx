
import React from "react";
import { Pool } from "@/types/pool";
import { Card } from "@/components/ui/card";

interface AddonsSectionProps {
  pool: Pool;
  customerId: string | null;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({ pool, customerId }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Pool Add-ons</h2>
        
        <div className="p-4 border rounded-lg bg-slate-50">
          <p className="text-sm text-muted-foreground text-center">
            Select add-ons from the Add-ons tab to enhance your pool experience.
          </p>
        </div>
      </div>
    </div>
  );
};
