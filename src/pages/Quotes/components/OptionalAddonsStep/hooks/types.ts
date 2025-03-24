
import { Addon } from "../types";

export interface AddonsState {
  addons: Addon[];
  isSubmitting: boolean;
}

export interface UseStandardAddonsReturn {
  addons: Addon[];
  toggleAddon: (id: string) => void;
  updateQuantity: (id: string, increment: boolean) => void;
}
