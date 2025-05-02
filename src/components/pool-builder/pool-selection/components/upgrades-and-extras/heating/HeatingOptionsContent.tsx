
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { BlanketRoller } from "@/types/blanket-roller";
import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";

interface HeatingOptionsContentProps {
  pool: Pool;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);

  const {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost
  } = usePoolHeatingOptions(pool.id, pool.name || "", pool.range);

  // Calculate costs
  const heatPumpCost = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.rrp : 0;
  const blanketRollerCost = includeBlanketRoller && blanketRoller ? blanketRoller.rrp : 0;
  const heatPumpInstallCost = includeHeatPump ? getInstallationCost('heat_pump') : 0;
  const blanketRollerInstallCost = includeBlanketRoller ? getInstallationCost('blanket_roller') : 0;
  
  const totalHeatPumpCost = heatPumpCost + heatPumpInstallCost;
  const totalBlanketRollerCost = blanketRollerCost + blanketRollerInstallCost;
  const totalCost = totalHeatPumpCost + totalBlanketRollerCost;

  // Calculate margin
  const heatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin : 0;
  const blanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin : 0;
  const totalMargin = (heatPumpMargin + blanketRollerMargin) / 2; // Average margin

  // Load existing selections if customer ID is available
  useEffect(() => {
    const fetchExistingOptions = async () => {
      if (!customerId || !pool.id) return;
      
      try {
        const { data, error } = await supabase
          .from('pool_heating_options')
          .select('*')
          .eq('customer_id', customerId)
          .eq('pool_id', pool.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching existing heating options:', error);
          return;
        }
        
        if (data) {
          setIncludeHeatPump(data.include_heat_pump);
          setIncludeBlanketRoller(data.include_blanket_roller);
        }
      } catch (error) {
        console.error('Error in fetchExistingOptions:', error);
      }
    };
    
    fetchExistingOptions();
  }, [customerId, pool.id]);

  // Reset includeHeatPump if there's no compatible heat pump
  useEffect(() => {
    if (!compatibleHeatPump && includeHeatPump) {
      setIncludeHeatPump(false);
    }
  }, [compatibleHeatPump, includeHeatPump]);

  const saveHeatingOptions = async () => {
    if (!customerId || !pool.id) return;
    
    setIsSaving(true);
    
    try {
      const payload = {
        customer_id: customerId,
        pool_id: pool.id,
        include_heat_pump: includeHeatPump,
        include_blanket_roller: includeBlanketRoller,
        heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
        blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
        heat_pump_cost: totalHeatPumpCost,
        blanket_roller_cost: totalBlanketRollerCost,
        total_cost: totalCost,
        total_margin: totalMargin
      };
      
      // Check if an entry already exists
      const { data: existing, error: checkError } = await supabase
        .from('pool_heating_options')
        .select('id')
        .eq('customer_id', customerId)
        .eq('pool_id', pool.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pool_heating_options')
          .update(payload)
          .eq('id', existing.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pool_heating_options')
          .insert([payload]);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Heating options saved successfully"
      });
    } catch (error) {
      console.error('Error saving heating options:', error);
      toast({
        title: "Error",
        description: "Failed to save heating options",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading heating options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-6">
        Choose from our range of heating solutions to extend your swimming season.
        Our options include energy-efficient heat pumps and solar blankets to maintain
        your pool temperature while reducing energy costs.
      </p>
      
      <HeatPumpSection
        compatibleHeatPump={compatibleHeatPump}
        includeHeatPump={includeHeatPump}
        setIncludeHeatPump={setIncludeHeatPump}
        installationCost={heatPumpInstallCost}
        totalCost={totalHeatPumpCost}
      />
      
      <BlanketRollerSection
        blanketRoller={blanketRoller}
        includeBlanketRoller={includeBlanketRoller}
        setIncludeBlanketRoller={setIncludeBlanketRoller}
        installationCost={blanketRollerInstallCost}
        totalCost={totalBlanketRollerCost}
      />
      
      <HeatingOptionsSummary
        includeHeatPump={includeHeatPump}
        includeBlanketRoller={includeBlanketRoller}
        heatPumpCost={heatPumpCost}
        blanketRollerCost={blanketRollerCost}
        heatPumpInstallCost={heatPumpInstallCost}
        blanketRollerInstallCost={blanketRollerInstallCost}
        totalCost={totalCost}
      />
      
      {customerId && (
        <div className="flex justify-end mt-6">
          <Button 
            onClick={saveHeatingOptions} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSaving ? 'Saving...' : 'Save Heating Options'}
          </Button>
        </div>
      )}
    </div>
  );
};
