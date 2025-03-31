
import { useState, useEffect } from "react";

export const usePageSaveState = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };
  
  const markAsSaved = () => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };
  
  return {
    hasUnsavedChanges,
    lastSaved,
    markAsChanged,
    markAsSaved
  };
};
