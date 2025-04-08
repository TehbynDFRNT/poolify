
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Pool } from "@/types/pool";
import { supabase } from "@/integrations/supabase/client";

interface ConcreteAndPavingCostSummaryProps {
  pool: Pool;
  customerId: string;
}

interface SummaryData {
  extraPavingCost: number;
  existingConcretePavingCost: number;
  extraConcretingCost: number;
  concretePumpCost: number;
  underFenceStripsCost: number;
  concreteCutsCost: number;
  totalCost: number;
}

export const ConcreteAndPavingCostSummary: React.FC<ConcreteAndPavingCostSummaryProps> = ({ 
  pool, 
  customerId 
}) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    extraPavingCost: 0,
    existingConcretePavingCost: 0,
    extraConcretingCost: 0,
    concretePumpCost: 0,
    underFenceStripsCost: 0,
    concreteCutsCost: 0,
    totalCost: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchSummaryData();
    }
  }, [customerId]);

  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`
          extra_paving_concrete_cost,
          paving_on_existing_concrete_cost,
          extra_concreting_cost,
          concrete_pump_total_cost,
          under_fence_concrete_strips_cost,
          concrete_cuts_cost
        `)
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching concrete and paving summary data:", error);
        return;
      }
      
      if (data) {
        const summaryData: SummaryData = {
          extraPavingCost: data.extra_paving_concrete_cost || 0,
          existingConcretePavingCost: data.paving_on_existing_concrete_cost || 0,
          extraConcretingCost: data.extra_concreting_cost || 0,
          concretePumpCost: data.concrete_pump_total_cost || 0,
          underFenceStripsCost: data.under_fence_concrete_strips_cost || 0,
          concreteCutsCost: data.concrete_cuts_cost || 0,
          totalCost: 0
        };
        
        // Calculate total
        summaryData.totalCost = 
          summaryData.extraPavingCost +
          summaryData.existingConcretePavingCost +
          summaryData.extraConcretingCost +
          summaryData.concretePumpCost +
          summaryData.underFenceStripsCost +
          summaryData.concreteCutsCost;
        
        setSummaryData(summaryData);
      }
    } catch (error) {
      console.error("Error fetching concrete and paving summary data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there's any cost data
  const hasAnyCosts = Object.values(summaryData).some(cost => cost > 0);

  return (
    <Card>
      <CardHeader className="bg-secondary/20 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Concrete & Paving Cost Summary</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading summary data...</div>
        ) : !hasAnyCosts ? (
          <div className="text-center py-4 text-muted-foreground">
            No concrete or paving costs have been added yet.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Paving Requirements</h4>
                <div className="space-y-1 text-sm">
                  {summaryData.extraPavingCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Extra Paving and Concrete:</span>
                      <span className="font-medium">{formatCurrency(summaryData.extraPavingCost)}</span>
                    </div>
                  )}
                  {summaryData.existingConcretePavingCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Paving on Existing Concrete:</span>
                      <span className="font-medium">{formatCurrency(summaryData.existingConcretePavingCost)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Concrete Requirements</h4>
                <div className="space-y-1 text-sm">
                  {summaryData.extraConcretingCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Extra Concreting:</span>
                      <span className="font-medium">{formatCurrency(summaryData.extraConcretingCost)}</span>
                    </div>
                  )}
                  {summaryData.concretePumpCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Concrete Pump:</span>
                      <span className="font-medium">{formatCurrency(summaryData.concretePumpCost)}</span>
                    </div>
                  )}
                  {summaryData.underFenceStripsCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Under Fence Concrete Strips:</span>
                      <span className="font-medium">{formatCurrency(summaryData.underFenceStripsCost)}</span>
                    </div>
                  )}
                  {summaryData.concreteCutsCost > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Concrete Cuts:</span>
                      <span className="font-medium">{formatCurrency(summaryData.concreteCutsCost)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Concrete & Paving Cost:</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(summaryData.totalCost)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
