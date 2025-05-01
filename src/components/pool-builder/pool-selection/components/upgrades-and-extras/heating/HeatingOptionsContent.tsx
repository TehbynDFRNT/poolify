
import React, { useState, useEffect } from "react";
import { Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PoolHeatingOptions } from "@/types/heating-options";

interface HeatingOptionsContentProps {
  pool: Pool | null;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  } = usePoolHeatingOptions(
    pool?.id || null,
    pool?.name,
    pool?.range
  );

  // Calculate costs
  const heatPumpInstallationCost = getInstallationCost("Heat Pump");
  const blanketRollerInstallationCost = getInstallationCost("Blanket & Roller");

  const heatPumpTotalCost = includeHeatPump && compatibleHeatPump 
    ? (compatibleHeatPump.rrp || 0) + heatPumpInstallationCost
    : 0;

  const blanketRollerTotalCost = includeBlanketRoller && blanketRoller
    ? blanketRoller.rrp + blanketRollerInstallationCost
    : 0;

  const totalCost = heatPumpTotalCost + blanketRollerTotalCost;
  
  // Calculate margins
  const heatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin || 0 : 0;
  const blanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin || 0 : 0;
  const totalMargin = heatPumpMargin + blanketRollerMargin;

  // Load existing selections when component mounts
  useEffect(() => {
    if (customerId && pool) {
      fetchHeatingOptions();
    }
  }, [customerId, pool]);

  const fetchHeatingOptions = async () => {
    if (!customerId || !pool?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('pool_heating_options')
        .select('*')
        .eq('customer_id', customerId)
        .eq('pool_id', pool.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching heating options:", error);
        return;
      }
      
      if (data) {
        const heatingOptions = data as PoolHeatingOptions;
        setIncludeHeatPump(heatingOptions.include_heat_pump);
        setIncludeBlanketRoller(heatingOptions.include_blanket_roller);
      }
    } catch (error) {
      console.error("Error fetching heating options:", error);
    }
  };

  const saveHeatingOptions = async () => {
    if (!customerId || !pool) {
      toast.error("Customer information is required to save heating options");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const heatingOptionsData = {
        customer_id: customerId,
        pool_id: pool.id,
        include_heat_pump: includeHeatPump,
        include_blanket_roller: includeBlanketRoller,
        heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
        blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
        heat_pump_cost: heatPumpTotalCost,
        blanket_roller_cost: blanketRollerTotalCost,
        total_cost: totalCost,
        total_margin: totalMargin
      };
      
      // Check if a record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from('pool_heating_options')
        .select('id')
        .eq('customer_id', customerId)
        .eq('pool_id', pool.id)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error checking existing data:", fetchError);
        throw fetchError;
      }
      
      let error;
      
      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pool_heating_options')
          .update(heatingOptionsData)
          .eq('id', existingData.id);
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pool_heating_options')
          .insert(heatingOptionsData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast.success("Heating options saved successfully");
    } catch (error) {
      console.error("Error saving heating options:", error);
      toast.error("Failed to save heating options");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Pool Heating Options</h3>
      </div>
      
      {/* Heat Pump Section */}
      <Card className="border border-muted">
        <CardContent className="pt-6">
          <HeatPumpSection
            includeHeatPump={includeHeatPump}
            setIncludeHeatPump={setIncludeHeatPump}
            compatibleHeatPump={compatibleHeatPump}
            installationCost={heatPumpInstallationCost}
            totalCost={heatPumpTotalCost}
          />
        </CardContent>
      </Card>

      {/* Blanket & Roller Section */}
      <Card className="border border-muted">
        <CardContent className="pt-6">
          <BlanketRollerSection
            includeBlanketRoller={includeBlanketRoller}
            setIncludeBlanketRoller={setIncludeBlanketRoller}
            blanketRoller={blanketRoller}
            installationCost={blanketRollerInstallationCost}
            totalCost={blanketRollerTotalCost}
          />
        </CardContent>
      </Card>

      {/* Summary Section */}
      {(includeHeatPump || includeBlanketRoller) && (
        <div className="bg-primary/10 p-4 rounded-md">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Total Heating Options:</h3>
              <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
            </div>
            
            {/* Add margin display */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Total Margin:</span>
              <span>{formatCurrency(totalMargin)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <Button 
              disabled={!customerId || isSaving} 
              onClick={saveHeatingOptions}
            >
              {isSaving ? 'Saving...' : 'Save Heating Options'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
