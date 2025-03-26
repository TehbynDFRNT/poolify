
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";
import { UnderFenceConcreteStripSelection } from "../../types";
import { AvailableStripsList } from "./AvailableStripsList";
import { SelectedStripsTable } from "./SelectedStripsTable";
import { useUnderFenceStrips } from "./useUnderFenceStrips";

interface UnderFenceConcreteStripSelectorProps {
  selectedStrips: UnderFenceConcreteStripSelection[];
  onUpdateStrips: (strips: UnderFenceConcreteStripSelection[]) => void;
}

export const UnderFenceConcreteStripSelector = ({ 
  selectedStrips,
  onUpdateStrips 
}: UnderFenceConcreteStripSelectorProps) => {
  const { underFenceConcreteStrips, isLoading } = useUnderFenceConcreteStrips();
  
  const {
    handleAddStrip,
    handleUpdateQuantity,
    handleRemoveStrip,
    calculateTotalCost
  } = useUnderFenceStrips(selectedStrips, onUpdateStrips);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Fence className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Under Fence Concrete Strip L/M</CardTitle>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            Total: ${calculateTotalCost().toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-6">
            {/* Available strips to add */}
            <div className="space-y-4">
              <Label className="mb-2 block">Available Concrete Strips</Label>
              <AvailableStripsList 
                strips={underFenceConcreteStrips || []} 
                onAddStrip={handleAddStrip} 
              />
            </div>
            
            {/* Selected strips table */}
            {selectedStrips.length > 0 && (
              <div>
                <Label className="mb-2 block">Selected Concrete Strips</Label>
                <SelectedStripsTable 
                  selectedStrips={selectedStrips}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveStrip={handleRemoveStrip}
                />
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Add under fence concrete strips required for this installation. Multiple strips of the same type can be added by adjusting the quantity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
