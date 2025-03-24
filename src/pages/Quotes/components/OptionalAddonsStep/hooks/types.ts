
import { Addon } from "../types";
import { CustomRequirement } from "../types";

export interface AddonsState {
  addons: Addon[];
  isSubmitting: boolean;
}

export interface UseStandardAddonsReturn {
  addons: Addon[];
  toggleAddon: (id: string) => void;
  updateQuantity: (id: string, increment: boolean) => void;
}

export interface UseCustomRequirementsReturn {
  customRequirements: CustomRequirement[];
  addCustomRequirement: () => void;
  removeCustomRequirement: (id: string) => void;
  updateCustomRequirement: (id: string, field: 'description' | 'price', value: string) => void;
}

export interface UseMicroDigReturn {
  microDigRequired: boolean;
  setMicroDigRequired: (value: boolean) => void;
  microDigPrice: number;
  setMicroDigPrice: (value: number) => void;
  microDigNotes: string;
  setMicroDigNotes: (value: string) => void;
}
