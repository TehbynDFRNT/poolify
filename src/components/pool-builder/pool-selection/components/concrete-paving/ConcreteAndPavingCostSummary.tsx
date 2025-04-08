
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator, Percent, DollarSign } from "lucide-react";
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
  totalMargin: number;
  marginPercentage: number;
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
    totalCost: 0,
    totalMargin: 0,
    marginPercentage: 0
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
          extra_paving_total_cost,
          existing_concrete_paving_total_cost,
          extra_concreting_total_cost,
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
        // Extract costs
        const extraPavingCost = data.extra_paving_total_cost || 0;
        const existingConcretePavingCost = data.existing_concrete_paving_total_cost || 0;
        const extraConcretingCost = data.extra_concreting_total_cost || 0;
        const concretePumpCost = data.concrete_pump_total_cost || 0;
        const underFenceStripsCost = data.under_fence_concrete_strips_cost || 0;
        const concreteCutsCost = data.concrete_cuts_cost || 0;
        
        // Calculate margins (using a default percentage for each type)
        const extraPavingMargin = extraPavingCost * 0.15;
        const existingConcretePavingMargin = existingConcretePavingCost * 0.15;
        const extraConcretingMargin = extraConcretingCost * 0.12;
        const concretePumpMargin = concretePumpCost * 0.1;
        const underFenceStripsMargin = underFenceStripsCost * 0.12;
        const concreteCutsMargin = concreteCutsCost * 0.12;
        
        // Calculate totals
        const totalCost = 
          extraPavingCost +
          existingConcretePavingCost +
          extraConcretingCost +
          concretePumpCost +
          underFenceStripsCost +
          concreteCutsCost;
          
        const totalMargin = 
          extraPavingMargin +
          existingConcretePavingMargin +
          extraConcretingMargin +
          concretePumpMargin +
          underFenceStripsMargin +
          concreteCutsMargin;
        
        // Calculate margin percentage
        const marginPercentage = totalCost > 0 ? (totalMargin / totalCost) * 100 : 0;
        
        setSummaryData({
          extraPavingCost,
          existingConcretePavingCost,
          extraConcretingCost,
          concretePumpCost,
          underFenceStripsCost,
          concreteCutsCost,
          totalCost,
          totalMargin,
          marginPercentage
        });
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
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    Total Concrete & Paving Cost:
                  </span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(summaryData.totalCost)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Percent className="h-4 w-4 mr-1 text-primary" />
                    Margin:
                  </span>
                  <div className="flex items-center space-x-3">
                    <span>{formatCurrency(summaryData.totalMargin)}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                      {summaryData.marginPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
