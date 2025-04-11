
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

// Type for hand grab rails data
type HandGrabRailItem = {
  id: string;
  model_number: string;
  description: string;
  cost_price: number;
  margin: number;
  total: number;
};

interface GrabRailsTableProps {
  items: HandGrabRailItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const GrabRailsTable = ({ items, searchTerm, onSearchChange }: GrabRailsTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No hand grab rails found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.model_number}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">${item.cost_price.toLocaleString()}</TableCell>
                <TableCell className="text-right">${item.margin.toLocaleString()}</TableCell>
                <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
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
  );
};
