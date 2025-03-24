
import React, { createContext, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { PoolFormValues, poolSchema } from "@/types/pool";
import { usePoolWizardData } from "./usePoolWizardData";
import { usePoolSubmission } from "./usePoolSubmission";
import { useWizardNavigation } from "./useWizardNavigation";
import { PoolWizardContextType } from "./types";

// Create context with default values
const PoolWizardContext = createContext<PoolWizardContextType | undefined>(undefined);

export const PoolWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  const [selectedDigTypeId, setSelectedDigTypeId] = useState<string | null>(null);
  const [marginPercentage, setMarginPercentage] = useState(20); // Default 20%
  
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

  // Use the custom hooks
  const { isLoading, craneCosts, digTypes } = usePoolWizardData();
  const { currentStep, setCurrentStep, nextStep, previousStep } = useWizardNavigation();
  const { isSubmitting, submitPool } = usePoolSubmission({ 
    form, 
    selectedCraneId, 
    selectedDigTypeId, 
    marginPercentage 
  });

  // Set default crane if available
  React.useEffect(() => {
    if (craneCosts && craneCosts.length > 0 && !selectedCraneId) {
      const frannaCrane = craneCosts.find(crane => 
        crane.name === "Franna Crane-S20T-L1"
      );
      if (frannaCrane) {
        setSelectedCraneId(frannaCrane.id);
      }
    }
  }, [craneCosts, selectedCraneId]);

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
