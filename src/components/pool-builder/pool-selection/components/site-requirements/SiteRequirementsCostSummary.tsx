
import React from "react";
import { formatCurrency } from "@/utils/format";

interface SiteRequirementsCostSummaryProps {
  craneCost: number;
  trafficControlCost: number;
  bobcatCost: number;
  customRequirementsTotal: number;
  totalCost: number;
  isDefaultCrane?: boolean;
  defaultCraneCost?: number;
  customRequirementsMargin?: number;
}

export const SiteRequirementsCostSummary: React.FC<SiteRequirementsCostSummaryProps> = ({
  craneCost,
  trafficControlCost,
  bobcatCost,
  customRequirementsTotal,
  totalCost,
  isDefaultCrane = false,
  defaultCraneCost = 0,
  customRequirementsMargin = 0,
}) => {
  // Calculate the crane cost difference if this is not the default crane
  const craneCostDifference = isDefaultCrane ? 0 : craneCost - defaultCraneCost;
  
  // Calculate the adjusted total (subtracting the default crane cost if needed)
  const adjustedTotal = isDefaultCrane ? 
    totalCost : 
    totalCost - craneCost + craneCostDifference;

  // Only display margin if it's a reasonable value (between 0 and 100)
  const shouldDisplayMargin = customRequirementsTotal > 0 && 
                              customRequirementsMargin > 0 && 
                              customRequirementsMargin <= 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Standard Requirements</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between py-1">
              <span>
                Crane: 
                {!isDefaultCrane && defaultCraneCost > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (additional cost)
                  </span>
                )}
              </span>
              <span className="font-medium">
                {isDefaultCrane ? 
                  "Included in base price" : 
                  formatCurrency(craneCostDifference)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Traffic Control:</span>
              <span className="font-medium">{formatCurrency(trafficControlCost)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Bobcat:</span>
              <span className="font-medium">{formatCurrency(bobcatCost)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Custom Requirements</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between py-1">
              <span>Custom Requirements Total:</span>
              <div className="text-right">
                <span className="font-medium">{formatCurrency(customRequirementsTotal)}</span>
                {shouldDisplayMargin && (
                  <div className="text-xs text-muted-foreground">
                    {customRequirementsMargin}% avg margin
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Site Requirements Cost:</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(adjustedTotal)}</span>
        </div>
        {!isDefaultCrane && defaultCraneCost > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            *Standard Franna crane cost is already included in the base pool price
          </p>
        )}
      </div>
    </div>
  );
};
