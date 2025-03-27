
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PavingTypeSelector } from "./PavingTypeSelector";
import { MetersInput } from "./MetersInput";
import { CostBreakdown } from "./CostBreakdown";
import { NoPoolWarning } from "./NoPoolWarning";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface MainPavingSectionProps {
  quoteData: any;
  selectedPavingId: string;
  meters: number;
  hasCostData: boolean;
  isLoading: boolean;
  extraPavingCosts?: ExtraPavingCost[];
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails: any;
  concreteDetails: any;
  labourDetails: any;
  onSelectedPavingChange: (id: string) => void;
  onMetersChange: (value: number) => void;
  markAsChanged: () => void;
}

export const MainPavingSection: React.FC<MainPavingSectionProps> = ({
  quoteData,
  selectedPavingId,
  meters,
  hasCostData,
  isLoading,
  extraPavingCosts,
  perMeterCost,
  materialCost,
  labourCost,
  marginCost,
  totalCost,
  pavingDetails,
  concreteDetails,
  labourDetails,
  onSelectedPavingChange,
  onMetersChange,
  markAsChanged
}) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h3 className="text-xl font-semibold">Extra Paving</h3>
        <p className="text-gray-500">Calculate additional paving costs</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-t mt-2 pt-4">
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">Loading paving options...</div>
          ) : (
            <div className="space-y-6">
              {!quoteData.pool_id && <NoPoolWarning />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paving Selection */}
                <PavingTypeSelector 
                  selectedPavingId={selectedPavingId}
                  extraPavingCosts={extraPavingCosts}
                  onSelect={onSelectedPavingChange}
                />
                
                {/* Metres Input */}
                <MetersInput 
                  meters={meters} 
                  onChange={onMetersChange} 
                />
              </div>
              
              {/* Cost Breakdown */}
              {hasCostData && (
                <CostBreakdown
                  perMeterCost={perMeterCost}
                  materialCost={materialCost}
                  labourCost={labourCost}
                  marginCost={marginCost}
                  totalCost={totalCost}
                  pavingDetails={pavingDetails}
                  concreteDetails={concreteDetails}
                  labourDetails={labourDetails}
                  meters={meters}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
