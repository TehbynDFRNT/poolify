
import { useState } from "react";

export const useMarginCalculator = () => {
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempMargin, setTempMargin] = useState<string>("");

  const handleStartEdit = (poolId: string) => {
    setEditingId(poolId);
    setTempMargin(margins[poolId]?.toString() || "");
  };

  const handleSave = (poolId: string) => {
    const numValue = parseFloat(tempMargin) || 0;
    const clampedValue = Math.min(numValue, 99.9);
    setMargins(prev => ({
      ...prev,
      [poolId]: clampedValue
    }));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempMargin("");
  };

  return {
    margins,
    editingId,
    tempMargin,
    setTempMargin,
    handleStartEdit,
    handleSave,
    handleCancel
  };
};
