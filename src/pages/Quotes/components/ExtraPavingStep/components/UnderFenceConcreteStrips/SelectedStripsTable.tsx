
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fence } from "lucide-react";
import { UnderFenceConcreteStripSelection } from "../../types";

interface SelectedStripsTableProps {
  selectedStrips: UnderFenceConcreteStripSelection[];
  onUpdateQuantity: (stripId: string, quantity: number) => void;
  onRemoveStrip: (stripId: string) => void;
}

export const SelectedStripsTable = ({ 
  selectedStrips, 
  onUpdateQuantity, 
  onRemoveStrip 
}: SelectedStripsTableProps) => {
  if (selectedStrips.length === 0) return null;
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedStrips.map(strip => (
          <TableRow key={strip.id}>
            <TableCell>{strip.type}</TableCell>
            <TableCell>${strip.cost.toFixed(2)}</TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="1"
                value={strip.quantity}
                onChange={(e) => onUpdateQuantity(strip.id, parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell className="font-medium">
              ${(strip.cost * strip.quantity).toFixed(2)}
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveStrip(strip.id)}
                className="h-8 w-8 p-0 text-red-500"
              >
                <span className="sr-only">Remove</span>
                <Fence className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
