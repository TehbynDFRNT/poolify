
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FencingFormValues, CostCalculation } from "../types";

export const useFlatTopMetalFencingForm = (
  customerId: string, 
  poolId: string,
  onSaveSuccess?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingDataId, setExistingDataId] = useState<string | null>(null);
  const [costs, setCosts] = useState<CostCalculation>({
    linearCost: 0,
    gatesCost: 0,
    freeGateDiscount: 0,
    simplePanelsCost: 0,
    complexPanelsCost: 0,
    earthingCost: 0,
    totalCost: 0
  });

  // Initialize form with default values
  const form = useForm<FencingFormValues>({
    defaultValues: {
      linearMeters: 0,
      gates: 0,
      simplePanels: 0,
      complexPanels: 0,
      earthingRequired: false
    }
  });

  // Watch for form changes to calculate costs in real-time
  const linearMeters = form.watch("linearMeters");
  const gates = form.watch("gates");
  const simplePanels = form.watch("simplePanels");
  const complexPanels = form.watch("complexPanels");
  const earthingRequired = form.watch("earthingRequired");

  // Load existing data if available
  useEffect(() => {
    const loadExistingData = async () => {
      if (!customerId) return;

      const { data, error } = await supabase
        .from("flat_top_metal_fencing")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1) as any; // Type assertion until Supabase types are updated

      if (error) {
        console.error("Error loading flat top metal fencing data:", error);
        return;
      }

      if (data && data.length > 0) {
        const fencingData = data[0];
        setExistingDataId(fencingData.id);
        form.reset({
          linearMeters: fencingData.linear_meters,
          gates: fencingData.gates,
          simplePanels: fencingData.simple_panels,
          complexPanels: fencingData.complex_panels,
          earthingRequired: fencingData.earthing_required
        });
      }
    };

    loadExistingData();
  }, [customerId, form]);

  // Calculate costs whenever form values change
  useEffect(() => {
    const linearCost = linearMeters * 165;
    const gatesCost = gates * 297;
    const simplePanelsCost = simplePanels * 220;
    const complexPanelsCost = complexPanels * 385;
    // Fixed cost of $150 for earthing if required
    const earthingCost = earthingRequired ? 150 : 0;

    const totalCost = linearCost + gatesCost + simplePanelsCost + complexPanelsCost + earthingCost;

    setCosts({
      linearCost,
      gatesCost,
      freeGateDiscount: 0, // No free gate discount for flat top metal
      simplePanelsCost,
      complexPanelsCost,
      earthingCost,
      totalCost
    });
  }, [linearMeters, gates, simplePanels, complexPanels, earthingRequired]);

  // Handle form submission
  const onSubmit = async (values: FencingFormValues) => {
    if (!customerId) {
      toast.error("Customer ID is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if an entry already exists
      const { data: existingData, error: fetchError } = await supabase
        .from("flat_top_metal_fencing")
        .select("id")
        .eq("customer_id", customerId)
        .limit(1) as any; // Type assertion until Supabase types are updated

      if (fetchError) {
        throw fetchError;
      }

      let saveError;

      if (existingData && existingData.length > 0) {
        // Update existing entry
        const { error } = await supabase
          .from("flat_top_metal_fencing")
          .update({
            linear_meters: values.linearMeters,
            gates: values.gates,
            simple_panels: values.simplePanels,
            complex_panels: values.complexPanels,
            earthing_required: values.earthingRequired,
            total_cost: costs.totalCost,
            pool_id: poolId
          })
          .eq("id", existingData[0].id) as any; // Type assertion until Supabase types are updated

        saveError = error;
        if (!error) {
          setExistingDataId(existingData[0].id);
        }
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from("flat_top_metal_fencing")
          .insert({
            customer_id: customerId,
            pool_id: poolId,
            linear_meters: values.linearMeters,
            gates: values.gates,
            simple_panels: values.simplePanels,
            complex_panels: values.complexPanels,
            earthing_required: values.earthingRequired,
            total_cost: costs.totalCost
          })
          .select() as any; // Type assertion until Supabase types are updated

        saveError = error;
        if (!error && data) {
          setExistingDataId(data[0].id);
        }
      }

      if (saveError) {
        throw saveError;
      }

      toast.success("Flat top metal fencing saved successfully");
      
      // Call the callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving flat top metal fencing:", error);
      toast.error("Failed to save fencing details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const onDelete = async () => {
    if (!customerId || !existingDataId) {
      toast.error("No fencing data to delete");
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("flat_top_metal_fencing")
        .delete()
        .eq("id", existingDataId);

      if (error) {
        throw error;
      }

      toast.success("Flat top metal fencing removed successfully");
      
      // Reset form after deletion
      form.reset({
        linearMeters: 0,
        gates: 0,
        simplePanels: 0,
        complexPanels: 0,
        earthingRequired: false
      });
      
      setExistingDataId(null);
      
      // Call the callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error deleting fencing:", error);
      toast.error("Failed to delete fencing");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    costs,
    isSubmitting,
    isDeleting,
    hasExistingData: !!existingDataId,
    onSubmit,
    onDelete
  };
};
