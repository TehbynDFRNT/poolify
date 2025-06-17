import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { Settings } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";
import { ConcreteAndPavingCostSummary } from "./ConcreteAndPavingCostSummary";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { ExtraConcreting } from "./ExtraConcreting";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { SaveAllButton } from "./SaveAllButton";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

// Coping category options
const COPING_CATEGORY_OPTIONS = [
  "Cat1",
  "Cat2", 
  "Cat3",
  "Cat4"
];

// Grout colour options
const GROUT_COLOUR_OPTIONS = [
  "White",
  "Grey",
  "Custom"
];

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [summaryKey, setSummaryKey] = useState<number>(0);
  
  // Included Coping Options state
  const [copingCategory, setCopingCategory] = useState<string>("");
  const [groutColour, setGroutColour] = useState<string>("");
  const [recessDraining, setRecessDraining] = useState<string>("");
  const [isLoadingCoping, setIsLoadingCoping] = useState(true);

  const refreshSummary = useCallback(() => {
    setSummaryKey(prev => prev + 1);
  }, []);

  // Use the guarded actions hook for coping options
  const {
    handleSave: handleCopingSave,
    isSubmitting: isCopingSubmitting,
    StatusWarningDialog: CopingStatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Fetch existing coping data when component mounts
  useEffect(() => {
    if (customerId) {
      fetchExistingCopingData();
    }
  }, [customerId]);

  // Fetch existing coping options data for this customer
  const fetchExistingCopingData = async () => {
    try {
      setIsLoadingCoping(true);
      const { data, error } = await supabase
        .from('pool_paving_selections')
        .select('coping_category, grout_colour, recess_drainage')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching coping data:", error);
        return;
      }

      if (data) {
        if (data.coping_category) {
          setCopingCategory(data.coping_category);
        }
        if (data.grout_colour) {
          setGroutColour(data.grout_colour);
        }
        if (data.recess_drainage) {
          setRecessDraining(data.recess_drainage);
        }
      }
    } catch (error) {
      console.error("Error in fetchExistingCopingData:", error);
    } finally {
      setIsLoadingCoping(false);
    }
  };

  // Handle save for coping options
  const handleCopingSaveClick = async () => {
    // First check if a record already exists
    const { data: existingData } = await supabase
      .from('pool_paving_selections')
      .select('id')
      .eq('pool_project_id', customerId)
      .maybeSingle();

    const dataToSave = {
      coping_category: copingCategory || null,
      grout_colour: groutColour || null,
      recess_drainage: recessDraining || null
    };

    // Use the guarded handleSave for both insert and update
    const result = await handleCopingSave(dataToSave, 'pool_paving_selections', existingData?.id || null);

    if (result.success) {
      if (result.newId && !existingData?.id) {
        toast.success("Included coping options saved successfully.");
      }
      refreshSummary();
    }
  };

  // Guarded save all for concrete and paving
  const {
    mutate: saveAllMutation,
    isPending: isSubmittingAll,
    StatusWarningDialog
  } = useGuardedMutation({
    projectId: customerId || '',
    mutationFn: async () => {
      // For concrete and paving, we don't have a single save operation
      // This is just to trigger the status guard warning
      // Individual components handle their own saves
      refreshSummary();
      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        toast.success("All sections refreshed successfully");
      },
      onError: (error) => {
        console.error("Error in save all:", error);
        toast.error("Failed to refresh sections");
      },
    },
  });

  const handleSaveAll = async () => {
    saveAllMutation();
  };

  return (
    <div className="space-y-6">
      {/* Included Coping Options Section */}
      <Card>
        <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Included Coping Options</h3>
            </div>
            <p className="text-muted-foreground">
              Configure coping category and grout colour options
            </p>
          </div>

          {customerId && (
            <SaveButton
              onClick={handleCopingSaveClick}
              isSubmitting={isCopingSubmitting}
              disabled={false}
              buttonText="Save Options"
              className="bg-primary"
            />
          )}
        </CardHeader>

        <CardContent className="pt-4">
          {isLoadingCoping ? (
            <div className="flex justify-center py-8">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="coping-category">Coping Category</Label>
                <Select
                  value={copingCategory}
                  onValueChange={setCopingCategory}
                  disabled={isLoadingCoping}
                >
                  <SelectTrigger id="coping-category" className="mt-2">
                    <SelectValue placeholder="Select coping category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COPING_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="grout-colour">Grout Colour</Label>
                <Select
                  value={groutColour}
                  onValueChange={setGroutColour}
                  disabled={isLoadingCoping}
                >
                  <SelectTrigger id="grout-colour" className="mt-2">
                    <SelectValue placeholder="Select grout colour" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUT_COLOUR_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recess-draining">Recess Draining</Label>
                <Select
                  value={recessDraining}
                  onValueChange={setRecessDraining}
                  disabled={isLoadingCoping}
                >
                  <SelectTrigger id="recess-draining" className="mt-2">
                    <SelectValue placeholder="Select yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExtraPavingConcrete
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <PavingOnExistingConcrete
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <ExtraConcreting
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <ConcretePumpSelector
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <UnderFenceConcreteStrips
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <ConcreteCuts
        pool={pool}
        customerId={customerId}
        onSaveComplete={refreshSummary}
      />
      <ConcreteAndPavingCostSummary
        key={summaryKey}
        pool={pool}
        customerId={customerId}
      />

      <div className="flex justify-end mt-8">
        <SaveAllButton
          onSaveAll={handleSaveAll}
          isSubmitting={isSubmittingAll}
        />
      </div>

      <StatusWarningDialog />
      <CopingStatusWarningDialog />
    </div>
  );
};
