
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuoteContext } from '../../context/QuoteContext';
import { ExtraPavingSection } from './components/ExtraPavingSection';
import { ExtraConcretingSection } from './components/ExtraConcretingSection';
import { useExtraPaving } from './hooks/useExtraPaving';
import { useExtraConcreting } from './hooks/useExtraConcreting';
import { ExtraWorks } from '@/types/extra-works';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const ExtraWorksStep = ({ onNext, onPrevious }: { onNext?: () => void; onPrevious?: () => void }) => {
  const navigate = useNavigate();
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSaving, setIsSaving] = useState(false);
  const { 
    pavingSelections, 
    setPavingSelections,
    updatePavingSelection, 
    addPavingSelection, 
    removePavingSelection, 
    totalCost: pavingTotalCost,
    totalMargin: pavingTotalMargin
  } = useExtraPaving();
  
  const {
    concretingSelections,
    setConcretingSelections,
    updateConcretingSelection,
    addConcretingSelection,
    removeConcretingSelection,
    totalCost: concretingTotalCost
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

  const saveExtraWorks = async (navigateNext = false) => {
    if (!quoteData.id) {
      toast.error("Quote ID is missing. Cannot save data.");
      return;
    }

    setIsSaving(true);

    // Prepare the extra works data
    const extraWorksData: ExtraWorks = {
      pavingSelections: pavingSelections.map(selection => ({
        categoryId: selection.categoryId,
        meters: selection.meters,
        cost: selection.cost,
        materialMargin: selection.materialMargin || 0,
        labourMargin: selection.labourMargin || 0,
        totalMargin: selection.totalMargin || 0
      })),
      concretingSelections,
      retainingWallSelections: [],
      waterFeatureSelections: [],
      totalCost: totalExtraWorksCost,
      totalMargin: pavingTotalMargin
    };

    try {
      console.log("Saving extra works with total cost:", totalExtraWorksCost);
      
      // Update both the custom_requirements_json field and the extra_works_cost field
      const { error } = await supabase
        .from('quotes')
        .update({ 
          custom_requirements_json: JSON.stringify(extraWorksData),
          extra_works_cost: totalExtraWorksCost
          // The total_cost will be updated automatically by the database trigger
        })
        .eq('id', quoteData.id);

      if (error) {
        console.error("Error saving extra works data:", error);
        toast.error("Failed to save extra works data");
        setIsSaving(false);
        return;
      }

      // Update local state
      updateQuoteData({
        custom_requirements_json: JSON.stringify(extraWorksData),
        extra_works_cost: totalExtraWorksCost,
        // We need to update the total cost in the local state as well for UI consistency
        total_cost: (
          (quoteData.site_requirements_cost || 0) + 
          totalExtraWorksCost + 
          (quoteData.optional_addons_cost || 0)
        )
      });

      toast.success("Extra works saved");
      setIsSaving(false);

      if (navigateNext) {
        if (onNext) {
          onNext();
        } else {
          navigate('/quotes/new/optional-addons');
        }
      }
    } catch (error) {
      console.error("Error in saveExtraWorks:", error);
      toast.error("Error saving extra works data");
      setIsSaving(false);
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
          <div className="space-y-8">
            {/* Extra Paving Section */}
            <section className="border rounded-lg p-4">
              <ExtraPavingSection />
            </section>
            
            {/* Concrete Labour Section */}
            <section className="border rounded-lg p-4">
              <ExtraConcretingSection />
            </section>
            
            {/* Retaining Walls Section (Coming Soon) */}
            <section className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Retaining Walls</h3>
              </div>
              <div className="p-8 text-center text-muted-foreground">
                Retaining walls feature coming soon
              </div>
            </section>
            
            {/* Water Features Section (Coming Soon) */}
            <section className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Water Features</h3>
              </div>
              <div className="p-8 text-center text-muted-foreground">
                Water features coming soon
              </div>
            </section>
          </div>

          <div className="flex justify-between items-center pt-6 mt-8 border-t">
            <div className="text-lg font-medium">
              Total Extra Works Cost: <span className="font-semibold">${totalExtraWorksCost.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              {onPrevious && (
                <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
                  Previous
                </Button>
              )}
              <Button variant="outline" onClick={() => saveExtraWorks(false)} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={() => saveExtraWorks(true)} disabled={isSaving}>
                {isSaving ? "Saving..." : (onNext ? "Save & Continue" : "Save & Continue")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Default export
export default ExtraWorksStep;
