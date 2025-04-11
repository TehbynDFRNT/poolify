
import React, { useState } from "react";
import { Pool } from "@/types/pool";
import { Card } from "@/components/ui/card";
import { SpaJetsSection } from "./SpaJetsSection";

interface AddonsSectionProps {
  pool: Pool;
  customerId: string | null;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({ pool, customerId }) => {
  const [totals, setTotals] = useState({
    totalPrice: 0,
    totalCost: 0,
    totalMargin: 0
  });

  const handleSpaJetsChange = (spaJetTotals: {
    totalPrice: number;
    totalCost: number;
    totalMargin: number;
  }) => {
    setTotals(prev => ({
      ...prev,
      ...spaJetTotals
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Pool Add-ons</h2>
        
        {/* Spa Jets Section */}
        <div className="space-y-6">
          <SpaJetsSection 
            pool={pool} 
            customerId={customerId} 
            onSelectionChange={handleSpaJetsChange}
          />
          
          {/* Summary of all add-ons */}
          <div className="mt-6 p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Add-ons Cost:</span>
              <span className="text-lg font-bold">
                ${totals.totalPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
