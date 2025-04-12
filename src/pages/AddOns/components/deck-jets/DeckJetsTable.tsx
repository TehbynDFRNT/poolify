
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";

// Sample data for deck jets
const sampleDeckJets = [
  {
    id: "1",
    quantity: 2,
    cost_price: 715,
    margin: 360,
    total: 1075,
    description: "Standard deck jets package with 2 jets"
  },
  {
    id: "2",
    quantity: 4,
    cost_price: 885,
    margin: 465,
    total: 1350,
    description: "Premium deck jets package with 4 jets"
  }
];

export const DeckJetsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeckJets = sampleDeckJets.filter((jet) => {
    const search = searchTerm.toLowerCase();
    return (
      jet.quantity.toString().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Deck Jets</CardTitle>
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
                  placeholder="Search deck jets..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Deck Jet</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeckJets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No deck jets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeckJets.map((jet) => (
                    <TableRow key={jet.id}>
                      <TableCell>{jet.quantity} Jets</TableCell>
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
