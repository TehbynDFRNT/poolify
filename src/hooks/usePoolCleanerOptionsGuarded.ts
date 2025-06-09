import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { PoolCleaner, mapDbToPoolCleaner } from "@/types/pool-cleaner";
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
                    .order('name');

                if (cleanersError) throw cleanersError;

                // Map database fields to our PoolCleaner interface
                const mappedCleaners = cleanersData ? cleanersData.map(mapDbToPoolCleaner) : [];
                setAvailableCleaners(mappedCleaners);
                console.log('Fetched pool cleaners:', mappedCleaners);

                // If there's a customer ID, fetch their existing selection
                if (customerId && poolId) {
                    console.log('Fetching existing selection for customer:', customerId, 'pool:', poolId);
                    const { data: selectionData, error: selectionError } = await supabase
                        .from('pool_cleaner_selections')
                        .select('*')
                        .eq('customer_id', customerId)
                        .eq('pool_id', poolId)
                        .maybeSingle();

                    if (selectionError) {
                        console.error('Error fetching existing selection:', selectionError);
                        throw selectionError;
                    }

                    console.log('Found existing selection:', selectionData);
                    if (selectionData) {
                        setSavedSelectionId(selectionData.id);
                        setIncludeCleaner(selectionData.include_cleaner || false);

                        // Find the selected cleaner in our available cleaners
                        if (selectionData.pool_cleaner_id && selectionData.include_cleaner) {
                            const selected = mappedCleaners.find(c => c.id === selectionData.pool_cleaner_id) || null;
                            console.log('Setting selected cleaner:', selected);
                            setSelectedCleaner(selected);
                        }
                    } else {
                        console.log('No existing selection found');
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

            // Remove total_cost as it doesn't exist in the database table
            const dataToSave = {
                customer_id: customerId,
                pool_id: poolId,
                include_cleaner: includeCleaner,
                pool_cleaner_id: includeCleaner && selectedCleaner ? selectedCleaner.id : null
            };

            console.log('Saving pool cleaner data:', dataToSave);

            // Additional check to ensure we don't create duplicates
            // This handles cases where savedSelectionId might not be set but a record exists
            if (!savedSelectionId) {
                const { data: existingRecords, error: checkError } = await supabase
                    .from('pool_cleaner_selections')
                    .select('id')
                    .eq('customer_id', customerId)
                    .eq('pool_id', poolId);

                if (checkError) {
                    console.error('Error checking for existing records:', checkError);
                    throw checkError;
                }

                if (existingRecords && existingRecords.length > 0) {
                    // Use the first record found
                    setSavedSelectionId(existingRecords[0].id);
                    console.log('Found existing record to update:', existingRecords[0].id);
                }
            }

            let result;
            if (savedSelectionId) {
                // Update existing record
                console.log('Updating existing record:', savedSelectionId);
                result = await supabase
                    .from('pool_cleaner_selections')
                    .update(dataToSave)
                    .eq('id', savedSelectionId);
            } else {
                // Check one more time for any existing records for this customer/pool
                const { data: lastCheck, error: lastCheckError } = await supabase
                    .from('pool_cleaner_selections')
                    .select('id')
                    .eq('customer_id', customerId)
                    .eq('pool_id', poolId);

                if (lastCheckError) {
                    console.error('Error in final check for existing records:', lastCheckError);
                    throw lastCheckError;
                }

                if (lastCheck && lastCheck.length > 0) {
                    // Update the existing record instead of creating a new one
                    console.log('Final check found existing record to update:', lastCheck[0].id);
                    result = await supabase
                        .from('pool_cleaner_selections')
                        .update(dataToSave)
                        .eq('id', lastCheck[0].id);

                    setSavedSelectionId(lastCheck[0].id);
                } else {
                    // Insert new record only if we're certain no record exists
                    console.log('Creating new record - no existing record found');
                    result = await supabase
                        .from('pool_cleaner_selections')
                        .insert([dataToSave])
                        .select();

                    if (result.data && result.data.length > 0) {
                        setSavedSelectionId(result.data[0].id);
                    }
                }
            }

            if (result.error) {
                console.error('Error saving pool cleaner selection:', result.error);
                throw result.error;
            }

            // Re-fetch the saved data to ensure UI is in sync with database
            const { data: refreshData, error: refreshError } = await supabase
                .from('pool_cleaner_selections')
                .select('*')
                .eq('customer_id', customerId)
                .eq('pool_id', poolId)
                .maybeSingle();

            if (refreshError) {
                console.warn('Error refreshing data after save:', refreshError);
            } else if (refreshData) {
                console.log('Refreshed data after save:', refreshData);

                // Update local state with the refreshed data
                setSavedSelectionId(refreshData.id);
                setIncludeCleaner(refreshData.include_cleaner || false);

                if (refreshData.pool_cleaner_id && refreshData.include_cleaner) {
                    const refreshedCleaner = availableCleaners.find(c => c.id === refreshData.pool_cleaner_id) || null;
                    setSelectedCleaner(refreshedCleaner);
                }
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