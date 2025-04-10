
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FTMFencingFormValues, ftmFencingSchema, CostCalculation } from "../types";

export const useFlatTopMetalFencingForm = (customerId: string, poolId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState<FTMFencingFormValues | null>(null);
  
  const form = useForm<FTMFencingFormValues>({
    resolver: zodResolver(ftmFencingSchema),
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
        // Use type assertion to bypass TypeScript type checking for the table name
        const { data, error } = await supabase
          .from('flat_top_metal_fencing' as any)
          .select('*')
          .eq('customer_id', customerId)
          .eq('pool_id', poolId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fencing data:", error);
          return;
        }
        
        if (data) {
          // Use type assertion to safely access properties
          const formValues = {
            linearMeters: (data as any).linear_meters,
            gates: (data as any).gates,
            simplePanels: (data as any).simple_panels,
            complexPanels: (data as any).complex_panels,
            earthingRequired: (data as any).earthing_required,
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
    const linearCost = watchedValues.linearMeters * 165;
    const gatesCost = watchedValues.gates * 297;
    const simplePanelsCost = watchedValues.simplePanels * 220;
    const complexPanelsCost = watchedValues.complexPanels * 385;
    const earthingCost = watchedValues.earthingRequired ? watchedValues.linearMeters * 150 : 0;
    
    const totalCost = linearCost + gatesCost + simplePanelsCost + complexPanelsCost + earthingCost;
    
    return {
      linearCost,
      gatesCost,
      freeGateDiscount: 0,
      simplePanelsCost,
      complexPanelsCost,
      earthingCost,
      totalCost,
    };
  };
  
  const costs = calculateCosts();

  const onSubmit = async (data: FTMFencingFormValues) => {
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
      // Use type assertion to bypass TypeScript type checking
      const { data: existingRecord } = await supabase
        .from('flat_top_metal_fencing' as any)
        .select('id')
        .eq('customer_id', customerId)
        .eq('pool_id', poolId)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        // Use type assertion to bypass TypeScript type checking
        result = await supabase
          .from('flat_top_metal_fencing' as any)
          .update(fencingData)
          .eq('id', (existingRecord as any).id);
      } else {
        // Insert new record
        // Use type assertion to bypass TypeScript type checking
        result = await supabase
          .from('flat_top_metal_fencing' as any)
          .insert(fencingData);
      }
      
      const { error } = result;
      
      if (error) {
        throw error;
      }
      
      toast.success("Flat top metal fencing configuration saved successfully");
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
