
import { useState } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PavingSelection } from "../hooks/useExtraPavingQuote";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
}

export const ExtraPavingSelector = ({
  quoteId,
  selections,
  onAdd,
  onUpdate,
  onRemove
}: ExtraPavingSelectorProps) => {
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");

  // Filter out already selected paving types
  const availablePavingOptions = extraPavingCosts?.filter(
    option => !selections.some(selection => selection.pavingId === option.id)
  ) || [];

  const handleAddPaving = () => {
    if (selectedPavingId) {
      onAdd(selectedPavingId);
      setSelectedPavingId("");
    }
  };

  const handleMetersChange = (pavingId: string, value: string) => {
    const meters = parseFloat(value);
    if (!isNaN(meters)) {
      onUpdate(pavingId, meters);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extra Paving</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new paving selector */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="paving-select">Add paving type</Label>
            <Select
              value={selectedPavingId}
              onValueChange={setSelectedPavingId}
              disabled={isLoading || !quoteId}
            >
              <SelectTrigger id="paving-select">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                {availablePavingOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.category}
                  </SelectItem>
                ))}
                {availablePavingOptions.length === 0 && (
                  <SelectItem value="none" disabled>
                    No paving types available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddPaving}
            disabled={!selectedPavingId || isLoading || !quoteId}
            className="mb-0.5"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        {selections.length > 0 ? (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground px-1">
              <div className="col-span-4">Type</div>
              <div className="col-span-3">Meters</div>
              <div className="col-span-3">Cost</div>
              <div className="col-span-2"></div>
            </div>
            <Separator />
            {selections.map((selection) => (
              <div key={selection.pavingId} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4 font-medium">
                  {selection.pavingCategory}
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={selection.meters}
                    onChange={(e) => handleMetersChange(selection.pavingId, e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  ${selection.totalCost.toFixed(2)}
                </div>
                <div className="col-span-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(selection.pavingId)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed rounded-md mt-4">
            <p className="text-muted-foreground">No extra paving selected.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add paving types using the selector above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
