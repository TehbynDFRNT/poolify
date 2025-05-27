import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GeneralExtra } from "@/types/general-extra";
import { formatCurrency } from "@/utils/format";
import React from "react";

interface DeckJetsSectionProps {
    deckJets: GeneralExtra[];
    selected: boolean;
    selectedId: string | null;
    onSetSelected: (selected: boolean) => void;
    onSetSelectedId: (id: string | null) => void;
    getExtraById: (id: string) => GeneralExtra | undefined;
}

export const DeckJetsSection: React.FC<DeckJetsSectionProps> = ({
    deckJets,
    selected,
    selectedId,
    onSetSelected,
    onSetSelectedId,
    getExtraById
}) => {
    const handleSelectChange = (value: string) => {
        onSetSelectedId(value);
    };

    // Get the currently selected deck jet
    const selectedDeckJet = selectedId ? getExtraById(selectedId) : undefined;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Deck Jets</CardTitle>
                <CardDescription>
                    Add water features with deck jets that shoot water into your pool
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="include-deck-jets" className="flex-1">
                        Include deck jets
                    </Label>
                    <Switch
                        id="include-deck-jets"
                        checked={selected}
                        onCheckedChange={onSetSelected}
                    />
                </div>

                {selected && (
                    <>
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="deck-jet-select">Select Deck Jet Package</Label>
                            <Select
                                value={selectedId || ''}
                                onValueChange={handleSelectChange}
                                disabled={!selected}
                            >
                                <SelectTrigger id="deck-jet-select">
                                    <SelectValue placeholder="Select a deck jet package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {deckJets.map(jet => (
                                        <SelectItem key={jet.id} value={jet.id}>
                                            {jet.name} ({formatCurrency(jet.rrp)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedId && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Cost:</span>
                                    <span className="font-bold text-primary">
                                        {formatCurrency(selectedDeckJet?.rrp || 0)}
                                    </span>
                                </div>
                                {selectedDeckJet?.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedDeckJet.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 