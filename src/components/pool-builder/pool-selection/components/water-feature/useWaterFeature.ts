
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// Constants for water feature options
export const WATER_FEATURE_SIZES = [
  { 
    id: "small", 
    size: "1.6m x 0.8m", 
    basePrice: 3200,
    margin: 800,
    total: 3200, 
  },
  { 
    id: "medium", 
    size: "2m x 1m", 
    basePrice: 3500,
    margin: 900,
    total: 3500, 
  },
];

export const FRONT_FINISH_OPTIONS = [
  { value: "none", label: "None" },
  { value: "bag_washed", label: "Bag Washed" },
  { value: "stackstone", label: "Stackstone" },
  { value: "other", label: "Other" },
];

export const FINISH_OPTIONS = [
  { value: "none", label: "None" },
  { value: "coping_style", label: "Coping Style" },
  { value: "other", label: "Other" },
];

export const LED_BLADE_OPTIONS = [
  { value: "none", label: "None", price: 0, margin: 0 },
  { value: "900mm", label: "900mm LED Blade", price: 300, margin: 100 },
  { value: "1200mm", label: "1200mm LED Blade", price: 400, margin: 100 },
];

export const BACK_CLADDING_PRICE = 1000;
export const BACK_CLADDING_MARGIN = 300;

export interface WaterFeatureFormValues {
  waterFeatureSize: string;
  backCladdingNeeded: boolean;
  frontFinish: string;
  topFinish: string;
  sidesFinish: string;
  ledBlade: string;
}

interface WaterFeatureSummary {
  basePrice: number;
  baseMargin: number;
  backCladdingPrice: number;
  backCladdingMargin: number;
  bladePrice: number;
  bladeMargin: number;
  totalCost: number;
  selectedBladeName: string;
}

export const useWaterFeature = () => {
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

  return {
    form,
    summary,
    isSubmitting: form.formState.isSubmitting,
  };
};
