
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Sun } from "lucide-react";
import { QuantumSanitationTable } from "./QuantumSanitationTable";
import { PoolManagementTable } from "./PoolManagementTable";
import { useHardwareUpgrades } from "./hooks/useHardwareUpgrades";

export const HardwareUpgradesTable = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredPoolManagement, 
    filteredQuantumSanitation 
  } = useHardwareUpgrades();

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
