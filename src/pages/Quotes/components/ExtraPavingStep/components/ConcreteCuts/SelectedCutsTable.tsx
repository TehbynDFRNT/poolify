
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Scissors } from "lucide-react";
import { ConcreteCutSelection } from "../../types";

interface SelectedCutsTableProps {
  selectedCuts: ConcreteCutSelection[];
  onUpdateQuantity: (cutId: string, quantity: number) => void;
  onRemoveCut: (cutId: string) => void;
}

export const SelectedCutsTable = ({ 
  selectedCuts, 
  onUpdateQuantity, 
  onRemoveCut 
}: SelectedCutsTableProps) => {
  if (selectedCuts.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h4 className="mb-2 font-medium">Selected Concrete Cuts</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedCuts.map(cut => (
            <TableRow key={cut.id}>
              <TableCell>{cut.cut_type}</TableCell>
              <TableCell>${cut.price.toFixed(2)}</TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  min="1"
                  value={cut.quantity}
                  onChange={(e) => onUpdateQuantity(cut.id, parseInt(e.target.value) || 0)}
                  className="w-20"
                />
              </TableCell>
              <TableCell className="font-medium">
                ${(cut.price * cut.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveCut(cut.id)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <span className="sr-only">Remove</span>
                  <Scissors className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
