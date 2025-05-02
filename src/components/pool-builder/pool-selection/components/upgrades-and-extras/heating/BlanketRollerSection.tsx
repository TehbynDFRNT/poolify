
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BlanketRoller } from "@/types/blanket-roller";
import { formatCurrency } from "@/utils/format";

interface BlanketRollerSectionProps {
  blanketRoller: BlanketRoller | null;
  includeBlanketRoller: boolean;
  setIncludeBlanketRoller: (include: boolean) => void;
  installationCost: number;
  totalCost: number;
}

export const BlanketRollerSection: React.FC<BlanketRollerSectionProps> = ({
  blanketRoller,
  includeBlanketRoller,
  setIncludeBlanketRoller,
  installationCost,
  totalCost
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solar Blanket & Roller</CardTitle>
        <CardDescription>
          Retain heat and reduce evaporation with a solar blanket and roller
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="include-blanket" className="flex-1">
            Include solar blanket and roller
          </Label>
          <Switch 
            id="include-blanket" 
            checked={includeBlanketRoller} 
            onCheckedChange={setIncludeBlanketRoller}
            disabled={!blanketRoller}
          />
        </div>

        {!blanketRoller && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="text-amber-700">
              No compatible solar blanket and roller found for this pool model. Please contact support for assistance.
            </p>
          </div>
        )}

        {includeBlanketRoller && blanketRoller && (
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-md space-y-2">
              <h4 className="font-medium">{blanketRoller.description}</h4>
              <div className="flex justify-between">
                <span className="text-sm">Model:</span>
                <span className="text-sm font-medium">{blanketRoller.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price:</span>
                <span className="text-sm font-medium">{formatCurrency(blanketRoller.rrp)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Blanket & Roller:</span>
                <span className="text-sm">{formatCurrency(blanketRoller.rrp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Installation:</span>
                <span className="text-sm">{formatCurrency(installationCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-medium">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
