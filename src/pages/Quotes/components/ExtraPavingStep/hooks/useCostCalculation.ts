
import { useState, useCallback } from 'react';
import { ConcreteCutSelection, UnderFenceConcreteStripSelection } from '../types';

export const useCostCalculation = (concretePumpPrice: number = 0) => {
  // Calculate concrete cuts total cost
  const calculateConcreteCutsCost = useCallback((cuts: ConcreteCutSelection[]) => {
    if (!cuts || cuts.length === 0) return 0;
    
    return cuts.reduce((total, cut) => {
      const price = isNaN(cut.price) ? 0 : cut.price;
      const quantity = isNaN(cut.quantity) ? 0 : cut.quantity;
      return total + (price * quantity);
    }, 0);
  }, []);

  // Calculate under fence strips total cost
  const calculateUnderFenceStripsCost = useCallback((strips: UnderFenceConcreteStripSelection[]) => {
    if (!strips || strips.length === 0) return 0;
    
    return strips.reduce((total, strip) => {
      const cost = isNaN(strip.cost) ? 0 : strip.cost;
      const quantity = isNaN(strip.quantity) ? 0 : strip.quantity;
      return total + (cost * quantity);
    }, 0);
  }, []);

  // Get concrete pump cost when required
  const getConcretePumpCost = useCallback((isPumpRequired: boolean) => {
    if (isPumpRequired) {
      return concretePumpPrice;
    }
    return 0;
  }, [concretePumpPrice]);

  // Calculate the overall total cost
  const calculateTotalCost = useCallback((
    pavingTotalCost: number, 
    isPumpRequired: boolean, 
    concreteCuts: ConcreteCutSelection[], 
    underFenceStrips: UnderFenceConcreteStripSelection[]
  ) => {
    const pavingCost = isNaN(pavingTotalCost) ? 0 : pavingTotalCost;
    let total = pavingCost;
    
    // Add concrete pump cost if required
    if (isPumpRequired) {
      total += concretePumpPrice;
    }
    
    // Add concrete cuts cost
    total += calculateConcreteCutsCost(concreteCuts);
    
    // Add under fence strips cost
    total += calculateUnderFenceStripsCost(underFenceStrips);
    
    return total;
  }, [concretePumpPrice, calculateConcreteCutsCost, calculateUnderFenceStripsCost]);

  return {
    calculateConcreteCutsCost,
    calculateUnderFenceStripsCost,
    getConcretePumpCost,
    calculateTotalCost
  };
};
