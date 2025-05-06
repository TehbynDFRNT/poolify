
import { useState } from "react";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { toast } from "sonner";

export const usePoolCleanerEditing = () => {
  const { updatePoolCleaner } = usePoolCleaners();
  const [editingCells, setEditingCells] = useState<Record<string, Record<string, boolean>>>({});
  const [editValues, setEditValues] = useState<Record<string, Record<string, any>>>({});

  const handleEditStart = (cleanerId: string, field: string, value: any) => {
    setEditingCells((prev) => ({
      ...prev,
      [cleanerId]: {
        ...(prev[cleanerId] || {}),
        [field]: true
      }
    }));
    
    setEditValues((prev) => ({
      ...prev,
      [cleanerId]: {
        ...(prev[cleanerId] || {}),
        [field]: value
      }
    }));
  };

  const handleEditCancel = (cleanerId: string, field: string) => {
    setEditingCells((prev) => ({
      ...prev,
      [cleanerId]: {
        ...(prev[cleanerId] || {}),
        [field]: false
      }
    }));
  };

  const handleEditChange = (cleanerId: string, field: string, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [cleanerId]: {
        ...(prev[cleanerId] || {}),
        [field]: value
      }
    }));
  };

  const handleEditSave = (cleanerId: string, field: string) => {
    try {
      const value = editValues[cleanerId][field];
      
      // Validate value
      if (field === 'name' && !value.trim()) {
        toast.error("Name cannot be empty");
        return;
      }
      
      if ((field === 'rrp' || field === 'trade') && (isNaN(Number(value)) || Number(value) < 0)) {
        toast.error(`${field.toUpperCase()} must be a valid number`);
        return;
      }
      
      // Prepare update
      const updates: any = { [field]: value };
      
      // Special handling for trade and rrp to calculate margin
      if (field === 'trade' || field === 'rrp') {
        const margin = Math.round(((updates.rrp || editValues[cleanerId].rrp) - 
                                  (updates.trade || editValues[cleanerId].trade)) / 
                                  (updates.rrp || editValues[cleanerId].rrp) * 100);
        updates.margin = margin;
      }
      
      // Update the database
      updatePoolCleaner({ id: cleanerId, updates });
      
      // Reset the editing state
      handleEditCancel(cleanerId, field);
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, cleanerId: string, field: string) => {
    if (e.key === "Enter") {
      handleEditSave(cleanerId, field);
    } else if (e.key === "Escape") {
      handleEditCancel(cleanerId, field);
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
