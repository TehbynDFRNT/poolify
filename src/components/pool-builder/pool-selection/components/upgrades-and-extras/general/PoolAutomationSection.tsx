import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GeneralExtra } from "@/types/general-extra";
import { formatCurrency } from "@/utils/format";
import React, { useEffect } from "react";

interface PoolAutomationSectionProps {
    automationExtras: GeneralExtra[];
    chemistryExtras: GeneralExtra[];
    bundleExtras: GeneralExtra[];
    state: {
        automation: {
            selected: boolean;
            extraId: string | null;
        };
        chemistry: {
            selected: boolean;
            extraId: string | null;
        };
        bundle: {
            selected: boolean;
            extraId: string | null;
        };
    };
    onSetAutomationSelected: (selected: boolean) => void;
    onSetAutomationId: (id: string | null) => void;
    onSetChemistrySelected: (selected: boolean) => void;
    onSetChemistryId: (id: string | null) => void;
    onSetBundleSelected: (selected: boolean) => void;
    onSetBundleId: (id: string | null) => void;
    getExtraById: (id: string) => GeneralExtra | undefined;
}

export const PoolAutomationSection: React.FC<PoolAutomationSectionProps> = ({
    automationExtras,
    chemistryExtras,
    bundleExtras,
    state,
    onSetAutomationSelected,
    onSetAutomationId,
    onSetChemistrySelected,
    onSetChemistryId,
    onSetBundleSelected,
    onSetBundleId,
    getExtraById
}) => {
    // Debug logging - log once on mount/update
    useEffect(() => {
        console.log('🎯 PoolAutomationSection - Received props:', {
            automationExtras: automationExtras.length,
            chemistryExtras: chemistryExtras.length,
            bundleExtras: bundleExtras.length,
            state,
            automationExtrasData: automationExtras,
            chemistryExtrasData: chemistryExtras,
            bundleExtrasData: bundleExtras
        });
    }, [state.automation.selected, state.chemistry.selected, state.bundle.selected]);
    // Get selected extras
    const selectedAutomation = state.automation.extraId ? getExtraById(state.automation.extraId) : null;
    const selectedChemistry = state.chemistry.extraId ? getExtraById(state.chemistry.extraId) : null;
    const selectedBundle = state.bundle.extraId ? getExtraById(state.bundle.extraId) : null;

    // Auto-select first chemistry option if only one exists
    useEffect(() => {
        if (state.chemistry.selected && !state.chemistry.extraId && chemistryExtras.length === 1) {
            onSetChemistryId(chemistryExtras[0].id);
        }
    }, [state.chemistry.selected, state.chemistry.extraId, chemistryExtras.length]); // Remove onSetChemistryId from deps

    // Auto-bundle when both are selected
    const useBundle = state.automation.selected && state.chemistry.selected && bundleExtras.length > 0;

    // Sync bundle state
    useEffect(() => {
        if (useBundle && bundleExtras.length > 0) {
            onSetBundleSelected(true);
            
            // Set bundle
            onSetBundleId(bundleExtras[0].id);
            
            // Set defaults if not selected
            if (!state.automation.extraId && automationExtras.length > 0) {
                onSetAutomationId(automationExtras[0].id);
            }
            if (!state.chemistry.extraId && chemistryExtras.length > 0) {
                onSetChemistryId(chemistryExtras[0].id);
            }
        } else {
            onSetBundleSelected(false);
            onSetBundleId(null);
        }
    }, [useBundle, bundleExtras.length, automationExtras.length, chemistryExtras.length, 
        state.automation.extraId, state.chemistry.extraId]); // More specific deps

    // Calculate totals
    const automationTotal = selectedAutomation && !useBundle ? selectedAutomation.rrp : 0;
    const chemistryTotal = selectedChemistry && !useBundle ? selectedChemistry.rrp : 0;
    const bundleTotal = selectedBundle && useBundle ? selectedBundle.rrp : 0;
    const totalRrp = useBundle ? bundleTotal : (automationTotal + chemistryTotal);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Pool Automation & Chemistry</CardTitle>
                <CardDescription>
                    Pick your automation kit and/or pH & ORP dosing controller. Bundle discount applies when both are selected.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Pool Manager + Automation */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="include-automation" className="flex-1">
                        Include Pool Automation
                    </Label>
                    <Switch
                        id="include-automation"
                        checked={state.automation.selected}
                        onCheckedChange={onSetAutomationSelected}
                    />
                </div>

                {state.automation.selected && (
                    <>
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="automation-select">Select Automation Model</Label>
                            <Select
                                value={state.automation.extraId || ""}
                                onValueChange={onSetAutomationId}
                            >
                                <SelectTrigger id="automation-select">
                                    <SelectValue placeholder="Select an automation system" />
                                </SelectTrigger>
                                <SelectContent>
                                    {automationExtras.map(extra => (
                                        <SelectItem key={extra.id} value={extra.id}>
                                            {extra.name} ({formatCurrency(extra.rrp)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedAutomation && !useBundle && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Automation Cost:</span>
                                    <span className="font-bold text-primary">
                                        {formatCurrency(selectedAutomation.rrp)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* pH & ORP Dosing */}
                <div className="flex items-center justify-between pt-4">
                    <Label htmlFor="include-chemistry" className="flex-1">
                        Include pH & ORP Dosing
                    </Label>
                    <Switch
                        id="include-chemistry"
                        checked={state.chemistry.selected}
                        onCheckedChange={onSetChemistrySelected}
                    />
                </div>

                {state.chemistry.selected && chemistryExtras.length > 0 && (
                    <>
                        <div className="mt-4">
                            <div className="font-medium text-sm text-muted-foreground">
                                {chemistryExtras[0].name}
                            </div>
                            {chemistryExtras[0].description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {chemistryExtras[0].description}
                                </p>
                            )}
                        </div>
                        {!useBundle && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Chemistry Cost:</span>
                                    <span className="font-bold text-primary">
                                        {formatCurrency(chemistryExtras[0].rrp)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Bundle Pricing - Auto-applied when both are selected */}
                {useBundle && selectedBundle && (
                    <div className="mt-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-primary">Bundle Pricing Applied</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Auto-applied</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Save when purchasing both automation and chemistry together
                            </p>
                            <div className="mt-4 pt-4 border-t border-primary/20">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Bundle Price:</span>
                                    <span className="font-bold text-primary">
                                        {formatCurrency(selectedBundle.rrp)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Individual total would be {formatCurrency(
                                        (selectedAutomation?.rrp || 0) + (selectedChemistry?.rrp || chemistryExtras[0]?.rrp || 0)
                                    )}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    You save {formatCurrency(
                                        ((selectedAutomation?.rrp || 0) + (selectedChemistry?.rrp || chemistryExtras[0]?.rrp || 0)) - selectedBundle.rrp
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Section - Only show if something is selected */}
                {(state.automation.selected || state.chemistry.selected) && (
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Cost:</span>
                            <span className="font-bold text-primary">
                                {formatCurrency(totalRrp)}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};