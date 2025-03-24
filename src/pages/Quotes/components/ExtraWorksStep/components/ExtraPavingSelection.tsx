
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { Trash } from "lucide-react";
import { PavingSelection } from "../hooks/useExtraPaving";
import { formatCurrency } from "@/utils/format";

interface ExtraPavingSelectionProps {
  selection: PavingSelection;
  index: number;
  categories: ExtraPavingCost[];
  onUpdate: (index: number, updates: Partial<PavingSelection>) => void;
  onRemove: (index: number) => void;
}

export const ExtraPavingSelection = ({
  selection,
  index,
  categories,
  onUpdate,
  onRemove
}: ExtraPavingSelectionProps) => {
  // Find the selected category
  const selectedCategory = categories.find(cat => cat.id === selection.categoryId);
  
  // Calculate cost per meter
  const costPerMeter = selectedCategory
    ? selectedCategory.paver_cost + selectedCategory.wastage_cost + selectedCategory.margin_cost
    : 0;

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Label htmlFor={`paving-category-${index}`}>Paving Category</Label>
            <Select
              value={selection.categoryId}
              onValueChange={(value) => onUpdate(index, { categoryId: value })}
            >
              <SelectTrigger id={`paving-category-${index}`} className="mt-1">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor={`paving-meters-${index}`}>Meters</Label>
            <Input
              id={`paving-meters-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={selection.meters || ""}
              onChange={(e) => onUpdate(index, { meters: parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label>Cost per meter</Label>
            <div className="mt-2 font-medium">{formatCurrency(costPerMeter)}</div>
          </div>
          
          <div className="md:col-span-2">
            <Label>Total Cost</Label>
            <div className="mt-2 font-bold">{formatCurrency(selection.cost)}</div>
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
