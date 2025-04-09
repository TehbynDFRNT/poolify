
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WaterFeatureFormValues, WaterFeatureSummary, PoolWaterFeature } from "@/types/water-feature";
import { 
  WATER_FEATURE_SIZES, 
  LED_BLADE_OPTIONS, 
  BACK_CLADDING_PRICE,
  BACK_CLADDING_MARGIN
} from "./constants";

export const useWaterFeature = (customerId?: string | null, poolId?: string | null) => {
  const [summary, setSummary] = useState<WaterFeatureSummary>({
    basePrice: 0,
    baseMargin: 0,
    backCladdingPrice: 0,
    backCladdingMargin: 0,
    bladePrice: 0,
    bladeMargin: 0,
    totalCost: 0,
    selectedBladeName: "None",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingData, setExistingData] = useState<PoolWaterFeature | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WaterFeatureFormValues>({
    defaultValues: {
      waterFeatureSize: "",
      backCladdingNeeded: false,
      frontFinish: "none",
      topFinish: "none",
      sidesFinish: "none",
      ledBlade: "none",
    },
  });

  // Fetch existing water feature data if available
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!customerId || !poolId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("pool_water_features")
          .select("*")
          .eq("customer_id", customerId)
          .eq("pool_id", poolId)
          .single();
        
        if (error) {
          console.error("Error fetching water feature data:", error);
          return;
        }
        
        if (data) {
          setExistingData(data as PoolWaterFeature);
          form.reset({
            waterFeatureSize: data.water_feature_size,
            backCladdingNeeded: data.back_cladding_needed,
            frontFinish: data.front_finish,
            topFinish: data.top_finish,
            sidesFinish: data.sides_finish,
            ledBlade: data.led_blade,
          });
        }
      } catch (error) {
        console.error("Error fetching water feature data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [customerId, poolId, form]);

  // Calculate costs whenever form values change
  useEffect(() => {
    const calculateCosts = () => {
      const values = form.getValues();
      
      // Base cost from water feature size
      const selectedSize = WATER_FEATURE_SIZES.find(
        (size) => size.id === values.waterFeatureSize
      );
      const basePrice = selectedSize ? selectedSize.total : 0;
      const baseMargin = selectedSize ? selectedSize.margin : 0;
      
      // Back cladding cost and margin
      const backCladdingPrice = values.backCladdingNeeded ? BACK_CLADDING_PRICE : 0;
      const backCladdingMargin = values.backCladdingNeeded ? BACK_CLADDING_MARGIN : 0;
      
      // LED blade cost, margin and name
      const selectedBlade = LED_BLADE_OPTIONS.find(
        (blade) => blade.value === values.ledBlade
      );
      const bladePrice = selectedBlade ? selectedBlade.price : 0;
      const bladeMargin = selectedBlade ? selectedBlade.margin : 0;
      const selectedBladeName = selectedBlade ? selectedBlade.label : "None";
      
      // Total cost
      const totalCost = basePrice + backCladdingPrice + bladePrice;
      
      setSummary({
        basePrice,
        baseMargin,
        backCladdingPrice,
        backCladdingMargin,
        bladePrice,
        bladeMargin,
        totalCost,
        selectedBladeName,
      });
    };

    // Run calculation on mount and when form changes
    calculateCosts();
    
    // Subscribe to form changes
    const subscription = form.watch(() => calculateCosts());
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Function to save water feature data
  const saveWaterFeature = async (values: WaterFeatureFormValues) => {
    if (!customerId || !poolId) {
      toast.error("Missing customer or pool information");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        pool_id: poolId,
        customer_id: customerId,
        water_feature_size: values.waterFeatureSize,
        back_cladding_needed: values.backCladdingNeeded,
        front_finish: values.frontFinish,
        top_finish: values.topFinish,
        sides_finish: values.sidesFinish,
        led_blade: values.ledBlade,
        total_cost: summary.totalCost
      };

      let response;
      
      if (existingData) {
        // Update existing record
        response = await supabase
          .from("pool_water_features")
          .update(dataToSave)
          .eq("id", existingData.id);
      } else {
        // Insert new record
        response = await supabase
          .from("pool_water_features")
          .insert([dataToSave]);
      }

      if (response.error) {
        throw response.error;
      }
      
      toast.success("Water feature options saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving water feature:", error);
      toast.error("Failed to save water feature options");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete water feature
  const deleteWaterFeature = async () => {
    if (!customerId || !poolId || !existingData) {
      toast.error("No water feature options to remove");
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("pool_water_features")
        .delete()
        .eq("id", existingData.id);

      if (error) {
        throw error;
      }

      // Reset form and existingData
      form.reset({
        waterFeatureSize: "",
        backCladdingNeeded: false,
        frontFinish: "none",
        topFinish: "none",
        sidesFinish: "none",
        ledBlade: "none",
      });
      
      setExistingData(null);
      
      toast.success("Water feature options removed successfully");
      return true;
    } catch (error) {
      console.error("Error removing water feature:", error);
      toast.error("Failed to remove water feature options");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    summary,
    isSubmitting,
    isDeleting,
    isLoading,
    existingData,
    saveWaterFeature,
    deleteWaterFeature
  };
};
