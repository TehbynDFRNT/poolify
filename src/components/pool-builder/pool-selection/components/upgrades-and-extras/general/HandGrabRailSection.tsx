import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GeneralExtra } from "@/types/general-extra";
import { formatCurrency } from "@/utils/format";
import { Check, X } from "lucide-react";
import React from "react";

interface HandGrabRailSectionProps {
    handGrabRails: GeneralExtra[];
    selected: boolean;
    selectedId: string | null;
    onSetSelected: (selected: boolean) => void;
    onSetSelectedId: (id: string | null) => void;
    getExtraById: (id: string) => GeneralExtra | undefined;
}

export const HandGrabRailSection: React.FC<HandGrabRailSectionProps> = ({
    handGrabRails,
    selected,
    selectedId,
    onSetSelected,
    onSetSelectedId,
    getExtraById
}) => {
    const selectedRail = selectedId ? getExtraById(selectedId) : null;

    const handleToggleSelection = () => {
        if (selected) {
            // Deselecting - clear the selected ID
            onSetSelected(false);
            onSetSelectedId(null);
        } else {
            // Selecting - set to true but don't auto-select a rail (let user choose)
            onSetSelected(true);
            // Auto-select first available rail if none selected
            if (!selectedId && handGrabRails.length > 0) {
                onSetSelectedId(handGrabRails[0].id);
            }
        }
    };

    const handleRailSelection = (railId: string) => {
        onSetSelectedId(railId);
        // Ensure selected is true when a rail is chosen
        if (!selected) {
            onSetSelected(true);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    Hand Grab Rail
                    <div className="flex items-center gap-2">
                        {selected ? (
                            <Check className="h-5 w-5 text-green-600" />
                        ) : (
                            <X className="h-5 w-5 text-gray-400" />
                        )}
                        <Switch
                            checked={selected}
                            onCheckedChange={handleToggleSelection}
                        />
                    </div>
                </CardTitle>
                <CardDescription>
                    Add a safety hand grab rail to your pool for enhanced accessibility and safety
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {selected && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Hand Grab Rail Color:</label>
                            <Select
                                value={selectedId || ""}
                                onValueChange={handleRailSelection}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a color option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {handGrabRails.map(rail => (
                                        <SelectItem key={rail.id} value={rail.id}>
                                            {rail.name} - {formatCurrency(rail.rrp)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedRail && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-blue-900">{selectedRail.name}</h4>
                                            <p className="text-sm text-blue-700">{selectedRail.description}</p>
                                            <p className="text-xs text-blue-600 mt-1">SKU: {selectedRail.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-900">
                                                {formatCurrency(selectedRail.rrp)}
                                            </div>
                                            <div className="text-sm text-blue-700">
                                                Quantity: 1
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!selected && (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-600 text-sm">
                            Hand grab rail not selected. Toggle the switch above to add one to your pool.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};