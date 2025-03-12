
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PavingCost } from "@/types/paving-cost";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface PavingCostsTableProps {
  pavingCosts: PavingCost[] | null;
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<PavingCost>) => Promise<void>;
}

export const PavingCostsTable: React.FC<PavingCostsTableProps> = ({ 
  pavingCosts, 
  isLoading,
  onUpdate 
}) => {
  const [selectedCost, setSelectedCost] = useState<PavingCost | null>(null);
  const [formValues, setFormValues] = useState<{
    category1: string;
    category2: string;
    category3: string;
    category4: string;
  }>({
    category1: '',
    category2: '',
    category3: '',
    category4: '',
  });
  
  const handleEditClick = (cost: PavingCost) => {
    setSelectedCost(cost);
    setFormValues({
      category1: cost.category1.toString(),
      category2: cost.category2.toString(),
      category3: cost.category3.toString(),
      category4: cost.category4.toString(),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedCost) return;
    
    try {
      const updates = {
        category1: parseFloat(formValues.category1) || 0,
        category2: parseFloat(formValues.category2) || 0,
        category3: parseFloat(formValues.category3) || 0,
        category4: parseFloat(formValues.category4) || 0,
      };
      
      await onUpdate(selectedCost.id, updates);
      toast.success(`Updated ${selectedCost.name} costs`);
      setSelectedCost(null);
    } catch (error) {
      console.error("Failed to update value:", error);
      toast.error("Failed to update costs");
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Paving</TableHead>
              <TableHead>Category 1</TableHead>
              <TableHead>Category 2</TableHead>
              <TableHead>Category 3</TableHead>
              <TableHead>Category 4</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-8" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Cat Total</TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!pavingCosts || pavingCosts.length === 0) {
    return <div>No paving costs available</div>;
  }

  // Calculate totals for each category
  const totals = pavingCosts.reduce(
    (acc, cost) => {
      return {
        category1: acc.category1 + cost.category1,
        category2: acc.category2 + cost.category2,
        category3: acc.category3 + cost.category3,
        category4: acc.category4 + cost.category4,
      };
    },
    { category1: 0, category2: 0, category3: 0, category4: 0 }
  );

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Paving</TableHead>
              <TableHead>Category 1</TableHead>
              <TableHead>Category 2</TableHead>
              <TableHead>Category 3</TableHead>
              <TableHead>Category 4</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pavingCosts.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell className="font-medium">{cost.name}</TableCell>
                <TableCell>{formatCurrency(cost.category1)}</TableCell>
                <TableCell>{formatCurrency(cost.category2)}</TableCell>
                <TableCell>{formatCurrency(cost.category3)}</TableCell>
                <TableCell>{formatCurrency(cost.category4)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(cost)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {cost.name} Costs</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="category1">Category 1</Label>
                          <Input
                            id="category1"
                            name="category1"
                            type="number"
                            value={formValues.category1}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="category2">Category 2</Label>
                          <Input
                            id="category2"
                            name="category2"
                            type="number"
                            value={formValues.category2}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="category3">Category 3</Label>
                          <Input
                            id="category3"
                            name="category3"
                            type="number"
                            value={formValues.category3}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="category4">Category 4</Label>
                          <Input
                            id="category4"
                            name="category4"
                            type="number"
                            value={formValues.category4}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSave}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Cat Total</TableCell>
              <TableCell>{formatCurrency(totals.category1)}</TableCell>
              <TableCell>{formatCurrency(totals.category2)}</TableCell>
              <TableCell>{formatCurrency(totals.category3)}</TableCell>
              <TableCell>{formatCurrency(totals.category4)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};
