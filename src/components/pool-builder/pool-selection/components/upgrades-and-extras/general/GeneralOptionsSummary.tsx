import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { GeneralExtra } from "@/types/general-extra";
import { PoolGeneralExtrasState } from "@/types/pool-general-extra";
import { formatCurrency } from "@/utils/format";
import { useCustomAddOnsCost } from "@/hooks/useCustomAddOnsCost";

interface GeneralOptionsSummaryProps {
    state: PoolGeneralExtrasState;
    getExtraById: (id: string) => GeneralExtra | undefined;
    totalCost: number;
    customerId: string | null;
}

export const GeneralOptionsSummary: React.FC<GeneralOptionsSummaryProps> = ({
    state,
    getExtraById,
    totalCost,
    customerId
}) => {
    // Get custom add-ons cost and margin
    const { customAddOnsCost, customAddOnsMargin } = useCustomAddOnsCost(customerId);
    
    // Helper to format currency
    const fmt = (value: number) => formatCurrency(value);

    // Check if any items are selected
    const hasSpaJets = state.spaJets.selected && state.spaJets.extraId;
    const hasDeckJets = state.deckJets.selected && state.deckJets.extraId;
    const hasHandGrabRail = state.handGrabRail.selected && state.handGrabRail.extraId;
    const hasAutomation = state.automation.selected && state.automation.extraId;
    const hasChemistry = state.chemistry.selected && state.chemistry.extraId;
    const hasBundle = state.bundle.selected && state.bundle.extraId;
    const hasMiscItems = state.miscItems.items.length > 0;
    const hasCustomAddOns = customAddOnsCost > 0;

    // Get extras details
    const spaJetExtra = hasSpaJets ? getExtraById(state.spaJets.extraId!) : undefined;
    const deckJetExtra = hasDeckJets ? getExtraById(state.deckJets.extraId!) : undefined;
    const handGrabRailExtra = hasHandGrabRail ? getExtraById(state.handGrabRail.extraId!) : undefined;
    const automationExtra = hasAutomation ? getExtraById(state.automation.extraId!) : undefined;
    const chemistryExtra = hasChemistry ? getExtraById(state.chemistry.extraId!) : undefined;
    const bundleExtra = hasBundle ? getExtraById(state.bundle.extraId!) : undefined;

    // Calculate costs and margins
    const spaJetsCost = spaJetExtra ? spaJetExtra.rrp * state.spaJets.quantity : 0;
    const spaJetsMargin = spaJetExtra ? spaJetExtra.margin * state.spaJets.quantity : 0;

    const deckJetsCost = deckJetExtra?.rrp || 0;
    const deckJetsMargin = deckJetExtra?.margin || 0;

    const handGrabRailCost = handGrabRailExtra?.rrp || 0;
    const handGrabRailMargin = handGrabRailExtra?.margin || 0;

    const automationCost = automationExtra?.rrp || 0;
    const automationMargin = automationExtra?.margin || 0;

    const chemistryCost = chemistryExtra?.rrp || 0;
    const chemistryMargin = chemistryExtra?.margin || 0;

    const bundleCost = bundleExtra?.rrp || 0;
    const bundleMargin = bundleExtra?.margin || 0;

    const miscItems = state.miscItems.items.map(item => {
        const extra = getExtraById(item.extraId);
        return {
            name: extra?.name || 'Unknown',
            quantity: item.quantity,
            cost: extra ? extra.rrp * item.quantity : 0,
            margin: extra ? extra.margin * item.quantity : 0
        };
    });

    const miscItemsCost = miscItems.reduce((sum, item) => sum + item.cost, 0);
    const miscItemsMargin = miscItems.reduce((sum, item) => sum + item.margin, 0);

    // Calculate totals
    const totalMargin = useMemo(() => {
        let margin = spaJetsMargin + deckJetsMargin + handGrabRailMargin + miscItemsMargin + customAddOnsMargin;
        
        // Add bundle OR individual automation/chemistry
        if (hasBundle) {
            margin += bundleMargin;
        } else {
            margin += automationMargin + chemistryMargin;
        }
        
        return margin;
    }, [spaJetsMargin, deckJetsMargin, handGrabRailMargin, automationMargin, chemistryMargin, bundleMargin, miscItemsMargin, customAddOnsMargin, hasBundle]);

    const calculatedTotal = useMemo(() => {
        let total = spaJetsCost + deckJetsCost + handGrabRailCost + miscItemsCost + customAddOnsCost;
        
        // Add bundle OR individual automation/chemistry
        if (hasBundle) {
            total += bundleCost;
        } else {
            total += automationCost + chemistryCost;
        }
        
        return total;
    }, [spaJetsCost, deckJetsCost, handGrabRailCost, automationCost, chemistryCost, bundleCost, miscItemsCost, customAddOnsCost, hasBundle]);

    const hasAnySelection = hasSpaJets || hasDeckJets || hasHandGrabRail || hasAutomation || hasChemistry || hasBundle || hasMiscItems || hasCustomAddOns;

    return (
        <Card>
            <CardHeader className="bg-white">
                <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">
                        General Options Summary
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-5">
                {!hasAnySelection ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No general options selected
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 font-medium">Item</th>
                                        <th className="text-right py-2 font-medium">Margin</th>
                                        <th className="text-right py-2 font-medium">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hasSpaJets && (
                                        <tr className="border-b">
                                            <td className="py-2">
                                                {spaJetExtra?.name} × {state.spaJets.quantity}
                                            </td>
                                            <td className="text-right py-2 text-green-600">{fmt(spaJetsMargin)}</td>
                                            <td className="text-right py-2">{fmt(spaJetsCost)}</td>
                                        </tr>
                                    )}
                                    {hasDeckJets && (
                                        <tr className="border-b">
                                            <td className="py-2">{deckJetExtra?.name}</td>
                                            <td className="text-right py-2 text-green-600">{fmt(deckJetsMargin)}</td>
                                            <td className="text-right py-2">{fmt(deckJetsCost)}</td>
                                        </tr>
                                    )}
                                    {hasHandGrabRail && (
                                        <tr className="border-b">
                                            <td className="py-2">{handGrabRailExtra?.name}</td>
                                            <td className="text-right py-2 text-green-600">{fmt(handGrabRailMargin)}</td>
                                            <td className="text-right py-2">{fmt(handGrabRailCost)}</td>
                                        </tr>
                                    )}
                                    {hasBundle && (
                                        <tr className="border-b">
                                            <td className="py-2">{bundleExtra?.name}</td>
                                            <td className="text-right py-2 text-green-600">{fmt(bundleMargin)}</td>
                                            <td className="text-right py-2">{fmt(bundleCost)}</td>
                                        </tr>
                                    )}
                                    {!hasBundle && hasAutomation && (
                                        <tr className="border-b">
                                            <td className="py-2">{automationExtra?.name}</td>
                                            <td className="text-right py-2 text-green-600">{fmt(automationMargin)}</td>
                                            <td className="text-right py-2">{fmt(automationCost)}</td>
                                        </tr>
                                    )}
                                    {!hasBundle && hasChemistry && (
                                        <tr className="border-b">
                                            <td className="py-2">{chemistryExtra?.name}</td>
                                            <td className="text-right py-2 text-green-600">{fmt(chemistryMargin)}</td>
                                            <td className="text-right py-2">{fmt(chemistryCost)}</td>
                                        </tr>
                                    )}
                                    {miscItems.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2">
                                                {item.name} {item.quantity > 1 && `× ${item.quantity}`}
                                            </td>
                                            <td className="text-right py-2 text-green-600">{fmt(item.margin)}</td>
                                            <td className="text-right py-2">{fmt(item.cost)}</td>
                                        </tr>
                                    ))}
                                    {hasCustomAddOns && (
                                        <tr className="border-b">
                                            <td className="py-2">Custom Add-Ons</td>
                                            <td className="text-right py-2 text-green-600">{fmt(customAddOnsMargin)}</td>
                                            <td className="text-right py-2">{fmt(customAddOnsCost)}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2">
                                        <td className="pt-3 font-semibold">Total General Options:</td>
                                        <td className="text-right pt-3 font-semibold text-green-600">{fmt(totalMargin)}</td>
                                        <td className="text-right pt-3 font-semibold">{fmt(calculatedTotal)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};