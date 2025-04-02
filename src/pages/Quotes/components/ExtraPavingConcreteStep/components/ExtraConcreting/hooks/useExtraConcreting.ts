
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ExtraConcreting } from '@/types/extra-concreting';

export const useExtraConcreting = (onChanged?: () => void) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [meterage, setMeterage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extraConcretingItems, setExtraConcretingItems] = useState<ExtraConcreting[]>([]);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Handle type change
  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
    // Recalculate cost whenever type changes
    const selectedItem = extraConcretingItems.find(item => item.id === value);
    if (selectedItem && meterage > 0) {
      setTotalCost(selectedItem.price * meterage);
    }
  }, [extraConcretingItems, meterage]);

  // Handle meterage change
  const handleMeterageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMeterage(isNaN(value) ? 0 : value);
    
    // Recalculate cost whenever meterage changes
    const selectedItem = extraConcretingItems.find(item => item.id === selectedType);
    if (selectedItem && value > 0) {
      setTotalCost(selectedItem.price * value);
    } else {
      setTotalCost(0);
    }
  }, [selectedType, extraConcretingItems]);

  // Get selected price
  const getSelectedPrice = useCallback(() => {
    const selectedItem = extraConcretingItems.find(item => item.id === selectedType);
    return selectedItem ? selectedItem.price : 0;
  }, [selectedType, extraConcretingItems]);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      // Implement save logic if required
      toast.success("Extra concreting saved successfully.");
      if (onChanged) {
        onChanged();
      }
      setHasExistingData(true);
    } catch (error) {
      toast.error("Failed to save extra concreting.");
      console.error("Error saving extra concreting:", error);
    }
  }, [selectedType, meterage, onChanged]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      // Implement delete logic if required
      toast.success("Extra concreting removed successfully.");
      
      // Reset form
      setSelectedType('');
      setMeterage(0);
      setTotalCost(0);
      setHasExistingData(false);
      
      if (onChanged) {
        onChanged();
      }
    } catch (error) {
      toast.error("Failed to remove extra concreting.");
      console.error("Error removing extra concreting:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [onChanged]);

  return {
    selectedType,
    meterage,
    totalCost,
    extraConcretingItems,
    isLoading,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice,
    hasExistingData,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
    handleSave
  };
};
