
import { Button } from "@/components/ui/button";
import { useExtraPaving } from "../hooks/useExtraPaving";
import { ExtraPavingSelection } from "./ExtraPavingSelection";
import { Grid2x2, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export const ExtraPavingSection = () => {
  const {
    pavingCategories,
    concreteLabourCosts,
    pavingSelections,
    isLoading,
    totalCost,
    totalMargin,
    addPavingSelection,
    updatePavingSelection,
    removePavingSelection,
    containerRef
  } = useExtraPaving();

  if (isLoading) {
    return <div className="py-4">Loading paving categories...</div>;
  }

  if (!pavingCategories || pavingCategories.length === 0) {
    return (
      <div className="py-4 text-muted-foreground">
        No paving categories available. Please add categories in the Extra Paving section.
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={containerRef} data-paving-cost={totalCost} data-paving-margin={totalMargin}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid2x2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Extra Paving</h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-green-600">
            Total Margin: {formatCurrency(totalMargin)}
          </div>
          <div className="text-lg font-bold">
            Total: {formatCurrency(totalCost)}
          </div>
        </div>
      </div>
      
      {pavingSelections.length === 0 ? (
        <div className="py-4 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">
            No paving selections added yet.
          </p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addPavingSelection}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Paving
          </Button>
        </div>
      ) : (
        <>
          {pavingSelections.map((selection, index) => (
            <ExtraPavingSelection
              key={index}
              selection={selection}
              index={index}
              categories={pavingCategories}
              labourCosts={concreteLabourCosts}
              onUpdate={updatePavingSelection}
              onRemove={removePavingSelection}
            />
          ))}
          
          <div className="flex justify-start mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={addPavingSelection}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More Paving
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
