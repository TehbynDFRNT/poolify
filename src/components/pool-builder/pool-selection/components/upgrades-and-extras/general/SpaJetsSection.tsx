import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GeneralExtra } from "@/types/general-extra";
import { formatCurrency } from "@/utils/format";
import React from "react";

interface SpaJetsSectionProps {
    spaJets: GeneralExtra[];
    selected: boolean;
    selectedId: string | null;
    quantity: number;
    onSetSelected: (selected: boolean) => void;
    onSetSelectedId: (id: string | null) => void;
    onSetQuantity: (quantity: number) => void;
    getExtraById: (id: string) => GeneralExtra | undefined;
}

export const SpaJetsSection: React.FC<SpaJetsSectionProps> = ({
    spaJets,
    selected,
    selectedId,
    quantity,
    onSetSelected,
    onSetSelectedId,
    onSetQuantity,
    getExtraById
}) => {
    const handleSelectChange = (value: string) => {
        onSetSelectedId(value);
    };

    const handleSwitchChange = (value: boolean) => {
        onSetSelected(value);
    };

    // Get the currently selected spa jet
    const selectedSpaJet = selectedId ? getExtraById(selectedId) : undefined;

    // Calculate total cost based on quantity
    const totalCost = selectedSpaJet ? selectedSpaJet.rrp * quantity : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Spa Jets</CardTitle>
                <CardDescription>
                    Add relaxing spa jets to your pool for a therapeutic massage experience
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="include-spa-jets" className="flex-1">
                        Include spa jets
                    </Label>
                    <Switch
                        id="include-spa-jets"
                        checked={selected}
                        onCheckedChange={handleSwitchChange}
                    />
                </div>

                {selected && (
                    <>
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="spa-jet-select">Select Spa Jet Type</Label>
                            <Select
                                value={selectedId || ''}
                                onValueChange={handleSelectChange}
                                disabled={!selected}
                            >
                                <SelectTrigger id="spa-jet-select">
                                    <SelectValue placeholder="Select a spa jet type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {spaJets.map(jet => (
                                        <SelectItem key={jet.id} value={jet.id}>
                                            {jet.name} ({formatCurrency(jet.rrp)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedId && (
                            <div className="space-y-2 mt-4">
                                <Label>Number of Jets</Label>
                                <RadioGroup
                                    value={quantity.toString()}
                                    onValueChange={(value) => onSetQuantity(parseInt(value))}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="4" id="jets-4" />
                                        <Label htmlFor="jets-4">4 Jets</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="6" id="jets-6" />
                                        <Label htmlFor="jets-6">6 Jets</Label>
                                    </div>
                                </RadioGroup>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Cost:</span>
                                        <span className="font-bold text-primary">
                                            {formatCurrency(totalCost)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {quantity} jets × {formatCurrency(selectedSpaJet?.rrp || 0)} each
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 