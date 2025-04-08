
import React from "react";
import { formatCurrency } from "@/utils/format";

interface SiteRequirementsCostSummaryProps {
  craneCost: number;
  trafficControlCost: number;
  bobcatCost: number;
  customRequirementsTotal: number;
  totalCost: number;
}

export const SiteRequirementsCostSummary: React.FC<SiteRequirementsCostSummaryProps> = ({
  craneCost,
  trafficControlCost,
  bobcatCost,
  customRequirementsTotal,
  totalCost
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">Standard Requirements</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between py-1">
              <span>Crane:</span>
              <span className="font-medium">{formatCurrency(craneCost)}</span>
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
              <span className="font-medium">{formatCurrency(customRequirementsTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Site Requirements Cost:</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </div>
  );
};
