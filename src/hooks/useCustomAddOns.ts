import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { PoolGeneralExtraInsert } from "@/types/pool-general-extra";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

export interface CustomAddOn {
  id: string;
  name: string;
  cost: number;
  margin: number;
  rrp: number; // calculated as cost + margin
}

export const useCustomAddOns = (customerId: string | null) => {
  const queryClient = useQueryClient();
  const [customAddOns, setCustomAddOns] = useState<CustomAddOn[]>([]);

  // Load existing custom add-ons from the database
  const { data: existingCustomAddOns, isLoading } = useQuery({
    queryKey: ['custom-add-ons', customerId],
    queryFn: async () => {
      if (!customerId) return [];

      try {
        const { data, error } = await supabase
          .from('pool_general_extras' as any)
          .select('*')
          .eq('pool_project_id', customerId)
          .eq('type', 'custom')
          .order('created_at');

        if (error) throw error;

        // Map database records to CustomAddOn interface
        return data.map((item: any) => ({
          id: item.id, // Use the database ID as the custom ID
          name: item.name,
          cost: Number(item.cost),
          margin: Number(item.margin),
          rrp: Number(item.rrp)
        })) as CustomAddOn[];
      } catch (error) {
        console.error("Error fetching custom add-ons:", error);
        return [];
      }
    },
    enabled: !!customerId
  });

  // Sync state with database data
  React.useEffect(() => {
    if (existingCustomAddOns) {
      setCustomAddOns(existingCustomAddOns);
    }
  }, [existingCustomAddOns]);

  // Calculate totals
  const totals = {
    totalCost: customAddOns.reduce((sum, item) => sum + item.cost, 0),
    totalMargin: customAddOns.reduce((sum, item) => sum + item.margin, 0),
    totalRrp: customAddOns.reduce((sum, item) => sum + item.rrp, 0)
  };

  // Guarded save mutation
  const {
    mutate: saveCustomAddOnsMutation,
    isPending: isSaving,
    StatusWarningDialog
  } = useGuardedMutation({
    projectId: customerId || '',
    mutationFn: async () => {
      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      // Delete existing custom add-ons first
      await supabase
        .from('pool_general_extras' as any)
        .delete()
        .eq('pool_project_id', customerId)
        .eq('type', 'custom');

      // Prepare new records for insertion
      const toInsert: PoolGeneralExtraInsert[] = customAddOns.map((addOn, index) => ({
        pool_project_id: customerId,
        general_extra_id: '988e89c5-71d7-4bbd-9664-33a24d7c1ffb', // Reference to the custom placeholder in general_extras
        name: addOn.name,
        sku: `CUSTOM-${String(index + 1).padStart(3, '0')}`, // Generate SKU like CUSTOM-001
        type: 'custom' as const,
        description: addOn.name,
        quantity: 1,
        cost: addOn.cost,
        margin: addOn.margin,
        rrp: addOn.rrp
      }));

      // Insert new records if any
      if (toInsert.length > 0) {
        const { error } = await supabase
          .from('pool_general_extras' as any)
          .insert(toInsert);

        if (error) throw error;
      }

      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        toast.success("Custom add-ons saved successfully");
        // Refresh the query to get updated data
        queryClient.invalidateQueries({ queryKey: ['custom-add-ons', customerId] });
        queryClient.invalidateQueries({ queryKey: ['pool-general-extras', customerId] });
      },
      onError: (error) => {
        console.error("Error saving custom add-ons:", error);
        toast.error("Failed to save custom add-ons");
      },
    },
  });

  // Add a new custom add-on
  const addCustomAddOn = useCallback(() => {
    const newAddOn: CustomAddOn = {
      id: crypto.randomUUID(),
      name: "",
      cost: 0,
      margin: 0,
      rrp: 0
    };
    setCustomAddOns(prev => [...prev, newAddOn]);
  }, []);

  // Remove a custom add-on
  const removeCustomAddOn = useCallback((id: string) => {
    setCustomAddOns(prev => prev.filter(addOn => addOn.id !== id));
  }, []);

  // Update a custom add-on
  const updateCustomAddOn = useCallback((id: string, field: 'name' | 'cost' | 'margin', value: string) => {
    setCustomAddOns(prev => prev.map(addOn => {
      if (addOn.id === id) {
        if (field === 'cost' || field === 'margin') {
          const numericValue = parseFloat(value) || 0;
          const updatedAddOn = { ...addOn, [field]: numericValue };
          // Recalculate rrp when cost or margin changes
          updatedAddOn.rrp = updatedAddOn.cost + updatedAddOn.margin;
          return updatedAddOn;
        }
        return { ...addOn, [field]: value };
      }
      return addOn;
    }));
  }, []);

  // Save function
  const saveCustomAddOns = useCallback(() => {
    saveCustomAddOnsMutation();
  }, [saveCustomAddOnsMutation]);

  return {
    customAddOns,
    isLoading,
    isSaving,
    totals,
    addCustomAddOn,
    removeCustomAddOn,
    updateCustomAddOn,
    saveCustomAddOns,
    StatusWarningDialog
  };
};