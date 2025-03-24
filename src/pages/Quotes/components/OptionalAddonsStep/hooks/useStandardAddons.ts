
import { useState } from "react";
import { Addon } from "../types";
import { UseStandardAddonsReturn } from "./types";

// Define placeholder addons but don't use them in the final implementation 
// since this is just a placeholder component
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
  return {
    addons: [],
    toggleAddon: () => {},
    updateQuantity: () => {}
  };
};
