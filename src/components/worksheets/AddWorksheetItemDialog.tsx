
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddWorksheetItem } from "@/hooks/usePoolWorksheets";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorksheetItemFormData {
  category: string;
  item_name: string;
  quantity: number;
  unit_cost: number;
  notes?: string;
}

interface AddWorksheetItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWorksheetItemDialog({ open, onOpenChange }: AddWorksheetItemDialogProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<WorksheetItemFormData>({
    defaultValues: {
      category: "Materials",
      quantity: 1,
      unit_cost: 0
    }
  });
  
  const addItemMutation = useAddWorksheetItem();
  
  const quantity = watch("quantity");
  const unitCost = watch("unit_cost");
  const totalCost = (quantity || 0) * (unitCost || 0);

  const onSubmit = async (data: WorksheetItemFormData) => {
    try {
      await addItemMutation.mutateAsync({
        ...data,
        total_cost: totalCost,
        notes: data.notes || null // Ensure notes is null when empty to match the required type
      });
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error adding worksheet item:", error);
    }
  };

  const categories = [
    "Materials",
    "Labor",
    "Equipment",
    "Chemicals",
    "Accessories"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Worksheet Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("category", { required: true })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500">Category is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name</Label>
            <Input 
              id="item_name" 
              placeholder="Enter item name" 
              {...register("item_name", { required: true })}
            />
            {errors.item_name && <p className="text-sm text-red-500">Item name is required</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number"
                min="0"
                step="1"
                {...register("quantity", { 
                  required: true,
                  valueAsNumber: true,
                  min: 0
                })}
              />
              {errors.quantity && <p className="text-sm text-red-500">Valid quantity is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost ($)</Label>
              <Input 
                id="unit_cost" 
                type="number"
                min="0"
                step="0.01"
                {...register("unit_cost", { 
                  required: true,
                  valueAsNumber: true,
                  min: 0
                })}
              />
              {errors.unit_cost && <p className="text-sm text-red-500">Valid unit cost is required</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes"
              {...register("notes")}
            />
          </div>

          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Total Cost:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-teal-500 hover:bg-teal-600"
              disabled={addItemMutation.isPending}
            >
              {addItemMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
