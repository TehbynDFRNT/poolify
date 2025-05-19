import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pool } from "@/types/pool";
import { CheckCircle, Save } from "lucide-react";
import React from "react";
import { ColorSelector } from "./ColorSelector";
import { PoolDetailsSections } from "./PoolDetailsSections";
import { PoolModelSelector } from "./PoolModelSelector";
import { SaveButton } from "./SaveButton";

interface PoolSelectionContentProps {
  isLoading: boolean;
  error: Error | null;
  poolsByRange: Record<string, Pool[]>;
  selectedPoolId: string;
  setSelectedPoolId: (value: string) => void;
  selectedPool: Pool | undefined;
  selectedColor?: string;
  setSelectedColor: (color: string) => void;
  customerId?: string | null;
  isSubmitting: boolean;
  handleSavePoolSelection: () => Promise<void>;
}

export const PoolSelectionContent: React.FC<PoolSelectionContentProps> = ({
  isLoading,
  error,
  poolsByRange,
  selectedPoolId,
  setSelectedPoolId,
  selectedPool,
  selectedColor,
  setSelectedColor,
  customerId,
  isSubmitting,
  handleSavePoolSelection
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Select a Pool Model</CardTitle>

        {customerId && selectedPoolId && (
          <SaveButton
            onClick={handleSavePoolSelection}
            isSubmitting={isSubmitting}
            disabled={false}
            buttonText="Save Pool Selection"
            icon={<Save className="mr-2 h-4 w-4" />}
            className="bg-primary"
          />
        )}
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
              }}
            />

            {selectedPoolId && selectedPool && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4 p-3 bg-primary/10 rounded-md">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-lg">Selected Pool: {selectedPool.name}</h3>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Select Color</h3>
                  <ColorSelector
                    selectedColor={selectedColor}
                    onChange={setSelectedColor}
                  />
                </div>

                {/* Pool Details Section with vertical flow */}
                <PoolDetailsSections
                  pool={selectedPool}
                  selectedColor={selectedColor}
                  customerId={customerId || undefined}
                />
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
  );
};
