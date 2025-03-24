
import { useState } from "react";
import { Addon } from "../types";
import { UseStandardAddonsReturn } from "./types";

const DEFAULT_ADDONS: Addon[] = [
  {
    id: "pool-cleaner",
    name: "Automatic Pool Cleaner",
    description: "Keeps your pool clean with minimal effort",
    price: 699,
    selected: false,
    quantity: 1
  },
  {
    id: "led-lighting",
    name: "LED Pool Lighting",
    description: "Illuminates your pool with energy-efficient LED lights",
    price: 499,
    selected: false,
    quantity: 1
  },
  {
    id: "heating-system",
    name: "Pool Heating System",
    description: "Extends your swimming season with temperature control",
    price: 1299,
    selected: false,
    quantity: 1
  },
  {
    id: "salt-system",
    name: "Salt Chlorination System",
    description: "Natural water treatment without harsh chemicals",
    price: 899,
    selected: false,
    quantity: 1
  },
  {
    id: "pool-cover",
    name: "Automatic Pool Cover",
    description: "Safety and heat retention with automated opening/closing",
    price: 1599,
    selected: false,
    quantity: 1
  }
];

export const useStandardAddons = (): UseStandardAddonsReturn => {
  const [addons, setAddons] = useState<Addon[]>(DEFAULT_ADDONS);

  const toggleAddon = (id: string) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        return { ...addon, selected: !addon.selected };
      }
      return addon;
    }));
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        const newQuantity = increment 
          ? addon.quantity + 1 
          : Math.max(1, addon.quantity - 1);
        return { ...addon, quantity: newQuantity };
      }
      return addon;
    }));
  };

  return {
    addons,
    toggleAddon,
    updateQuantity
  };
};
