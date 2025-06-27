import { Button } from "@/components/ui/button";
import { usePoolGeneralExtrasGuarded } from "@/hooks/usePoolGeneralExtrasGuarded";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { CustomAddOns } from "./CustomAddOns";
import { DeckJetsSection } from "./DeckJetsSection";
import { GeneralOptionsSummary } from "./GeneralOptionsSummary";
import { HandGrabRailSection } from "./HandGrabRailSection";
import { MiscItemsSection } from "./MiscItemsSection";
import { PoolAutomationSection } from "./PoolAutomationSection";
import { SpaJetsSection } from "./SpaJetsSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGeneralExtras } from "@/hooks/useGeneralExtras";
import { PoolGeneralExtraInsert } from "@/types/pool-general-extra";

interface GeneralOptionsContentProps {
    pool: Pool;
    customerId: string | null;
}

export const GeneralOptionsContent: React.FC<GeneralOptionsContentProps> = ({
    pool,
    customerId
}) => {
    const queryClient = useQueryClient();
    const { generalExtras } = useGeneralExtras();
    
    const {
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
    } = usePoolGeneralExtrasGuarded(pool.id, customerId);

    // Auto-save effect with direct Supabase calls
    useEffect(() => {
        if (!customerId || !pool.id || !generalExtras || isLoading) return;

        const timer = setTimeout(async () => {
            try {
                console.log('🔄 Auto-saving general extras...');
                
                // Delete existing extras first
                await supabase
                    .from('pool_general_extras')
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
                        .from('pool_general_extras')
                        .insert(toInsert);

                    if (error) throw error;
                }

                // Invalidate queries to refresh data
                await queryClient.invalidateQueries({ queryKey: ['pool-general-extras', customerId, pool.id] });
                console.log('✅ General extras auto-saved successfully');
            } catch (error) {
                console.error("Error auto-saving general extras:", error);
                toast.error("Failed to auto-save general extras");
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [
        state.spaJets.selected,
        state.spaJets.extraId,
        state.spaJets.quantity,
        state.deckJets.selected,
        state.deckJets.extraId,
        state.handGrabRail.selected,
        state.handGrabRail.extraId,
        state.automation.selected,
        state.automation.extraId,
        state.chemistry.selected,
        state.chemistry.extraId,
        state.bundle.selected,
        state.bundle.extraId,
        JSON.stringify(state.miscItems.items), // Stringify to create stable dependency
        customerId,
        pool.id,
        generalExtras?.length // Use length as stable dependency
    ]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading general options...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground mb-6">
                Enhance your pool with additional features like spa jets, deck jets, and other accessories.
                These extras can be customized to fit your specific needs and preferences.
            </p>


            <SpaJetsSection
                key={`spa-jets-${state.spaJets.selected}`}
                spaJets={filteredExtras.spaJets}
                selected={state.spaJets.selected}
                selectedId={state.spaJets.extraId}
                quantity={state.spaJets.quantity}
                onSetSelected={setSpaJetsSelected}
                onSetSelectedId={setSpaJetsExtraId}
                onSetQuantity={setSpaJetsQuantity}
                getExtraById={getExtraById}
            />

            <DeckJetsSection
                key={`deck-jets-${state.deckJets.selected}`}
                deckJets={filteredExtras.deckJets}
                selected={state.deckJets.selected}
                selectedId={state.deckJets.extraId}
                onSetSelected={setDeckJetsSelected}
                onSetSelectedId={setDeckJetsExtraId}
                getExtraById={getExtraById}
            />

            <HandGrabRailSection
                key={`hand-grab-rail-${state.handGrabRail.selected}`}
                handGrabRails={filteredExtras.handGrabRail}
                selected={state.handGrabRail.selected}
                selectedId={state.handGrabRail.extraId}
                onSetSelected={setHandGrabRailSelected}
                onSetSelectedId={setHandGrabRailExtraId}
                getExtraById={getExtraById}
            />

            {/* PoolAutomationSection temporarily hidden - keeping backend plumbing intact */}
            {/* <PoolAutomationSection
                automationExtras={filteredExtras.automation}
                chemistryExtras={filteredExtras.chemistry}
                bundleExtras={filteredExtras.bundle}
                state={{
                    automation: state.automation,
                    chemistry: state.chemistry,
                    bundle: state.bundle
                }}
                onSetAutomationSelected={setAutomationSelected}
                onSetAutomationId={setAutomationExtraId}
                onSetChemistrySelected={setChemistrySelected}
                onSetChemistryId={setChemistryExtraId}
                onSetBundleSelected={setBundleSelected}
                onSetBundleId={setBundleExtraId}
                getExtraById={getExtraById}
            /> */}

            <MiscItemsSection
                miscItems={filteredExtras.misc}
                selectedItems={state.miscItems.items}
                onAddItem={addMiscItem}
                onRemoveItem={removeMiscItem}
                onUpdateQuantity={updateMiscItemQuantity}
                getExtraById={getExtraById}
            />

            <CustomAddOns customerId={customerId} />

            <GeneralOptionsSummary
                state={state}
                getExtraById={getExtraById}
                totalCost={totals.totalRrp}
                customerId={customerId}
            />

            {/* Status Warning Dialog */}
            <StatusWarningDialog />
        </div>
    );
}; 