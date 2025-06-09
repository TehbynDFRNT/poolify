import { Button } from "@/components/ui/button";
import { usePoolGeneralExtrasGuarded } from "@/hooks/usePoolGeneralExtrasGuarded";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React from "react";
import { DeckJetsSection } from "./DeckJetsSection";
import { GeneralOptionsSummary } from "./GeneralOptionsSummary";
import { MiscItemsSection } from "./MiscItemsSection";
import { SpaJetsSection } from "./SpaJetsSection";

interface GeneralOptionsContentProps {
    pool: Pool;
    customerId: string | null;
}

export const GeneralOptionsContent: React.FC<GeneralOptionsContentProps> = ({
    pool,
    customerId
}) => {
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
        addMiscItem,
        removeMiscItem,
        updateMiscItemQuantity,
        getExtraById,
        StatusWarningDialog
    } = usePoolGeneralExtrasGuarded(pool.id, customerId);

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

            <MiscItemsSection
                miscItems={filteredExtras.misc}
                selectedItems={state.miscItems.items}
                onAddItem={addMiscItem}
                onRemoveItem={removeMiscItem}
                onUpdateQuantity={updateMiscItemQuantity}
                getExtraById={getExtraById}
            />

            <GeneralOptionsSummary
                state={state}
                getExtraById={getExtraById}
                totalCost={totals.totalRrp}
            />

            {customerId && (
                <div className="flex justify-end mt-6">
                    <Button
                        onClick={saveGeneralExtras}
                        disabled={isSaving || isLoading}
                        className="flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isSaving ? 'Saving...' : 'Save General Options'}
                    </Button>
                </div>
            )}

            {/* Status Warning Dialog */}
            <StatusWarningDialog />
        </div>
    );
}; 