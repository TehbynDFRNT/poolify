
import { usePavingDataIntegration } from "./usePavingDataIntegration";

// This is now a simple wrapper around the integration hook for backward compatibility
export const useExtraPavingData = (onNext?: () => void) => {
  return usePavingDataIntegration(onNext);
};
