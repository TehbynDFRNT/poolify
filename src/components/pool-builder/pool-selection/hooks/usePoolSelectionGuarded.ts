import { useGuardedMutation } from '@/hooks/useGuardedMutation';
import { usePools } from '@/hooks/usePools';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '@/types/pool';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const usePoolSelectionGuarded = (customerId?: string | null) => {
    const { data: pools, isLoading, error } = usePools();
    const [selectedPoolId, setSelectedPoolId] = useState("");
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

    // Group pools by range for better organization
    const poolsByRange = pools?.reduce((acc, pool) => {
        if (!acc[pool.range]) {
            acc[pool.range] = [];
        }
        acc[pool.range].push(pool);
        return acc;
    }, {} as Record<string, Pool[]>) || {};

    // Fetch existing pool selection if customer ID is available
    useEffect(() => {
        if (customerId) {
            fetchPoolSelection();
        }
    }, [customerId]);

    const fetchPoolSelection = async () => {
        if (!customerId) return;

        try {
            const { data, error } = await supabase
                .from('pool_projects')
                .select('pool_specification_id, pool_color')
                .eq('id', customerId)
                .single();

            if (error) {
                console.error("Error fetching pool selection:", error);
                return;
            }

            if (data) {
                if (data.pool_specification_id) {
                    setSelectedPoolId(data.pool_specification_id);
                }

                if (data.pool_color) {
                    setSelectedColor(data.pool_color);
                }
            }
        } catch (error) {
            console.error("Error in fetchPoolSelection:", error);
        }
    };

    // When a pool is selected, set the default color if available
    useEffect(() => {
        if (selectedPoolId && pools) {
            const pool = pools.find(p => p.id === selectedPoolId);
            if (pool && pool.color) {
                setSelectedColor(pool.color);
            }
        }
    }, [selectedPoolId, pools]);

    // Get the selected pool details
    const selectedPool = pools?.find(p => p.id === selectedPoolId);

    // Guarded mutation for saving pool selection
    const {
        mutate: savePoolSelection,
        isPending: isSubmitting,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!customerId || !selectedPoolId) {
                throw new Error("Please select a pool model first.");
            }

            const { error } = await supabase
                .from('pool_projects')
                .update({
                    pool_specification_id: selectedPoolId,
                    pool_color: selectedColor
                })
                .eq('id', customerId);

            if (error) throw error;
            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Pool selection saved successfully");
            },
            onError: (error) => {
                console.error("Error saving pool selection:", error);
                toast.error("Failed to save pool selection. Please try again.");
            },
        },
    });

    const handleSavePoolSelection = async () => {
        savePoolSelection();
    };

    return {
        pools,
        poolsByRange,
        isLoading,
        error,
        selectedPoolId,
        setSelectedPoolId,
        selectedColor,
        setSelectedColor,
        isSubmitting,
        selectedPool,
        handleSavePoolSelection,
        StatusWarningDialog,
    };
}; 