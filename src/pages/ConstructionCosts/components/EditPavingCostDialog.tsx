
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PavingCost } from "@/types/paving-cost";

interface EditPavingCostDialogProps {
  cost: PavingCost;
  onUpdate: (id: string, updates: Partial<PavingCost>) => Promise<void>;
}

export const EditPavingCostDialog: React.FC<EditPavingCostDialogProps> = ({ 
  cost, 
  onUpdate 
}) => {
  const [formValues, setFormValues] = useState<{
    category1: string;
    category2: string;
    category3: string;
    category4: string;
  }>({
    category1: cost.category1.toString(),
    category2: cost.category2.toString(),
    category3: cost.category3.toString(),
    category4: cost.category4.toString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updates = {
        category1: parseFloat(formValues.category1) || 0,
        category2: parseFloat(formValues.category2) || 0,
        category3: parseFloat(formValues.category3) || 0,
        category4: parseFloat(formValues.category4) || 0,
      };
      
      await onUpdate(cost.id, updates);
    } catch (error) {
      console.error("Failed to update value:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit {cost.name}</span>
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
  );
};
