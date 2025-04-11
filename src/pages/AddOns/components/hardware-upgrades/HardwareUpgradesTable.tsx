
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Hardware upgrades data
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

export const HardwareUpgradesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

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

  const handleAddClick = () => {
    toast({
      title: "Add Hardware Upgrade",
      description: "This feature will be implemented soon.",
    });
  };

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
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quantum UV</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuantumSanitation.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No quantum sanitation products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuantumSanitation.map((upgrade) => (
                      <TableRow key={upgrade.id}>
                        <TableCell>{upgrade.model_number}</TableCell>
                        <TableCell className="text-right">${upgrade.cost_price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${upgrade.margin.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${upgrade.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* No duplicate title here */}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pool management..."
                    className="pl-8 w-[200px] md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="flex items-center gap-2" onClick={handleAddClick}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Hardware</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool Manager Controllers</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPoolManagement.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No pool management hardware found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPoolManagement.map((upgrade) => (
                      <TableRow key={upgrade.id}>
                        <TableCell>{upgrade.model_number}</TableCell>
                        <TableCell className="text-right">${upgrade.cost_price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${upgrade.margin.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${upgrade.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
