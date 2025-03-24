
import React, { createContext, useContext, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CraneCost } from "@/types/crane-cost";
import { DigType } from "@/types/dig-type";
import { PoolFormValues, poolSchema } from "@/types/pool";

// Define the steps in our wizard
export type WizardStep = 
  | "basic-info" 
  | "pool-costs" 
  | "excavation" 
  | "crane" 
  | "filtration" 
  | "pricing" 
  | "review";

// Context state interface
interface PoolWizardContextType {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  form: ReturnType<typeof useForm<PoolFormValues>>;
  isSubmitting: boolean;
  submitPool: () => Promise<void>;
  craneCosts: CraneCost[] | undefined;
  digTypes: DigType[] | undefined;
  isLoading: boolean;
  selectedCraneId: string | null;
  setSelectedCraneId: (id: string | null) => void;
  selectedDigTypeId: string | null;
  setSelectedDigTypeId: (id: string | null) => void;
  marginPercentage: number;
  setMarginPercentage: (value: number) => void;
}

// Create context with default values
const PoolWizardContext = createContext<PoolWizardContextType | undefined>(undefined);

// Order of steps
const steps: WizardStep[] = [
  "basic-info",
  "pool-costs",
  "excavation",
  "crane",
  "filtration",
  "pricing",
  "review"
];

export const PoolWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [craneCosts, setCraneCosts] = useState<CraneCost[]>();
  const [digTypes, setDigTypes] = useState<DigType[]>();
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  const [selectedDigTypeId, setSelectedDigTypeId] = useState<string | null>(null);
  const [marginPercentage, setMarginPercentage] = useState(20); // Default 20%
  
  const navigate = useNavigate();
  
  // Initialize form with zod resolver
  const form = useForm<PoolFormValues>({
    resolver: zodResolver(poolSchema),
    defaultValues: {
      name: "",
      range: "",
      length: 0,
      width: 0,
      depth_shallow: 0,
      depth_deep: 0,
      waterline_l_m: null,
      volume_liters: null,
      salt_volume_bags: null,
      salt_volume_bags_fixed: null,
      weight_kg: null,
      minerals_kg_initial: null,
      minerals_kg_topup: null,
      buy_price_ex_gst: null,
      buy_price_inc_gst: null,
    },
    mode: "onChange"
  });

  // Navigate between steps
  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Load required data for the wizard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch crane costs
        const { data: craneData, error: craneError } = await supabase
          .from("crane_costs")
          .select("*")
          .order("display_order");
          
        if (craneError) throw craneError;
        setCraneCosts(craneData);
        
        // Set default crane if available (Franna)
        const frannaCrane = craneData?.find(crane => 
          crane.name === "Franna Crane-S20T-L1"
        );
        if (frannaCrane) {
          setSelectedCraneId(frannaCrane.id);
        }
        
        // Fetch dig types
        const { data: digTypeData, error: digTypeError } = await supabase
          .from("dig_types")
          .select("*");
          
        if (digTypeError) throw digTypeError;
        setDigTypes(digTypeData);
        
        // Fetch pool ranges for the dropdown
        const { data: rangesData, error: rangesError } = await supabase
          .from("pool_ranges")
          .select("name")
          .order("display_order");
          
        if (rangesError) throw rangesError;
        
      } catch (error) {
        console.error("Error loading wizard data:", error);
        toast.error("Failed to load required data for the wizard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Submit all data 
  const submitPool = async () => {
    try {
      setIsSubmitting(true);
      
      // Get form values
      const values = form.getValues();
      
      // 1. Create the pool record
      const { data: poolData, error: poolError } = await supabase
        .from("pool_specifications")
        .insert([values])
        .select()
        .single();
        
      if (poolError) throw poolError;
      
      const poolId = poolData.id;
      
      // 2. Create pool costs record
      const poolCostsData = {
        pool_id: poolId,
        pea_gravel: 0,
        install_fee: 0,
        trucked_water: 0,
        salt_bags: 0,
        misc: 2700,
        coping_supply: 0,
        beam: 0,
        coping_lay: 0
      };
      
      const { error: costsError } = await supabase
        .from("pool_costs")
        .insert([poolCostsData]);
        
      if (costsError) throw costsError;
      
      // 3. If a dig type was selected, create the match
      if (selectedDigTypeId) {
        const { error: digTypeError } = await supabase
          .from("pool_dig_type_matches")
          .insert([{
            pool_id: poolId,
            dig_type_id: selectedDigTypeId
          }]);
          
        if (digTypeError) throw digTypeError;
      }
      
      // 4. If a crane was selected, create the selection
      if (selectedCraneId) {
        const { error: craneError } = await supabase
          .from("pool_crane_selections")
          .insert([{
            pool_id: poolId,
            crane_id: selectedCraneId
          }]);
          
        if (craneError) throw craneError;
      }
      
      // 5. Create margin record
      const { error: marginError } = await supabase
        .from("pool_margins")
        .insert([{
          pool_id: poolId,
          margin_percentage: marginPercentage
        }]);
        
      if (marginError) throw marginError;
      
      toast.success("Pool created successfully!");
      navigate(`/price-builder/pool/${poolId}`);
      
    } catch (error) {
      console.error("Error submitting pool:", error);
      toast.error("Failed to create pool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PoolWizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
        form,
        isSubmitting,
        submitPool,
        craneCosts,
        digTypes,
        isLoading,
        selectedCraneId,
        setSelectedCraneId,
        selectedDigTypeId,
        setSelectedDigTypeId,
        marginPercentage,
        setMarginPercentage
      }}
    >
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </PoolWizardContext.Provider>
  );
};

// Custom hook to use the context
export const usePoolWizard = () => {
  const context = useContext(PoolWizardContext);
  if (context === undefined) {
    throw new Error("usePoolWizard must be used within a PoolWizardProvider");
  }
  return context;
};
