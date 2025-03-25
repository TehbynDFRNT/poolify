
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuoteContext } from '../../context/QuoteContext';
import { ExtraPavingSection } from './components/ExtraPavingSection';
import { useExtraPaving } from './hooks/useExtraPaving';
import { ExtraWorks } from '@/types/extra-works';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const ExtraWorksStep = ({ onNext, onPrevious }: { onNext?: () => void; onPrevious?: () => void }) => {
  const navigate = useNavigate();
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSaving, setIsSaving] = useState(false);
  const extraPavingRef = useRef<{ 
    getCurrentPavingSelections: () => any[],
    getCurrentTotalCost: () => number,
    getCurrentTotalMargin: () => number
  }>(null);
  
  // This is the total cost that will be displayed and saved to the database
  const { 
    pavingSelections, 
    totalCost: pavingTotalCost,
    totalMargin: pavingTotalMargin,
    setExtraWorksRef
  } = useExtraPaving();
  
  // Use this effect to register our ref so we can get the latest state
  useEffect(() => {
    setExtraWorksRef(extraPavingRef);
  }, [setExtraWorksRef]);

  // Update the quote data whenever the total cost changes but only if it's different
  useEffect(() => {
    if (quoteData.id && !isSaving && pavingTotalCost !== quoteData.extra_works_cost) {
      console.log("Updating quote extra_works_cost to:", pavingTotalCost);
      updateQuoteData({
        extra_works_cost: pavingTotalCost
      });
    }
  }, [pavingTotalCost, quoteData.id, quoteData.extra_works_cost, isSaving, updateQuoteData]);

  const saveExtraWorks = async (navigateNext = false) => {
    if (!quoteData.id) {
      toast.error("Quote ID is missing. Cannot save data.");
      return;
    }

    setIsSaving(true);

    try {
      // Use the ref to get the latest values directly from the component
      const currentSelections = extraPavingRef.current?.getCurrentPavingSelections() || [];
      const currentTotalCost = extraPavingRef.current?.getCurrentTotalCost() || 0;
      const currentTotalMargin = extraPavingRef.current?.getCurrentTotalMargin() || 0;
      
      console.log("SAVING - Current paving selections:", currentSelections);
      console.log("SAVING - Current total cost:", currentTotalCost);
      
      // Create the extra works data object with the current values
      const extraWorksData: ExtraWorks = {
        pavingSelections: currentSelections.map(selection => ({
          categoryId: selection.categoryId,
          meters: selection.meters,
          cost: selection.cost,
          materialMargin: selection.materialMargin || 0,
          labourMargin: selection.labourMargin || 0,
          totalMargin: selection.totalMargin || 0
        })),
        concretingSelections: [],
        retainingWallSelections: [],
        waterFeatureSelections: [],
        totalCost: currentTotalCost,
        totalMargin: currentTotalMargin
      };
      
      // Stringify the data here so we can log it and verify it's correct
      const jsonData = JSON.stringify(extraWorksData);
      console.log("SAVING - About to save to database - stringified data:", jsonData);
      
      const { error } = await supabase
        .from('quotes')
        .update({ 
          custom_requirements_json: jsonData,
          extra_works_cost: currentTotalCost
        })
        .eq('id', quoteData.id);

      if (error) {
        console.error("Error saving extra works data:", error);
        toast.error("Failed to save extra works data");
        setIsSaving(false);
        return;
      }

      // Update the local context with the new values
      updateQuoteData({
        custom_requirements_json: jsonData,
        extra_works_cost: currentTotalCost
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
          <CardTitle>Extra Paving</CardTitle>
          <CardDescription>Add additional paving to your quote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <section className="border rounded-lg p-4">
              <ExtraPavingSection ref={extraPavingRef} />
            </section>
          </div>

          <div className="flex justify-between items-center pt-6 mt-8 border-t">
            <div className="text-lg font-medium">
              Total Extra Works Cost: <span className="font-semibold">${pavingTotalCost.toFixed(2)}</span>
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

export default ExtraWorksStep;
