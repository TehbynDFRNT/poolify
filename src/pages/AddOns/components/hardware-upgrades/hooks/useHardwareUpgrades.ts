
import { useState } from "react";

// Types for the hardware upgrades
type QuantumSanitationItem = {
  id: string;
  model_number: string;
  cost_price: number;
  margin: number;
  total: number;
  description: string;
};

type PoolManagementItem = {
  id: string;
  name: string;
  model: string;
  cost_price: number;
  margin: number;
  total: number;
  description: string;
};

export const useHardwareUpgrades = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data for quantum sanitation
  const quantumSanitation: QuantumSanitationItem[] = [
    {
      id: "1",
      model_number: "QUV-25",
      cost_price: 1250,
      margin: 625,
      total: 1875,
      description: "Quantum UV Sanitizer 25,000L"
    },
    {
      id: "2",
      model_number: "QUV-50",
      cost_price: 1875,
      margin: 925,
      total: 2800,
      description: "Quantum UV Sanitizer 50,000L"
    }
  ];

  // Sample data for pool management
  const poolManagement: PoolManagementItem[] = [
    {
      id: "1",
      name: "AquaLink Control System",
      model: "AQL-PS-4",
      cost_price: 980,
      margin: 420,
      total: 1400,
      description: "4-device pool and spa automation system"
    },
    {
      id: "2",
      name: "EasyTouch Control System",
      model: "ET-8",
      cost_price: 1150,
      margin: 550,
      total: 1700,
      description: "8-circuit automation control for pool/spa applications"
    }
  ];

  // Filter data based on search term
  const filteredPoolManagement = poolManagement.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuantumSanitation = quantumSanitation.filter(item =>
    item.model_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredPoolManagement,
    filteredQuantumSanitation
  };
};
