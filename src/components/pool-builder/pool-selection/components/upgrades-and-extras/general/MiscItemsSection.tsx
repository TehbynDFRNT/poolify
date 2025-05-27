import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneralExtra } from "@/types/general-extra";
import { formatCurrency } from "@/utils/format";
import { Minus, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface MiscItemsSectionProps {
    miscItems: GeneralExtra[];
    selectedItems: Array<{ extraId: string; quantity: number }>;
    onAddItem: (extraId: string, quantity: number) => void;
    onRemoveItem: (extraId: string) => void;
    onUpdateQuantity: (extraId: string, quantity: number) => void;
    getExtraById: (id: string) => GeneralExtra | undefined;
}

export const MiscItemsSection: React.FC<MiscItemsSectionProps> = ({
    miscItems,
    selectedItems,
    onAddItem,
    onRemoveItem,
    onUpdateQuantity,
    getExtraById
}) => {
    const [selectedItemId, setSelectedItemId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleAddItem = () => {
        if (!selectedItemId) return;
        onAddItem(selectedItemId, quantity);
        setSelectedItemId("");
        setQuantity(1);
    };

    const handleQuantityChange = (extraId: string, newQuantity: number) => {
        // Ensure quantity is at least 1
        if (newQuantity < 1) newQuantity = 1;
        onUpdateQuantity(extraId, newQuantity);
    };

    // Calculate the total cost of all selected misc items
    const totalMiscCost = selectedItems.reduce((sum, item) => {
        const extra = getExtraById(item.extraId);
        return sum + (extra ? extra.rrp * item.quantity : 0);
    }, 0);

    // Filter out items that are already selected
    const availableItems = miscItems.filter(
        item => !selectedItems.some(selected => selected.extraId === item.id)
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Additional Items</CardTitle>
                <CardDescription>
                    Add other miscellaneous items to your pool package
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an item to add" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableItems.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name} ({formatCurrency(item.rrp)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-20">
                        <Input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <Button
                        onClick={handleAddItem}
                        disabled={!selectedItemId}
                    >
                        Add
                    </Button>
                </div>

                {selectedItems.length > 0 ? (
                    <div className="space-y-4 mt-4">
                        <div className="text-sm font-medium">Selected Items</div>
                        <div className="space-y-2">
                            {selectedItems.map((item) => {
                                const extra = getExtraById(item.extraId);
                                if (!extra) return null;

                                return (
                                    <div key={item.extraId} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                                        <div className="flex-1">
                                            <div className="font-medium">{extra.name}</div>
                                            <div className="text-sm text-muted-foreground">{extra.description}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-r-none"
                                                    onClick={() => handleQuantityChange(item.extraId, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.extraId, parseInt(e.target.value) || 1)}
                                                    className="h-7 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-l-none"
                                                    onClick={() => handleQuantityChange(item.extraId, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="w-24 text-right font-medium">
                                                {formatCurrency(extra.rrp * item.quantity)}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onRemoveItem(item.extraId)}
                                                className="h-7 w-7 text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-medium">Total Additional Items:</span>
                            <span className="font-bold text-primary">
                                {formatCurrency(totalMiscCost)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-md text-center text-muted-foreground">
                        No additional items selected
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 