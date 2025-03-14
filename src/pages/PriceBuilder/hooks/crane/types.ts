
import { CraneCost } from "@/types/crane-cost";

export interface CraneSelection {
  pool_id: string;
  crane_id: string;
}

export interface UseCraneSelectionResult {
  craneCosts: CraneCost[] | undefined;
  selectedCraneId: string | null;
  setSelectedCraneId: (id: string) => void;
  selectedCrane: CraneCost | undefined;
  frannaCrane: CraneCost | undefined;
  isLoading: boolean;
  saveCraneSelection: () => void;
  isSaving: boolean;
}
