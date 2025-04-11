
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Type for Pool management data
export type PoolManagementItem = {
  id: string;
  model_number: string;
  cost_price: number;
  margin: number;
  total: number;
  description: string;
};

interface PoolManagementTableProps {
  items: PoolManagementItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PoolManagementTable = ({ 
  items, 
  searchTerm,
  onSearchChange 
}: PoolManagementTableProps) => {
  const { toast } = useToast();

  const handleAddClick = () => {
    toast({
      title: "Add Hardware Upgrade",
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
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
              onChange={(e) => onSearchChange(e.target.value)}
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
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pool management hardware found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.model_number}</TableCell>
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
    </>
  );
};
