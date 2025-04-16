
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Sun } from "lucide-react";
import { QuantumSanitationTable } from "./QuantumSanitationTable";
import { PoolManagementTable } from "./PoolManagementTable";

// Sample data for quantum sanitation
const sampleQuantumSanitation = [
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
const samplePoolManagement = [
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

export const HardwareUpgradesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredPoolManagement = samplePoolManagement.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuantumSanitation = sampleQuantumSanitation.filter(item =>
    item.model_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Quantum UV Sanitation Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            <CardTitle>Quantum UV Sanitation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <QuantumSanitationTable items={filteredQuantumSanitation} />
          </div>
        </CardContent>
      </Card>

      {/* Pool Management Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <CardTitle>Pool Management & Automation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PoolManagementTable 
              items={filteredPoolManagement}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
