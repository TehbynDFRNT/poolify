import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Bolt, Calculator, CheckCircle, PlugZap, Zap } from "lucide-react";
import React from "react";
import { SaveButton } from "../SaveButton";
import { useElectricalRequirementsGuarded } from "./hooks/useElectricalRequirementsGuarded";

interface ElectricalRequirementsProps {
  pool: Pool;
  customerId: string | null;
}

export const ElectricalRequirements: React.FC<ElectricalRequirementsProps> = ({ pool, customerId }) => {
  const {
    isLoading,
    options,
    totalCost,
    toggleOption,
    saveElectricalRequirements,
    isSaving,
    StatusWarningDialog,
  } = useElectricalRequirementsGuarded(pool.id, customerId);

  const getIconForOption = (description: string) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("standard power")) return <PlugZap className="h-5 w-5" />;
    if (lowerDesc.includes("fence earthing")) return <Zap className="h-5 w-5" />;
    if (lowerDesc.includes("heat pump")) return <Bolt className="h-5 w-5" />;
    return <Zap className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Electrical Requirements</h2>
        </div>

        <Card className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Electrical Requirements</h2>
      </div>

      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-medium">Electrical Specifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure electrical requirements for your pool installation
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {options.map((option) => (
              <div key={option.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`mt-1 ${option.isSelected ? 'text-primary' : 'text-slate-400'}`}>
                      {getIconForOption(option.description)}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {option.description}
                        {option.isSelected && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2 inline" />
                        )}
                      </h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Rate: {formatCurrency(option.rate)}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={option.isSelected}
                    onCheckedChange={() => toggleOption(option.id)}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <SaveButton
                onClick={saveElectricalRequirements}
                isSubmitting={isSaving}
                disabled={false}
                buttonText="Save Electrical Requirements"
                size="default"
                variant="green"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Electrical Summary Table */}
      <Card>
        <CardHeader className="bg-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">
              Electrical Requirements Summary
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Item</th>
                    <th className="text-center py-2 font-medium">Selected</th>
                    <th className="text-right py-2 font-medium">Rate</th>
                    <th className="text-right py-2 font-medium">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((option) => (
                    <tr key={option.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-left">{option.description}</td>
                      <td className="py-3 px-4 text-center">
                        {option.isSelected ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(option.rate)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {option.isSelected ? formatCurrency(option.rate) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-gray-50 font-bold">
                    <td className="pt-3 pb-3 px-4 text-left">Total Electrical:</td>
                    <td className="pt-3 pb-3 px-4 text-center">-</td>
                    <td className="pt-3 pb-3 px-4 text-right">-</td>
                    <td className="pt-3 pb-3 px-4 text-right text-gray-900 font-semibold">
                      {formatCurrency(totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <p className="text-xs text-muted-foreground">
              *Total cost represents the sum of all selected electrical requirements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </div>
  );
};
