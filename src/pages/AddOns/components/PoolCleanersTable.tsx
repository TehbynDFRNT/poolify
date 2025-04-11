
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brush } from "lucide-react";

// Sample data with modified model numbers (removed CL- prefix)
const sampleCleaners = [
  {
    id: "1",
    model_number: "S150",
    name: "Dolphin S150",
    price: 1400,
    cost_price: 1028,
    margin: 26.57,
    description: "Entry-level robotic pool cleaner suitable for small to medium pools."
  },
  {
    id: "2",
    model_number: "L400",
    name: "Dolphin Liberty 400",
    price: 2350,
    cost_price: 1844,
    margin: 21.53,
    description: "Cordless robotic pool cleaner with advanced navigation system."
  },
  {
    id: "3",
    model_number: "X6",
    name: "Dolphin X6",
    price: 2850,
    cost_price: 2128,
    margin: 25.33,
    description: "Premium robotic pool cleaner with multi-layer filtration and smart navigation."
  },
  {
    id: "4",
    model_number: "DB2",
    name: "Dolphin DB2",
    price: 2350,
    cost_price: 1028,
    margin: 56.26,
    description: "Commercial-grade robotic pool cleaner for larger pools."
  }
];

export const PoolCleanersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCleaners = sampleCleaners.filter((cleaner) => {
    const search = searchTerm.toLowerCase();
    return (
      cleaner.model_number.toLowerCase().includes(search) ||
      cleaner.name.toLowerCase().includes(search)
    );
  });

  // Calculate margin amount for display
  const calculateMarginAmount = (price: number, costPrice: number) => {
    return price - costPrice;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brush className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pool Cleaners</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cleaners..."
              className="pl-8 w-[200px] md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Cleaner</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">RRP</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCleaners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pool cleaners found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCleaners.map((cleaner) => (
                <TableRow key={cleaner.id}>
                  <TableCell>{cleaner.model_number}</TableCell>
                  <TableCell>{cleaner.name}</TableCell>
                  <TableCell className="text-right">${cleaner.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${cleaner.cost_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    ${calculateMarginAmount(cleaner.price, cleaner.cost_price).toLocaleString()}
                  </TableCell>
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
  );
};
