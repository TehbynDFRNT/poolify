
import { useState } from "react";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { PoolCleaner } from "@/types/pool-cleaner";

export const usePoolCleanerEditing = () => {
  const { updatePoolCleaner } = usePoolCleaners();
  const [editingCells, setEditingCells] = useState<Record<string, Record<string, boolean>>>({});
  const [editValues, setEditValues] = useState<Record<string, Record<string, any>>>({});

  const handleEditStart = (id: string, field: string, initialValue: any) => {
    setEditingCells((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: true },
    }));

    // Initialize edit values if they don't exist
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: initialValue,
      },
    }));
  };

  const handleEditCancel = (id: string, field: string) => {
    setEditingCells((prev) => {
      const newState = { ...prev };
      if (newState[id]) {
        newState[id] = { ...newState[id], [field]: false };
      }
      return newState;
    });
  };

  const handleEditSave = (id: string, field: string) => {
    const updates: Partial<PoolCleaner> = {};
    
    if (editValues[id] && editValues[id][field] !== undefined) {
      if (field === 'price' || field === 'cost_price') {
        const value = parseFloat(editValues[id][field]);
        updates[field] = value;
        
        // If price or cost_price was updated, also update the margin
        const currentValues = editValues[id] || {};
        const poolCleaners = (window as any).__POOL_CLEANERS__ || [];
        const cleaner = poolCleaners.find((c: PoolCleaner) => c.id === id);
        
        if (cleaner) {
          const updatedPrice = field === 'price' ? value : (currentValues.price !== undefined ? parseFloat(currentValues.price) : cleaner.price);
          const updatedCostPrice = field === 'cost_price' ? value : (currentValues.cost_price !== undefined ? parseFloat(currentValues.cost_price) : cleaner.cost_price);
          
          // Calculate new margin
          const marginAmount = updatedPrice - updatedCostPrice;
          const margin = Math.round((marginAmount / updatedPrice) * 100);
          
          // Add margin to updates
          updates.margin = margin;
        }
      } else {
        updates[field] = editValues[id][field];
      }
      
      updatePoolCleaner({ id, updates });
    }

    handleEditCancel(id, field);
  };

  const handleEditChange = (id: string, field: string, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string, field: string) => {
    if (e.key === "Enter") {
      handleEditSave(id, field);
    } else if (e.key === "Escape") {
      handleEditCancel(id, field);
    }
  };

  return {
    editingCells,
    editValues,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
    handleEditChange,
    handleEditKeyDown
  };
};
