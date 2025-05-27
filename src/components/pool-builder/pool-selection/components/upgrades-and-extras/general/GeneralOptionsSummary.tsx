import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralExtra } from "@/types/general-extra";
import { PoolGeneralExtrasState } from "@/types/pool-general-extra";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, Package } from "lucide-react";
import React, { useMemo } from "react";

interface GeneralOptionsSummaryProps {
    state: PoolGeneralExtrasState;
    getExtraById: (id: string) => GeneralExtra | undefined;
    totalCost: number; // Database total (only used after saving)
}

export const GeneralOptionsSummary: React.FC<GeneralOptionsSummaryProps> = ({
    state,
    getExtraById,
    totalCost
}) => {
    // Check if any items are selected
    const hasSpaJets = state.spaJets.selected && state.spaJets.extraId;
    const hasDeckJets = state.deckJets.selected && state.deckJets.extraId;
    const hasMiscItems = state.miscItems.items.length > 0;

    // Get extras details
    const spaJetExtra = hasSpaJets && state.spaJets.extraId
        ? getExtraById(state.spaJets.extraId)
        : undefined;

    const deckJetExtra = hasDeckJets && state.deckJets.extraId
        ? getExtraById(state.deckJets.extraId)
        : undefined;

    // Calculate costs
    const spaJetsCost = spaJetExtra
        ? spaJetExtra.rrp * state.spaJets.quantity
        : 0;

    const deckJetsCost = deckJetExtra?.rrp || 0;

    const miscItemsCost = state.miscItems.items.reduce((sum, item) => {
        const extra = getExtraById(item.extraId);
        return sum + (extra ? extra.rrp * item.quantity : 0);
    }, 0);

    // Calculate the current total based on UI state, not database
    const calculatedTotal = useMemo(() => {
        return spaJetsCost + deckJetsCost + miscItemsCost;
    }, [spaJetsCost, deckJetsCost, miscItemsCost]);

    // If nothing is selected, show a simple message
    if (!hasSpaJets && !hasDeckJets && !hasMiscItems) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 rounded-md text-center text-muted-foreground">
                        <Package className="h-6 w-6 mx-auto mb-2" />
                        <p>No general extras selected</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hasSpaJets && (
                        <div className="p-3 bg-slate-50 rounded-md">
                            <div className="font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Spa Jets
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {spaJetExtra?.name} × {state.spaJets.quantity} jets
                            </div>
                            <div className="text-primary font-medium mt-1">
                                {formatCurrency(spaJetsCost)}
                            </div>
                        </div>
                    )}

                    {hasDeckJets && (
                        <div className="p-3 bg-slate-50 rounded-md">
                            <div className="font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Deck Jets
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {deckJetExtra?.name}
                            </div>
                            <div className="text-primary font-medium mt-1">
                                {formatCurrency(deckJetsCost)}
                            </div>
                        </div>
                    )}

                    {hasMiscItems && (
                        <div className="p-3 bg-slate-50 rounded-md md:col-span-2">
                            <div className="font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Additional Items
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {state.miscItems.items.length} item{state.miscItems.items.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="text-primary font-medium mt-1">
                                {formatCurrency(miscItemsCost)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold text-primary text-lg">
                        {formatCurrency(calculatedTotal)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}; 