
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConcretingSelection } from "../hooks/useExtraConcreting";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface ExtraConcretingSelectionProps {
  selection: ConcretingSelection;
  index: number;
  concretingTypes: any[];
  onUpdate: (index: number, updates: Partial<ConcretingSelection>) => void;
  onRemove: (index: number) => void;
}

export const ExtraConcretingSelection = ({
  selection,
  index,
  concretingTypes,
  onUpdate,
  onRemove
}: ExtraConcretingSelectionProps) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Concrete Labour #{index + 1}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(index)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Type</Label>
          <Select 
            value={selection.typeId} 
            onValueChange={(value) => onUpdate(index, { typeId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {concretingTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Quantity</Label>
          <Input 
            type="number" 
            min="1" 
            value={selection.quantity} 
            onChange={(e) => onUpdate(index, { quantity: Number(e.target.value) })}
          />
        </div>
        
        <div>
          <Label>Cost</Label>
          <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-muted-foreground">
            {formatCurrency(selection.cost)}
          </div>
        </div>
      </div>
    </div>
  );
};
