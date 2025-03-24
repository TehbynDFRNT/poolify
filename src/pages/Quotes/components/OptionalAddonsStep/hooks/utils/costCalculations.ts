import { Addon } from "../../types";

export const calculateAddonsCost = (addons: Addon[]): number => {
  const standardAddonsCost = addons.reduce((total, addon) => {
    if (addon.selected) {
      return total + (addon.price * addon.quantity);
    }
    return total;
  }, 0);
  
  return standardAddonsCost;
};
