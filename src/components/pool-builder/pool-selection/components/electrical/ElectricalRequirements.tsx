
import React from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Zap, CheckCircle, Save, Plug, PlugZap, Bolt } from "lucide-react";
import { useElectricalRequirements } from "./hooks/useElectricalRequirements";
import { formatCurrency } from "@/utils/format";

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
  } = useElectricalRequirements(pool.id, customerId);

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

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Electrical Cost</h3>
                  <p className="text-muted-foreground text-sm">
                    Sum of all selected electrical requirements
                  </p>
                </div>
                <span className="text-xl font-bold">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={saveElectricalRequirements}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Electrical Requirements
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
