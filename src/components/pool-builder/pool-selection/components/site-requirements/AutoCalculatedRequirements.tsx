import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface AutoCalculatedRequirement {
  id: string;
  description: string;
  cost: number;
  margin: number;
  total: number;
}

interface AutoCalculatedRequirementsProps {
  requirements: AutoCalculatedRequirement[];
}

export const AutoCalculatedRequirements: React.FC<AutoCalculatedRequirementsProps> = ({
  requirements
}) => {
  if (requirements.length === 0) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-blue-900">Auto-Calculated Requirements</h4>
        </div>
        <div className="space-y-2">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white rounded-md p-3 border border-blue-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{req.description}</p>
                  <div className="mt-1 text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span>${req.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span>${req.margin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-900 pt-1 border-t">
                      <span>Total:</span>
                      <span>${req.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-3">
          These values are automatically calculated based on your selections above and will be included in the total cost.
        </p>
      </CardContent>
    </Card>
  );
};