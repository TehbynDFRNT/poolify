
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useQuoteContext } from '../../context/QuoteContext';
import { ExtraPavingSection } from './components/ExtraPavingSection';
import { ExtraConcretingSection } from './components/ExtraConcretingSection';
import { useExtraPaving } from './hooks/useExtraPaving';
import { useExtraConcreting } from './hooks/useExtraConcreting';
import { ExtraWorks } from '@/types/extra-works';
import { useNavigate } from 'react-router-dom';

const ExtraWorksStep = ({ onNext, onPrevious }: { onNext?: () => void; onPrevious?: () => void }) => {
  const navigate = useNavigate();
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { 
    pavingSelections, 
    updatePavingSelection, 
    addPavingSelection, 
    removePavingSelection, 
    totalCost: pavingTotalCost,
    setPavingSelections 
  } = useExtraPaving();
  
  const {
    concretingSelections,
    updateConcretingSelection,
    addConcretingSelection,
    removeConcretingSelection,
    totalCost: concretingTotalCost,
    setConcretingSelections
  } = useExtraConcreting();

  // Calculate total cost for all extra works
  const totalExtraWorksCost = pavingTotalCost + concretingTotalCost;

  // Initialize from saved data if it exists
  useEffect(() => {
    if (quoteData.custom_requirements_json) {
      try {
        const extraWorksData = JSON.parse(quoteData.custom_requirements_json) as ExtraWorks;
        if (extraWorksData.pavingSelections) {
          setPavingSelections(extraWorksData.pavingSelections);
        }
        if (extraWorksData.concretingSelections) {
          setConcretingSelections(extraWorksData.concretingSelections);
        }
      } catch (error) {
        console.error("Error parsing saved extra works data:", error);
      }
    }
  }, [quoteData.custom_requirements_json, setPavingSelections, setConcretingSelections]);

  const saveExtraWorks = (navigateNext = false) => {
    const extraWorksData: ExtraWorks = {
      pavingSelections,
      concretingSelections,
      retainingWallSelections: [],
      waterFeatureSelections: [],
      totalCost: totalExtraWorksCost
    };

    updateQuoteData({
      custom_requirements_json: JSON.stringify(extraWorksData),
      extra_works_cost: totalExtraWorksCost
    });

    toast({
      title: "Extra works saved",
      description: "Your extra works selections have been saved.",
    });

    if (navigateNext) {
      if (onNext) {
        onNext();
      } else {
        navigate('/quotes/new/optional-addons');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Extra Works</CardTitle>
          <CardDescription>Add additional paving, concreting, retaining walls, or water features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paving" className="w-full mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="paving">Extra Paving</TabsTrigger>
              <TabsTrigger value="concreting">Concrete Labour</TabsTrigger>
              <TabsTrigger value="retaining" disabled>Retaining Walls</TabsTrigger>
              <TabsTrigger value="water" disabled>Water Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paving">
              <ExtraPavingSection />
            </TabsContent>
            
            <TabsContent value="concreting">
              <ExtraConcretingSection />
            </TabsContent>
            
            <TabsContent value="retaining">
              <div className="p-8 text-center text-muted-foreground">
                Retaining walls feature coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="water">
              <div className="p-8 text-center text-muted-foreground">
                Water features coming soon
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-medium">
              Total Extra Works Cost: <span className="font-semibold">${totalExtraWorksCost.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              {onPrevious && (
                <Button variant="outline" onClick={onPrevious}>
                  Previous
                </Button>
              )}
              <Button variant="outline" onClick={() => saveExtraWorks(false)}>
                Save
              </Button>
              <Button onClick={() => saveExtraWorks(true)}>
                {onNext ? "Save & Continue" : "Save & Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtraWorksStep;
