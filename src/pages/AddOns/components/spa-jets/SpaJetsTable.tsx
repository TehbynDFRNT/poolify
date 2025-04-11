
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";

// Updated sample data for spa jets
const sampleSpaJets = [
  {
    id: "1",
    model_number: "ASF440",
    cost_price: 145,
    margin: 75,
    total: 220,
    description: "Standard spa jet with adjustable flow control"
  },
  {
    id: "2",
    model_number: "Spa Jet Pump",
    cost_price: 800,
    margin: 200,
    total: 1000,
    description: "Pump for spa jets"
  },
  {
    id: "3",
    model_number: "Round Pool 23 Spa Jet Upgrade",
    cost_price: 3500,
    margin: 1000,
    total: 4500,
    description: "Complete spa jet upgrade package for Round Pool 23"
  },
  {
    id: "4",
    model_number: "Pepper Pots",
    cost_price: 1200,
    margin: 600,
    total: 1850,
    description: "Pepper pot style spa jets"
  }
];

export const SpaJetsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpaJets = sampleSpaJets.filter((jet) => {
    const search = searchTerm.toLowerCase();
    return (
      jet.model_number.toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Spa Jets</CardTitle>
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
                  placeholder="Search spa jets..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Spa Jet</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spa Jets</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpaJets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No spa jets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpaJets.map((jet) => (
                    <TableRow key={jet.id}>
                      <TableCell>{jet.model_number}</TableCell>
                      <TableCell className="text-right">${jet.cost_price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${jet.margin.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${jet.total.toLocaleString()}</TableCell>
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
  );
};
