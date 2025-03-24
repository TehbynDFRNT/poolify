
import { Addon, CustomRequirement } from "../types";

export interface AddonsState {
  addons: Addon[];
  customRequirements: CustomRequirement[];
  microDigRequired: boolean;
  microDigPrice: number;
  microDigNotes: string;
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
  setMicroDigRequired: (required: boolean) => void;
  microDigPrice: number;
  setMicroDigPrice: (price: number) => void;
  microDigNotes: string;
  setMicroDigNotes: (notes: string) => void;
}
