
import { useState } from "react";
import { UnderFenceConcreteStrip } from "@/types/under-fence-concrete-strip";
import { UnderFenceConcreteStripSelection } from "../../types";

export const useUnderFenceStrips = (
  initialStrips: UnderFenceConcreteStripSelection[],
  onUpdateStrips: (strips: UnderFenceConcreteStripSelection[]) => void
) => {
  // Add a concrete strip with quantity 1
  const handleAddStrip = (strip: UnderFenceConcreteStrip) => {
    const existingStrip = initialStrips.find(s => s.id === strip.id);
    
    if (existingStrip) {
      // If already exists, update quantity
      const updatedStrips = initialStrips.map(s => 
        s.id === strip.id ? { ...s, quantity: s.quantity + 1 } : s
      );
      onUpdateStrips(updatedStrips);
    } else {
      // Add new strip with quantity 1
      onUpdateStrips([...initialStrips, { 
        id: strip.id, 
        type: strip.type, 
        cost: strip.cost,
        margin: strip.margin,
        quantity: 1 
      }]);
    }
  };
  
  // Update quantity of a concrete strip
  const handleUpdateQuantity = (stripId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedStrips = initialStrips.filter(s => s.id !== stripId);
      onUpdateStrips(updatedStrips);
    } else {
      // Update quantity
      const updatedStrips = initialStrips.map(s => 
        s.id === stripId ? { ...s, quantity } : s
      );
      onUpdateStrips(updatedStrips);
    }
  };
  
  // Remove a concrete strip
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = initialStrips.filter(s => s.id !== stripId);
    onUpdateStrips(updatedStrips);
  };
  
  // Calculate total cost
  const calculateTotalCost = () => {
    return initialStrips.reduce((total, strip) => 
      total + (strip.cost * strip.quantity), 0
    );
  };

  return {
    handleAddStrip,
    handleUpdateQuantity,
    handleRemoveStrip,
    calculateTotalCost
  };
};
