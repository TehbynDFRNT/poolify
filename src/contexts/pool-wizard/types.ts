
import { z } from "zod";
import { PoolFormValues, poolSchema } from "@/types/pool";
import { CraneCost } from "@/types/crane-cost";
import { DigType } from "@/types/dig-type";
import { UseFormReturn } from "react-hook-form";

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
export interface PoolWizardContextType {
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  form: UseFormReturn<PoolFormValues>;
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

// Steps order
export const WIZARD_STEPS: WizardStep[] = [
  "basic-info",
  "pool-costs",
  "excavation",
  "crane",
  "filtration",
  "pricing",
  "review"
];
