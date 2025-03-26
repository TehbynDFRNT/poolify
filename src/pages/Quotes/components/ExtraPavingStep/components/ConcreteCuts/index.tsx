
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConcreteCutSelection } from "../../types";
import { CutsList } from "./CutsList";
import { SelectedCutsTable } from "./SelectedCutsTable";
import { useConcreteCutsState } from "./useConcreteCutsState";

interface ConcreteCutsSelectorProps {
  selectedCuts: ConcreteCutSelection[];
  onUpdateCuts: (cuts: ConcreteCutSelection[]) => void;
}

export const ConcreteCutsSelector = ({ 
  selectedCuts,
  onUpdateCuts 
}: ConcreteCutsSelectorProps) => {
  const {
    isLoading,
    handleAddCut,
    handleUpdateQuantity,
    handleRemoveCut,
    calculateTotalCost,
    groupCuts
  } = useConcreteCutsState(selectedCuts, onUpdateCuts);
  
  const { standardCuts, diagonalCuts } = groupCuts();
  const totalCost = calculateTotalCost();

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Concrete Cuts</CardTitle>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            Total: ${totalCost.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-6">
            {/* Available cuts to add */}
            <div className="space-y-4">
              <h3 className="mb-2 font-medium">Available Concrete Cuts</h3>
              
              {/* Standard Cuts */}
              <CutsList 
                cuts={standardCuts} 
                onAddCut={handleAddCut} 
                groupLabel="Standard Cuts" 
              />
              
              {/* Diagonal Cuts */}
              <CutsList 
                cuts={diagonalCuts} 
                onAddCut={handleAddCut} 
                groupLabel="Diagonal Cuts" 
              />
            </div>
            
            {/* Selected cuts table */}
            <SelectedCutsTable 
              selectedCuts={selectedCuts}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveCut={handleRemoveCut}
            />
            
            <p className="text-xs text-muted-foreground">
              Add concrete cuts required for this installation. Multiple cuts of the same type can be added by adjusting the quantity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
