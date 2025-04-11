
import { useState } from "react";

// Quantum sanitation data
const quantumSanitationData = [
  {
    id: "4",
    model_number: "Quantum UV Sanitation",
    cost_price: 1750,
    margin: 1350,
    total: 3100,
    description: "UV sanitation system for pool water purification"
  }
];

// Pool management data
const poolManagementData = [
  {
    id: "5",
    model_number: "THERAPM6002 (Main Controller)",
    cost_price: 1427,
    margin: 550,
    total: 1977,
    description: "Pool Manager main controller unit"
  },
  {
    id: "6",
    model_number: "THERAPM6002 plus THERAPM6010E (Ten amp slave)",
    cost_price: 1677,
    margin: 700,
    total: 2377,
    description: "Pool Manager with ten amp slave unit"
  },
  {
    id: "7",
    model_number: "THERAPM6002 plus THERAPM6010E + THERAPM6015E(15amp)",
    cost_price: 1692,
    margin: 700,
    total: 2392,
    description: "Pool Manager with ten amp and fifteen amp slave units"
  }
];

export const useHardwareUpgrades = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPoolManagement = poolManagementData.filter((upgrade) => {
    const search = searchTerm.toLowerCase();
    return (
      upgrade.model_number.toLowerCase().includes(search) ||
      upgrade.description.toLowerCase().includes(search)
    );
  });

  const filteredQuantumSanitation = quantumSanitationData.filter((upgrade) => {
    const search = searchTerm.toLowerCase();
    return (
      upgrade.model_number.toLowerCase().includes(search) ||
      upgrade.description.toLowerCase().includes(search)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredPoolManagement,
    filteredQuantumSanitation
  };
};
