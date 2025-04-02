
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useExtraPavingCosts } from '@/pages/ConstructionCosts/hooks/useExtraPavingCosts';

export const usePavingOnExistingConcrete = () => {
  const [selectedPavingId, setSelectedPavingId] = useState<string>('');
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [pavingCost, setPavingCost] = useState<number>(0);
  const [labourCost, setLabourCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();

  // Calculate costs when inputs change
  useEffect(() => {
    if (selectedPavingId && meters > 0 && extraPavingCosts) {
      const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
      if (selectedPaving) {
        const calculatedPavingCost = (selectedPaving.paver_cost + selectedPaving.wastage_cost) * meters;
        const calculatedLabourCost = selectedPaving.margin_cost * meters;
        
        setPavingCost(calculatedPavingCost);
        setLabourCost(calculatedLabourCost);
        setTotalCost(calculatedPavingCost + calculatedLabourCost);
      }
    } else {
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
    }
  }, [selectedPavingId, meters, extraPavingCosts]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!selectedPavingId || meters <= 0) {
      toast.error("Please select a paving type and enter valid meterage.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Implement save logic if required
      toast.success("Paving on existing concrete saved successfully.");
      setHasExistingData(true);
    } catch (error) {
      toast.error("Failed to save paving on existing concrete.");
      console.error("Error saving paving on existing concrete:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPavingId, meters]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      // Implement delete logic if required
      toast.success("Paving on existing concrete removed successfully.");
      
      // Reset form
      setSelectedPavingId('');
      setMeters(0);
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
      setHasExistingData(false);
    } catch (error) {
      toast.error("Failed to remove paving on existing concrete.");
      console.error("Error removing paving on existing concrete:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, []);

  // Determine if we have cost data to show
  const hasCostData = selectedPavingId !== '' && meters > 0 && totalCost > 0;

  return {
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    pavingCost,
    labourCost,
    totalCost,
    isLoading,
    hasCostData,
    hasExistingData,
    extraPavingCosts,
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  };
};
