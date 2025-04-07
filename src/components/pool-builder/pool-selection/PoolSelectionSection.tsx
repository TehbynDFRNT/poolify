
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { usePoolSelection } from "./hooks/usePoolSelection";
import { PoolModelSelector } from "./components/PoolModelSelector";
import { ColorSelector } from "./components/ColorSelector";
import { PoolDetailsTabs } from "./components/PoolDetailsTabs";
import { SaveButton } from "./components/SaveButton";

interface PoolSelectionSectionProps {
  customerId?: string | null;
}

const PoolSelectionSection: React.FC<PoolSelectionSectionProps> = ({ customerId }) => {
  const {
    poolsByRange,
    isLoading,
    error,
    selectedPoolId,
    setSelectedPoolId,
    selectedPool,
    selectedColor,
    setSelectedColor,
    activeTab,
    setActiveTab,
    isSubmitting,
    handleSavePoolSelection
  } = usePoolSelection(customerId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pool Selection</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select a Pool Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading pool models...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md">
              <p className="text-destructive">Failed to load pools. Please try again.</p>
            </div>
          ) : (
            <>
              <PoolModelSelector 
                poolsByRange={poolsByRange} 
                selectedPoolId={selectedPoolId} 
                onSelect={(value) => {
                  setSelectedPoolId(value);
                  setActiveTab("details");
                }} 
              />

              {selectedPoolId && selectedPool && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">Selected Pool: {selectedPool.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <ColorSelector 
                      selectedColor={selectedColor} 
                      onChange={setSelectedColor} 
                    />
                  </div>

                  <PoolDetailsTabs 
                    pool={selectedPool}
                    selectedColor={selectedColor}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                  
                  <div className="flex justify-end">
                    <SaveButton 
                      onClick={handleSavePoolSelection}
                      isSubmitting={isSubmitting}
                      disabled={!customerId}
                    />
                  </div>
                </div>
              )}
              
              {!customerId && selectedPoolId && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                  <p>To save this pool selection, please save customer information first.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSelectionSection;
