
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingCategorySelectorProps {
  index: number;
  selectedCategoryId: string;
  categories: ExtraPavingCost[];
  onCategoryChange: (value: string) => void;
}

export const PavingCategorySelector = ({
  index,
  selectedCategoryId,
  categories,
  onCategoryChange
}: PavingCategorySelectorProps) => {
  return (
    <div>
      <Label htmlFor={`paving-category-${index}`}>Paving Category</Label>
      <Select
        value={selectedCategoryId}
        onValueChange={onCategoryChange}
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
  );
};
