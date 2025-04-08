
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useExtraConcreting } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/ExtraConcreting/hooks/useExtraConcreting";
import { ConcretingTypeSelector } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/ExtraConcreting/components/ConcretingTypeSelector";
import { MeterageInput } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/ExtraConcreting/components/MeterageInput";
import { CostDisplay } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/ExtraConcreting/components/CostDisplay";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExtraConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraConcreting: React.FC<ExtraConcretingProps> = ({ pool, customerId }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the hook for extra concreting functionality
  const {
    selectedType,
    meterage,
    totalCost,
    extraConcretingItems,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice,
    hasExistingData,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm
  } = useExtraConcreting(() => fetchExistingData());
  
  // Fetch existing data when component mounts
  useEffect(() => {
    fetchExistingData();
  }, [customerId]);

  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select('extra_concreting_type, extra_concreting_square_meters, extra_concreting_total_cost')
        .eq('id', customerId)
        .single();

      if (error) throw error;

      if (data && data.extra_concreting_type) {
        handleTypeChange(data.extra_concreting_type);
        
        if (data.extra_concreting_square_meters) {
          // We need to manually update the meterage field
          const event = {
            target: { value: data.extra_concreting_square_meters.toString() }
          } as React.ChangeEvent<HTMLInputElement>;
          handleMeterageChange(event);
        }
      }
    } catch (error) {
      console.error("Error fetching extra concreting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedType || meterage <= 0) {
      toast.error("Please select a concrete type and enter a valid meterage.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_concreting_type: selectedType,
          extra_concreting_square_meters: meterage,
          extra_concreting_total_cost: totalCost
        })
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success("Extra concreting details saved successfully.");
    } catch (error) {
      console.error("Error saving extra concreting:", error);
      toast.error("Failed to save extra concreting details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_concreting_type: null,
          extra_concreting_square_meters: null,
          extra_concreting_total_cost: null
        })
        .eq('id', customerId);

      if (error) throw error;
      
      // Reset form
      handleTypeChange('');
      const resetEvent = {
        target: { value: '0' }
      } as React.ChangeEvent<HTMLInputElement>;
      handleMeterageChange(resetEvent);
      
      setShowDeleteConfirm(false);
      toast.success("Extra concreting removed successfully.");
    } catch (error) {
      console.error("Error removing extra concreting:", error);
      toast.error("Failed to remove extra concreting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-0">
        <h3 className="text-lg font-semibold">Extra Concreting</h3>
        <p className="text-sm text-muted-foreground">Add extra concrete to your project</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConcretingTypeSelector
            selectedType={selectedType}
            extraConcretingItems={extraConcretingItems}
            isLoading={isLoading}
            onTypeChange={handleTypeChange}
          />
          
          <MeterageInput
            meterage={meterage}
            isLoading={isLoading}
            onChange={handleMeterageChange}
          />
        </div>
        
        <CostDisplay
          totalCost={totalCost}
          itemPrice={getSelectedPrice()}
          meterage={meterage}
          isVisible={selectedType !== '' && meterage > 0}
          isLoading={isLoading}
        />
        
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || !selectedType || meterage <= 0}
            className="bg-primary"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          {hasExistingData && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isLoading}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra concreting data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
