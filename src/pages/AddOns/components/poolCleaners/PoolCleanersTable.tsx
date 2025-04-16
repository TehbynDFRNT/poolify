
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PoolCleanersActions } from "./PoolCleanersActions";
import { PoolCleanersTableHeader } from "./PoolCleanersTableHeader";
import { EmptyPoolCleanersState } from "./EmptyPoolCleanersState";

// Sample data with pool cleaners
const sampleCleaners = [
  {
    id: "1",
    model_number: "S150",
    name: "Dolphin S150",
    price: 1400,
    cost_price: 1028,
    margin_percentage: 26.57,
    margin_amount: 372,
    description: "Entry-level robotic pool cleaner suitable for small to medium pools."
  },
  {
    id: "2",
    model_number: "L400",
    name: "Dolphin Liberty 400",
    price: 2350,
    cost_price: 1844,
    margin_percentage: 21.53,
    margin_amount: 506,
    description: "Cordless robotic pool cleaner with advanced navigation system."
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

  const handleAddNew = () => {
    // TODO: Implement add new pool cleaner logic
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pool cleaners..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <PoolCleanersActions onAddNew={handleAddNew} />
        </div>

        <Table>
          <PoolCleanersTableHeader />
          <TableBody>
            {filteredCleaners.length === 0 ? (
              <EmptyPoolCleanersState />
            ) : (
              filteredCleaners.map((cleaner) => (
                <TableRow key={cleaner.id}>
                  <TableCell>{cleaner.model_number}</TableCell>
                  <TableCell>{cleaner.name}</TableCell>
                  <TableCell className="text-right">${cleaner.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${cleaner.cost_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{cleaner.margin_percentage.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">${cleaner.margin_amount.toLocaleString()}</TableCell>
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
      </CardContent>
    </Card>
  );
};
