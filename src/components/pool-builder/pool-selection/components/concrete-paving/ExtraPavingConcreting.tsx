import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { Settings } from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { ConcreteAndPavingSnapshotSummary } from "./ConcreteAndPavingSnapshotSummary";
import { ConcreteCuts } from "./ConcreteCuts";
import { ConcretePumpSelector } from "./ConcretePumpSelector";
import { ExtraConcreting } from "./ExtraConcreting";
import { ExtraPavingConcrete } from "./ExtraPavingConcrete";
import { PavingOnExistingConcrete } from "./PavingOnExistingConcrete";
import { UnderFenceConcreteStrips } from "./UnderFenceConcreteStrips";
import { SaveAllButton } from "./SaveAllButton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [summaryKey, setSummaryKey] = useState<number>(0);
  const [isSavingAll, setIsSavingAll] = useState(false);
  
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
    isSubmitting: isCopingSubmitting
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

  // Track previous values to prevent unnecessary saves
  const prevCopingRef = useRef({ copingCategory, groutColour, recessDraining });
  
  // Auto-save coping options when they change
  useEffect(() => {
    // Check if values actually changed
    const hasChanged = 
      prevCopingRef.current.copingCategory !== copingCategory ||
      prevCopingRef.current.groutColour !== groutColour ||
      prevCopingRef.current.recessDraining !== recessDraining;
    
    if (!hasChanged || !customerId || isLoadingCoping) return;
    
    // Update ref with new values
    prevCopingRef.current = { copingCategory, groutColour, recessDraining };
    
    const autoSaveCoping = async () => {
      const dataToSave = {
        coping_category: copingCategory || null,
        grout_colour: groutColour || null,
        recess_drainage: recessDraining || null
      };

      // Check if any record exists first
      const { data: existingData } = await supabase
        .from('pool_paving_selections')
        .select('id')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      // Perform upsert directly to avoid hook dependency issues
      const { error } = await supabase
        .from('pool_paving_selections')
        .upsert(
          {
            ...dataToSave,
            pool_project_id: customerId,
            ...(existingData?.id && { id: existingData.id })
          },
          { onConflict: 'pool_project_id' }
        );

      if (!error) {
        // Invalidate snapshot query after successful save
        queryClient.invalidateQueries({ 
          queryKey: ['project-snapshot', customerId] 
        });
      }
    };

    autoSaveCoping();
  }, [copingCategory, groutColour, recessDraining, customerId, isLoadingCoping, queryClient]);

  // Handle save for coping options (kept for manual save button if needed)
  const handleCopingSaveClick = async () => {
    const dataToSave = {
      coping_category: copingCategory || null,
      grout_colour: groutColour || null,
      recess_drainage: recessDraining || null
    };

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleCopingSave(dataToSave, 'pool_paving_selections');

    if (result.success) {
      refreshSummary();
    }
  };

  // Handle Save All functionality
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    
    try {
      // Since all components have auto-save, we just need to:
      // 1. Invalidate queries to ensure all data is fresh
      // 2. Show a success message
      
      // Invalidate the snapshot query to refresh all data
      await queryClient.invalidateQueries({ queryKey: ['project-snapshot', customerId] });
      
      // Refresh the summary to show latest data
      refreshSummary();
      
      toast.success("All concrete & paving data saved successfully");
    } catch (error) {
      console.error("Error saving all concrete & paving data:", error);
      toast.error("Failed to save all data");
    } finally {
      setIsSavingAll(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Included Coping Options Section */}
      <Card>
        <CardHeader className="bg-white pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Included Coping Options</h3>
            </div>
            <p className="text-muted-foreground">
              Configure coping category and grout colour options
            </p>
          </div>
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
      <ConcreteAndPavingSnapshotSummary
        pool={pool}
        customerId={customerId}
      />
      
      {/* Save All Button */}
      <SaveAllButton
        onSaveAll={handleSaveAll}
        isSubmitting={isSavingAll}
      />
    </div>
  );
};
