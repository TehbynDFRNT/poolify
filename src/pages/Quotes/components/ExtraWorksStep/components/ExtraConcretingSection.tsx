
import { Button } from "@/components/ui/button";
import { useExtraConcreting } from "../hooks/useExtraConcreting";
import { ExtraConcretingSelection } from "./ExtraConcretingSelection";
import { HardHat, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export const ExtraConcretingSection = () => {
  const {
    concretingTypes,
    concretingSelections,
    isLoading,
    totalCost,
    addConcretingSelection,
    updateConcretingSelection,
    removeConcretingSelection
  } = useExtraConcreting();

  if (isLoading) {
    return <div className="py-4">Loading concrete labour types...</div>;
  }

  if (!concretingTypes || concretingTypes.length === 0) {
    return (
      <div className="py-4 text-muted-foreground">
        No concrete labour types available. Please add types in the Extra Paving section.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Concrete Labour</h3>
        </div>
        <div className="text-lg font-bold">
          Total: {formatCurrency(totalCost)}
        </div>
      </div>
      
      {concretingSelections.length === 0 ? (
        <div className="py-4 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">
            No concrete labour selections added yet.
          </p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addConcretingSelection}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Concrete Labour
          </Button>
        </div>
      ) : (
        <>
          {concretingSelections.map((selection, index) => (
            <ExtraConcretingSelection
              key={index}
              selection={selection}
              index={index}
              concretingTypes={concretingTypes}
              onUpdate={updateConcretingSelection}
              onRemove={removeConcretingSelection}
            />
          ))}
          
          <div className="flex justify-start mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={addConcretingSelection}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More Concrete Labour
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
