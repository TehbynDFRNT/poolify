
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { HardHat } from "lucide-react";
import { useExtraConcreting } from "./hooks/useExtraConcreting";
import { ConcretingTypeSelector } from "./components/ConcretingTypeSelector";
import { MeterageInput } from "./components/MeterageInput";
import { CostDisplay } from "./components/CostDisplay";
import { EmptyState } from "./components/EmptyState";

interface ExtraConcretingProps {
  onChanged?: () => void;
}

export const ExtraConcreting = React.forwardRef<HTMLDivElement, ExtraConcretingProps>(
  ({ onChanged }, ref) => {
    const {
      selectedType,
      meterage,
      totalCost,
      extraConcretingItems,
      isLoading,
      handleTypeChange,
      handleMeterageChange,
      getSelectedPrice
    } = useExtraConcreting(onChanged);
    
    return (
      <Card className="border border-gray-200" ref={ref}>
        <CardHeader className="bg-white py-4 px-5 flex flex-row items-center">
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Extra Concreting</h3>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="space-y-4">
              <MeterageInput isLoading={true} meterage={0} onChange={() => {}} />
              <ConcretingTypeSelector 
                isLoading={true} 
                selectedType="" 
                onTypeChange={() => {}} 
              />
            </div>
          ) : extraConcretingItems && extraConcretingItems.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConcretingTypeSelector
                  selectedType={selectedType}
                  extraConcretingItems={extraConcretingItems}
                  isLoading={false}
                  onTypeChange={handleTypeChange}
                />
                <MeterageInput
                  meterage={meterage}
                  isLoading={false}
                  onChange={handleMeterageChange}
                />
              </div>
              <CostDisplay
                totalCost={totalCost}
                itemPrice={getSelectedPrice()}
                meterage={meterage}
                isVisible={selectedType !== "" && meterage > 0}
                isLoading={false}
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    );
  }
);

ExtraConcreting.displayName = "ExtraConcreting";
