import React, { useEffect, useState } from "react";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

const PricingStep: React.FC = () => {
  const { 
    marginPercentage, 
    setMarginPercentage,
    selectedDigTypeId, 
    selectedCraneId,
    craneCosts,
    digTypes
  } = usePoolWizard();
  
  const { watch } = useFormContext();
  const [fixedCosts, setFixedCosts] = useState<{ id: string; name: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const poolName = watch("name");
  const basePrice = watch("buy_price_ex_gst") || 0;
  
  // Get selected crane cost
  const selectedCrane = craneCosts?.find(crane => crane.id === selectedCraneId);
  const craneCost = selectedCrane?.price || 0;
  
  // Get selected dig type cost 
  const selectedDigType = digTypes?.find(dig => dig.id === selectedDigTypeId);
  const excavationCost = selectedDigType ? 
    (selectedDigType.excavation_hourly_rate * selectedDigType.excavation_hours) + 
    (selectedDigType.truck_hourly_rate * selectedDigType.truck_hours * selectedDigType.truck_quantity) : 0;
  
  // Pool costs from previous step - in a real implementation, this would be passed between steps
  const poolCosts = {
    pea_gravel: 0,
    install_fee: 0,
    trucked_water: 0,
    salt_bags: 0,
    misc: 2700,
    coping_supply: 0,
    beam: 0,
    coping_lay: 0
  };
  
  // Calculate total individual costs
  const individualCostsTotal = Object.values(poolCosts).reduce((sum, cost) => sum + cost, 0);
  
  // Load fixed costs
  useEffect(() => {
    const fetchFixedCosts = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("fixed_costs")
          .select("id, name, price")
          .order("display_order");
          
        if (error) throw error;
        setFixedCosts(data || []);
      } catch (error) {
        console.error("Error loading fixed costs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFixedCosts();
  }, []);
  
  // Calculate fixed costs total
  const fixedCostsTotal = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);
  
  // Calculate total costs
  const totalCost = basePrice + craneCost + excavationCost + individualCostsTotal + fixedCostsTotal;
  
  // Calculate margin amount
  const marginAmount = totalCost * (marginPercentage / 100);
  
  // Calculate RRP
  const rrp = totalCost + marginAmount;
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Set pricing margin for <span className="font-medium text-foreground">{poolName}</span>
      </p>
      
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Margin Percentage</Label>
                <span className="font-medium text-lg">{marginPercentage}%</span>
              </div>
              <Slider
                value={[marginPercentage]}
                onValueChange={(values) => setMarginPercentage(values[0])}
                min={0}
                max={50}
                step={1}
                className="mb-6"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Base Price (Ex GST)</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Crane Cost</span>
                <span>{formatCurrency(craneCost)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Excavation Cost</span>
                <span>{formatCurrency(excavationCost)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Pool Individual Costs</span>
                <span>{formatCurrency(individualCostsTotal)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Fixed Costs</span>
                <span>{formatCurrency(fixedCostsTotal)}</span>
              </div>
              
              <div className="flex justify-between font-medium pt-2">
                <span>Total Cost</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>
              
              <div className="flex justify-between text-primary pt-2">
                <span>Margin ({marginPercentage}%)</span>
                <span>{formatCurrency(marginAmount)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold pt-4 border-t mt-2">
                <span>Recommended Retail Price</span>
                <span>{formatCurrency(rrp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingStep;
