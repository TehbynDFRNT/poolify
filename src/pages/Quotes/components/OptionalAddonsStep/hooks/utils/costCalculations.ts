
import { Addon, CustomRequirement } from "../../types";

export const calculateAddonsCost = (
  addons: Addon[], 
  customRequirements: CustomRequirement[], 
  microDigRequired: boolean, 
  microDigPrice: number
): number => {
  const standardAddonsCost = addons.reduce((total, addon) => {
    if (addon.selected) {
      return total + (addon.price * addon.quantity);
    }
    return total;
  }, 0);
  
  const customRequirementsCost = customRequirements.reduce((total, requirement) => {
    return total + (Number(requirement.price) || 0);
  }, 0);
  
  const microDigCost = microDigRequired ? Number(microDigPrice) : 0;
  
  return standardAddonsCost + customRequirementsCost + microDigCost;
};
