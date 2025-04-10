
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FencingFormValues, fencingSchema, CostCalculation } from "../types";

export const useFencingForm = (customerId: string, poolId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState<FencingFormValues | null>(null);
  
  const form = useForm<FencingFormValues>({
    resolver: zodResolver(fencingSchema),
    defaultValues: {
      linearMeters: 0,
      gates: 0,
      simplePanels: 0,
      complexPanels: 0,
      earthingRequired: false,
    },
  });

  const watchedValues = form.watch();
  
  // Load existing data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const { data, error } = await supabase
          .from('frameless_glass_fencing')
          .select('*')
          .eq('customer_id', customerId)
          .eq('pool_id', poolId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fencing data:", error);
          return;
        }
        
        if (data) {
          const formValues = {
            linearMeters: data.linear_meters,
            gates: data.gates,
            simplePanels: data.simple_panels,
            complexPanels: data.complex_panels,
            earthingRequired: data.earthing_required,
          };
          
          setExistingData(formValues);
          form.reset(formValues);
        }
      } catch (error) {
        console.error("Error in fetchExistingData:", error);
      }
    };
    
    if (customerId && poolId) {
      fetchExistingData();
    }
  }, [customerId, poolId, form]);
  
  // Calculate costs
  const calculateCosts = (): CostCalculation => {
    const linearCost = watchedValues.linearMeters * 396;
    const totalGates = watchedValues.gates;
    const gatesCost = totalGates * 495;
    const freeGateDiscount = totalGates > 0 ? -495 : 0;
    const simplePanelsCost = watchedValues.simplePanels * 220;
    const complexPanelsCost = watchedValues.complexPanels * 660;
    const earthingCost = watchedValues.earthingRequired ? 40 : 0;
    
    const totalCost = linearCost + gatesCost + freeGateDiscount + simplePanelsCost + complexPanelsCost + earthingCost;
    
    return {
      linearCost,
      gatesCost,
      freeGateDiscount,
      simplePanelsCost,
      complexPanelsCost,
      earthingCost,
      totalCost,
    };
  };
  
  const costs = calculateCosts();

  const onSubmit = async (data: FencingFormValues) => {
    if (!customerId || !poolId) {
      toast.error("Missing customer or pool information");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate the total cost
      const calculatedCosts = calculateCosts();
      
      // Prepare data for Supabase
      const fencingData = {
        customer_id: customerId,
        pool_id: poolId,
        linear_meters: data.linearMeters,
        gates: data.gates,
        simple_panels: data.simplePanels,
        complex_panels: data.complexPanels,
        earthing_required: data.earthingRequired,
        total_cost: calculatedCosts.totalCost,
      };
      
      // Check if data already exists for this customer and pool
      const { data: existingRecord } = await supabase
        .from('frameless_glass_fencing')
        .select('id')
        .eq('customer_id', customerId)
        .eq('pool_id', poolId)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('frameless_glass_fencing')
          .update(fencingData)
          .eq('id', existingRecord.id);
      } else {
        // Insert new record
        result = await supabase
          .from('frameless_glass_fencing')
          .insert(fencingData);
      }
      
      const { error } = result;
      
      if (error) {
        throw error;
      }
      
      toast.success("Fencing configuration saved successfully");
    } catch (error) {
      console.error("Error saving fencing data:", error);
      toast.error("Failed to save fencing configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    costs,
    isSubmitting,
    existingData,
    onSubmit,
  };
};
