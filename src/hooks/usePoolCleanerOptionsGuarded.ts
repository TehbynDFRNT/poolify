import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { PoolCleaner } from "@/types/pool-cleaner";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const usePoolCleanerOptionsGuarded = (poolId: string, customerId: string | null) => {
    const [isLoading, setIsLoading] = useState(true);
    const [availableCleaners, setAvailableCleaners] = useState<PoolCleaner[]>([]);
    const [selectedCleaner, setSelectedCleaner] = useState<PoolCleaner | null>(null);
    const [includeCleaner, setIncludeCleaner] = useState(false);
    const [savedSelectionId, setSavedSelectionId] = useState<string | null>(null);

    // Calculate the total cost
    const totalCost = includeCleaner && selectedCleaner ? selectedCleaner.rrp : 0;
    const margin = includeCleaner && selectedCleaner ? selectedCleaner.margin : 0;

    // Fetch available pool cleaners and existing selection
    useEffect(() => {
        const fetchPoolCleaners = async () => {
            setIsLoading(true);
            try {
                // Fetch available pool cleaners
                const { data: cleanersData, error: cleanersError } = await supabase
                    .from('pool_cleaners')
                    .select('*')
                    .order('display_order');

                if (cleanersError) throw cleanersError;
                setAvailableCleaners(cleanersData || []);

                // If there's a customer ID, fetch their existing selection
                if (customerId && poolId) {
                    const { data: selectionData, error: selectionError } = await supabase
                        .from('pool_cleaner_selections')
                        .select('*')
                        .eq('customer_id', customerId)
                        .eq('pool_id', poolId)
                        .maybeSingle();

                    if (selectionError) throw selectionError;

                    if (selectionData) {
                        setSavedSelectionId(selectionData.id);
                        setIncludeCleaner(selectionData.include_cleaner || false);

                        // Find the selected cleaner in our available cleaners
                        if (selectionData.pool_cleaner_id && selectionData.include_cleaner) {
                            const selected = cleanersData?.find(c => c.id === selectionData.pool_cleaner_id) || null;
                            setSelectedCleaner(selected);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching pool cleaners:', error);
                toast.error('Failed to load pool cleaner options');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPoolCleaners();
    }, [customerId, poolId]);

    // Guarded save mutation
    const {
        mutate: savePoolCleanerSelectionMutation,
        isPending: isSaving,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!customerId || !poolId) {
                throw new Error("Customer and pool information is required");
            }

            const dataToSave = {
                customer_id: customerId,
                pool_id: poolId,
                include_cleaner: includeCleaner,
                pool_cleaner_id: includeCleaner && selectedCleaner ? selectedCleaner.id : null,
                total_cost: totalCost,
                margin: margin
            };

            let result;
            if (savedSelectionId) {
                // Update existing record
                result = await supabase
                    .from('pool_cleaner_selections')
                    .update(dataToSave)
                    .eq('id', savedSelectionId);
            } else {
                // Insert new record
                result = await supabase
                    .from('pool_cleaner_selections')
                    .insert([dataToSave])
                    .select();

                if (result.data && result.data.length > 0) {
                    setSavedSelectionId(result.data[0].id);
                }
            }

            if (result.error) {
                console.error('Error saving pool cleaner selection:', result.error);
                throw result.error;
            }

            return true;
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success('Pool cleaner selection saved successfully');
            },
            onError: (error) => {
                console.error('Error saving pool cleaner selection:', error);
                toast.error('Failed to save pool cleaner selection');
            }
        }
    });

    const savePoolCleanerSelection = async () => {
        savePoolCleanerSelectionMutation();
    };

    return {
        isLoading,
        availableCleaners,
        selectedCleaner,
        setSelectedCleaner,
        includeCleaner,
        setIncludeCleaner,
        isSaving,
        savePoolCleanerSelection,
        totalCost,
        margin,
        StatusWarningDialog
    };
}; 