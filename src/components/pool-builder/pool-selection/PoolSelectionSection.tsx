
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Save, SaveAll } from "lucide-react";
import { usePoolSelection } from "./hooks/usePoolSelection";
import { PoolModelSelector } from "./components/PoolModelSelector";
import { ColorSelector } from "./components/ColorSelector";
import { PoolDetailsSections } from "./components/PoolDetailsSections";
import { SaveButton } from "./components/SaveButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteRequirementsPlaceholder } from "./components/site-requirements/SiteRequirementsPlaceholder";

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
    isSubmitting,
    handleSavePoolSelection
  } = usePoolSelection(customerId);

  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [activeTab, setActiveTab] = useState("pool-info");

  // Function to save all sections
  const handleSaveAll = async () => {
    if (!customerId) {
      toast("Please save customer information first.", {
        className: "bg-destructive text-destructive-foreground"
      });
      return;
    }

    setIsSubmittingAll(true);
    try {
      // First save the pool selection
      await handleSavePoolSelection();
      
      // Add other section saves here if needed in the future
      
      toast("All sections saved successfully");
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast("Failed to save all sections. Please try again.", {
        className: "bg-destructive text-destructive-foreground"
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pool Selection</h2>
        
        {customerId && (
          <Button 
            onClick={handleSaveAll}
            disabled={isSubmittingAll || !selectedPoolId}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            {isSubmittingAll ? "Saving All..." : "Save All"}
          </Button>
        )}
      </div>

      {/* Pool Selection Card */}
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
                  
                  {/* Add tabs for Pool Info and Site Requirements */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="mb-4">
                      <TabsTrigger value="pool-info">Pool Information</TabsTrigger>
                      <TabsTrigger value="site-requirements">Site Requirements</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pool-info">
                      <PoolDetailsSections 
                        pool={selectedPool}
                        selectedColor={selectedColor}
                      />
                    </TabsContent>
                    
                    <TabsContent value="site-requirements">
                      <SiteRequirementsPlaceholder 
                        pool={selectedPool}
                        customerId={customerId}
                      />
                    </TabsContent>
                  </Tabs>
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
