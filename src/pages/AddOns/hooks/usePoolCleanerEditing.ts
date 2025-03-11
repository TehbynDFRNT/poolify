
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
      if (field === 'price' || field === 'margin' || field === 'cost_price') {
        updates[field] = parseFloat(editValues[id][field]);
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
