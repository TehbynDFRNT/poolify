import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { GeneralExtra } from "@/types/general-extra";
import { PoolGeneralExtra, PoolGeneralExtraInsert, PoolGeneralExtrasState, mapDbToPoolGeneralExtra } from "@/types/pool-general-extra";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useRef } from "react";
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
        handGrabRail: {
            selected: false,
            extraId: null
        },
        automation: {
            selected: false,
            extraId: null
        },
        chemistry: {
            selected: false,
            extraId: null
        },
        bundle: {
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
        handGrabRail: poolExtras?.filter(extra => extra.type === 'Hand Grab Rail') || [],
        misc: poolExtras?.filter(extra => extra.type === 'Misc') || []
    };

    // Track if initial load has been done to prevent re-initialization
    const hasInitializedRef = useRef(false);
    const prevPoolExtrasRef = useRef<string>('');

    // Initialize state based on existing selections
    useEffect(() => {
        if (!poolExtras || !generalExtras) {
            return;
        }

        // Create a stable key for poolExtras to detect actual changes
        const poolExtrasKey = JSON.stringify(poolExtras.map(e => ({ id: e.id, type: e.type, general_extra_id: e.general_extra_id })));
        
        // Skip if we've already initialized with this exact data
        if (hasInitializedRef.current && prevPoolExtrasRef.current === poolExtrasKey) {
            return;
        }

        console.log('🔄 Initializing state from poolExtras:', poolExtras);
        
        // Group extras by type inside the effect to avoid circular dependency
        const spaJets = poolExtras.filter(extra => extra.type === 'Spa Jets');
        const deckJets = poolExtras.filter(extra => extra.type === 'Deck Jets');
        const handGrabRails = poolExtras.filter(extra => extra.type === 'Hand Grab Rail');
        const automationItems = poolExtras.filter(extra => extra.type === 'Automation');
        const chemistryItems = poolExtras.filter(extra => extra.type === 'Chemistry');
        const bundleItems = poolExtras.filter(extra => extra.type === 'Bundle');
        const miscItems = poolExtras.filter(extra => extra.type === 'Misc');

        console.log('📊 Found items by type:', {
            spaJets: spaJets.length,
            deckJets: deckJets.length,
            handGrabRails: handGrabRails.length,
            automationItems: automationItems.length,
            chemistryItems: chemistryItems.length,
            bundleItems: bundleItems.length,
            miscItems: miscItems.length
        });

        // Find Spa Jets
        const spaJet = spaJets[0]; // Assuming only one selected

        // Find Deck Jets
        const deckJet = deckJets[0]; // Assuming only one selected

        // Find Hand Grab Rail
        const handGrabRail = handGrabRails[0]; // Assuming only one selected

        // Find automation, chemistry, bundle
        const automation = automationItems[0];
        const chemistry = chemistryItems[0];
        const bundle = bundleItems[0];

        console.log('🤖 Automation data:', automation);
        console.log('🧪 Chemistry data:', chemistry);
        console.log('📦 Bundle data:', bundle);
        
        // Log the raw items to debug
        if (automationItems.length > 0) {
            console.log('🤖 Raw automation items from DB:', automationItems);
        }
        if (chemistryItems.length > 0) {
            console.log('🧪 Raw chemistry items from DB:', chemistryItems);
        }
        if (bundleItems.length > 0) {
            console.log('📦 Raw bundle items from DB:', bundleItems);
        }

        // Map misc items
        const miscItemsState = miscItems.map(item => ({
            extraId: item.general_extra_id,
            quantity: item.quantity
        }));

        // Create new state object
        const newState = {
            spaJets: {
                selected: !!spaJet,
                extraId: spaJet?.general_extra_id || null,
                quantity: spaJet?.quantity || 4
            },
            deckJets: {
                selected: !!deckJet,
                extraId: deckJet?.general_extra_id || null
            },
            handGrabRail: {
                selected: !!handGrabRail,
                extraId: handGrabRail?.general_extra_id || null
            },
            automation: {
                // If bundle exists, automation is selected
                selected: !!automation || !!bundle,
                // Use existing automation ID, or set to first available if bundle exists
                extraId: automation?.general_extra_id || 
                        (bundle && generalExtras?.find(e => e.type === 'Automation')?.id) || 
                        null
            },
            chemistry: {
                // If bundle exists, chemistry is selected  
                selected: !!chemistry || !!bundle,
                // Use existing chemistry ID, or set to first available if bundle exists
                extraId: chemistry?.general_extra_id || 
                        (bundle && generalExtras?.find(e => e.type === 'Chemistry')?.id) || 
                        null
            },
            bundle: {
                selected: !!bundle,
                extraId: bundle?.general_extra_id || null
            },
            miscItems: {
                items: miscItemsState
            }
        };

        console.log('📝 New state to set:', newState);
        setState(newState);
        
        // Mark as initialized and store the key
        hasInitializedRef.current = true;
        prevPoolExtrasRef.current = poolExtrasKey;
        
    }, [poolExtras?.length, generalExtras?.length]); // Use lengths as stable dependencies

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

            // Add Hand Grab Rail if selected
            if (state.handGrabRail.selected && state.handGrabRail.extraId) {
                const extra = generalExtras.find(e => e.id === state.handGrabRail.extraId);
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

            // Handle Automation/Chemistry/Bundle logic
            if (state.bundle.selected && state.bundle.extraId) {
                // If bundle is selected, ONLY add the bundle
                const extra = generalExtras.find(e => e.id === state.bundle.extraId);
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
            } else {
                // If bundle is NOT selected, add individual selections
                
                // Add Automation if selected
                if (state.automation.selected && state.automation.extraId) {
                    const extra = generalExtras.find(e => e.id === state.automation.extraId);
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

                // Add Chemistry if selected
                if (state.chemistry.selected && state.chemistry.extraId) {
                    const extra = generalExtras.find(e => e.id === state.chemistry.extraId);
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
        handGrabRail: generalExtras?.filter(extra => extra.type === 'Hand Grab Rail') || [],
        misc: generalExtras?.filter(extra => extra.type === 'Misc') || [],
        automation: generalExtras?.filter(extra => extra.type === 'Automation') || [],
        chemistry: generalExtras?.filter(extra => extra.type === 'Chemistry') || [],
        bundle: generalExtras?.filter(extra => extra.type === 'Bundle') || []
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

    const setHandGrabRailSelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            handGrabRail: {
                ...prev.handGrabRail,
                selected
            }
        }));
    };

    const setHandGrabRailExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            handGrabRail: {
                ...prev.handGrabRail,
                extraId
            }
        }));
    };

    const setAutomationSelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            automation: {
                ...prev.automation,
                selected
            }
        }));
    };

    const setAutomationExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            automation: {
                ...prev.automation,
                extraId
            }
        }));
    };

    const setChemistrySelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            chemistry: {
                ...prev.chemistry,
                selected
            }
        }));
    };

    const setChemistryExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            chemistry: {
                ...prev.chemistry,
                extraId
            }
        }));
    };

    const setBundleSelected = (selected: boolean) => {
        setState(prev => ({
            ...prev,
            bundle: {
                ...prev.bundle,
                selected
            }
        }));
    };

    const setBundleExtraId = (extraId: string | null) => {
        setState(prev => ({
            ...prev,
            bundle: {
                ...prev.bundle,
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
        setHandGrabRailSelected,
        setHandGrabRailExtraId,
        setAutomationSelected,
        setAutomationExtraId,
        setChemistrySelected,
        setChemistryExtraId,
        setBundleSelected,
        setBundleExtraId,
        addMiscItem,
        removeMiscItem,
        updateMiscItemQuantity,
        getExtraById,
        StatusWarningDialog
    };
}; 