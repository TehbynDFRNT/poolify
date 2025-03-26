
import { useConcreteCuts } from "@/pages/ConstructionCosts/hooks/useConcreteCuts";
import { ConcreteCut as ConcreteCutType } from "@/types/concrete-cut";
import { useCallback } from "react";
import { ConcreteCutSelection } from "../../types";

export const useConcreteCutsState = (
  selectedCuts: ConcreteCutSelection[],
  onUpdateCuts: (cuts: ConcreteCutSelection[]) => void
) => {
  const { concreteCuts, isLoading } = useConcreteCuts();
  
  // Add a concrete cut with quantity 1
  const handleAddCut = useCallback((cut: ConcreteCutType) => {
    const existingCut = selectedCuts.find(c => c.id === cut.id);
    
    if (existingCut) {
      // If already exists, update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cut.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      onUpdateCuts(updatedCuts);
    } else {
      // Add new cut with quantity 1
      onUpdateCuts([...selectedCuts, { 
        id: cut.id, 
        cut_type: cut.cut_type, 
        price: cut.price, 
        quantity: 1 
      }]);
    }
  }, [selectedCuts, onUpdateCuts]);
  
  // Update quantity of a concrete cut
  const handleUpdateQuantity = useCallback((cutId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
      onUpdateCuts(updatedCuts);
    } else {
      // Update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cutId ? { ...c, quantity } : c
      );
      onUpdateCuts(updatedCuts);
    }
  }, [selectedCuts, onUpdateCuts]);
  
  // Remove a concrete cut
  const handleRemoveCut = useCallback((cutId: string) => {
    const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
    onUpdateCuts(updatedCuts);
  }, [selectedCuts, onUpdateCuts]);
  
  // Calculate total cost
  const calculateTotalCost = useCallback(() => {
    return selectedCuts.reduce((total, cut) => 
      total + (cut.price * cut.quantity), 0
    );
  }, [selectedCuts]);
  
  // Group cuts by type
  const groupCuts = useCallback(() => {
    if (!concreteCuts) return { standardCuts: [], diagonalCuts: [] };
    
    const standardCuts = concreteCuts.filter(cut => 
      !cut.cut_type.toLowerCase().includes('diagonal')
    );
    
    const diagonalCuts = concreteCuts.filter(cut => 
      cut.cut_type.toLowerCase().includes('diagonal')
    );
    
    return { standardCuts, diagonalCuts };
  }, [concreteCuts]);

  return {
    concreteCuts,
    isLoading,
    handleAddCut,
    handleUpdateQuantity,
    handleRemoveCut,
    calculateTotalCost,
    groupCuts
  };
};
