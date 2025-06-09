import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { GeneralExtra } from "@/types/general-extra";
import { PoolGeneralExtra, PoolGeneralExtraInsert, PoolGeneralExtrasState, mapDbToPoolGeneralExtra } from "@/types/pool-general-extra";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGeneralExtras } from "./useGeneralExtras";

export const usePoolGeneralExtrasGuarded = (poolId: string, customerId: string | null) => {
    const queryClient = useQueryClient();
    const { generalExtras } = useGeneralExtras();

    const [state, setState] = useState<PoolGeneralExtrasState>({
        spaJets: {
            selected: false,
            extraId: null,
            quantity: 4 // Default to 4 jets
        },
        deckJets: {
            selected: false,
            extraId: null
        },
        miscItems: {
            items: []
        }
    });

    // Get all extras attached to this pool project
    const { data: poolExtras, isLoading } = useQuery({
        queryKey: ['pool-general-extras', customerId, poolId],
        queryFn: async () => {
            if (!customerId || !poolId) return [];

            try {
                // Use type assertion to fix TypeScript error
                const { data, error } = await supabase
                    .from('pool_general_extras' as any)
                    .select('*')
                    .eq('pool_project_id', customerId)
                    .order('created_at');

                if (error) throw error;

                return data.map(mapDbToPoolGeneralExtra) as PoolGeneralExtra[];
            } catch (error) {
                console.error("Error fetching pool general extras:", error);
                return [];
            }
        },
        enabled: !!customerId && !!poolId
    });

    // Calculate totals
    const totals = {
        totalCost: poolExtras?.reduce((sum, item) => sum + item.total_cost, 0) || 0,
        totalMargin: poolExtras?.reduce((sum, item) => sum + item.total_margin, 0) || 0,
        totalRrp: poolExtras?.reduce((sum, item) => sum + item.total_rrp, 0) || 0
    };

    // Group extras by type
    const extrasByType = {
        spaJets: poolExtras?.filter(extra => extra.type === 'Spa Jets') || [],
        deckJets: poolExtras?.filter(extra => extra.type === 'Deck Jets') || [],
        misc: poolExtras?.filter(extra => extra.type === 'Misc') || []
    };

    // Initialize state based on existing selections
    useEffect(() => {
        if (poolExtras && generalExtras) {
            // Group extras by type inside the effect to avoid circular dependency
            const spaJets = poolExtras.filter(extra => extra.type === 'Spa Jets');
            const deckJets = poolExtras.filter(extra => extra.type === 'Deck Jets');
            const miscItems = poolExtras.filter(extra => extra.type === 'Misc');

            // Find Spa Jets
            const spaJet = spaJets[0]; // Assuming only one selected

            // Find Deck Jets
            const deckJet = deckJets[0]; // Assuming only one selected

            // Map misc items
            const miscItemsState = miscItems.map(item => ({
                extraId: item.general_extra_id,
                quantity: item.quantity
            }));

            setState({
                spaJets: {
                    selected: !!spaJet,
                    extraId: spaJet?.general_extra_id || null,
                    quantity: spaJet?.quantity || 4
                },
                deckJets: {
                    selected: !!deckJet,
                    extraId: deckJet?.general_extra_id || null
                },
                miscItems: {
                    items: miscItemsState
                }
            });
        }
    }, [poolExtras, generalExtras]);

    // Guarded save mutation
    const {
        mutate: saveGeneralExtrasMutation,
        isPending: isSaving,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!customerId || !poolId || !generalExtras) {
                throw new Error("Customer ID, Pool ID and General Extras are required");
            }

            // Delete existing extras first
            await supabase
                .from('pool_general_extras' as any)
                .delete()
                .eq('pool_project_id', customerId);

            const toInsert: PoolGeneralExtraInsert[] = [];

            // Add Spa Jets if selected
            if (state.spaJets.selected && state.spaJets.extraId) {
                const extra = generalExtras.find(e => e.id === state.spaJets.extraId);
                if (extra) {
                    toInsert.push({
                        pool_project_id: customerId,
                        general_extra_id: extra.id,
                        name: extra.name,
                        sku: extra.sku,
                        type: extra.type,
                        description: extra.description,
                        quantity: state.spaJets.quantity,
                        cost: extra.cost,
                        margin: extra.margin,
                        rrp: extra.rrp
                    });
                }
            }

            // Add Deck Jets if selected
            if (state.deckJets.selected && state.deckJets.extraId) {
                const extra = generalExtras.find(e => e.id === state.deckJets.extraId);
                if (extra) {
                    toInsert.push({
                        pool_project_id: customerId,
                        general_extra_id: extra.id,
                        name: extra.name,
                        sku: extra.sku,
                        type: extra.type,
                        description: extra.description,
                        quantity: 1,
                        cost: extra.cost,
                        margin: extra.margin,
                        rrp: extra.rrp
                    });
                }
            }

            // Add Misc items
            for (const item of state.miscItems.items) {
                const extra = generalExtras.find(e => e.id === item.extraId);
                if (extra) {
                    toInsert.push({
                        pool_project_id: customerId,
                        general_extra_id: extra.id,
                        name: extra.name,
                        sku: extra.sku,
                        type: extra.type,
                        description: extra.description,
                        quantity: item.quantity,
                        cost: extra.cost,
                        margin: extra.margin,
                        rrp: extra.rrp
                    });
                }
            }

            // Insert new extras
            if (toInsert.length > 0) {
                const { error } = await supabase
                    .from('pool_general_extras' as any)
                    .insert(toInsert);

                if (error) throw error;
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['pool-general-extras', customerId, poolId] });

            return true;
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("General extras saved successfully");
            },
            onError: (error) => {
                console.error("Error saving general extras:", error);
                toast.error("Failed to save general extras");
            },
        },
    });

    // Save selections to database with the guarded mutation
    const saveGeneralExtras = useCallback(async () => {
        if (!customerId || !poolId || !generalExtras) return;
        saveGeneralExtrasMutation();
    }, [customerId, poolId, generalExtras, state, saveGeneralExtrasMutation]);

    // Filter extras by type
    const filteredExtras = {
        spaJets: generalExtras?.filter(extra => extra.type === 'Spa Jets') || [],
        deckJets: generalExtras?.filter(extra => extra.type === 'Deck Jets') || [],
        misc: generalExtras?.filter(extra => extra.type === 'Misc') || []
    };

    // Helper functions to update state
    const setSpaJetsSelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            spaJets: {
                ...prev.spaJets,
                selected
            }
        }));
    };

    const setSpaJetsExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            spaJets: {
                ...prev.spaJets,
                extraId
            }
        }));
    };

    const setSpaJetsQuantity = (quantity: number) => {
        // Only allow 4 or 6
        if (quantity !== 4 && quantity !== 6) return;

        setState(prev => ({
            ...prev,
            spaJets: {
                ...prev.spaJets,
                quantity
            }
        }));
    };

    const setDeckJetsSelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            deckJets: {
                ...prev.deckJets,
                selected
            }
        }));
    };

    const setDeckJetsExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            deckJets: {
                ...prev.deckJets,
                extraId
            }
        }));
    };

    const addMiscItem = (extraId: string, quantity: number = 1) => {
        setState(prev => ({
            ...prev,
            miscItems: {
                items: [...prev.miscItems.items.filter(i => i.extraId !== extraId), { extraId, quantity }]
            }
        }));
    };

    const removeMiscItem = (extraId: string) => {
        setState(prev => ({
            ...prev,
            miscItems: {
                items: prev.miscItems.items.filter(i => i.extraId !== extraId)
            }
        }));
    };

    const updateMiscItemQuantity = (extraId: string, quantity: number) => {
        if (quantity < 1) return; // Don't allow less than 1

        setState(prev => ({
            ...prev,
            miscItems: {
                items: prev.miscItems.items.map(i =>
                    i.extraId === extraId ? { ...i, quantity } : i
                )
            }
        }));
    };

    const getExtraById = (id: string): GeneralExtra | undefined => {
        return generalExtras?.find(e => e.id === id);
    };

    return {
        state,
        filteredExtras,
        isLoading,
        isSaving,
        totals,
        saveGeneralExtras,
        setSpaJetsSelected,
        setSpaJetsExtraId,
        setSpaJetsQuantity,
        setDeckJetsSelected,
        setDeckJetsExtraId,
        addMiscItem,
        removeMiscItem,
        updateMiscItemQuantity,
        getExtraById,
        StatusWarningDialog
    };
}; 