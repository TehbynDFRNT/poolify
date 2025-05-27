import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralExtras } from "@/hooks/useGeneralExtras";
import { GeneralExtra, GeneralExtraType } from "@/types/general-extra";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditGeneralExtraFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    extra: GeneralExtra;
}

export function EditGeneralExtraForm({ open, onOpenChange, extra }: EditGeneralExtraFormProps) {
    const { updateGeneralExtra } = useGeneralExtras();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: extra.name,
        sku: extra.sku,
        type: extra.type,
        description: extra.description || "",
        cost: extra.cost.toString(),
        margin: extra.margin.toString(),
        rrp: extra.rrp.toString(),
    });

    // Update form data when the extra prop changes
    useEffect(() => {
        setFormData({
            name: extra.name,
            sku: extra.sku,
            type: extra.type,
            description: extra.description || "",
            cost: extra.cost.toString(),
            margin: extra.margin.toString(),
            rrp: extra.rrp.toString(),
        });
    }, [extra]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.name || !formData.sku || !formData.cost || !formData.rrp) {
            toast.error("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        try {
            const cost = parseFloat(formData.cost);
            const rrp = parseFloat(formData.rrp);

            // Determine margin either from input or calculate it
            let margin: number;
            if (formData.margin && formData.margin.trim() !== "") {
                margin = parseFloat(formData.margin);
            } else {
                margin = rrp - cost;
            }

            updateGeneralExtra({
                id: extra.id,
                updates: {
                    name: formData.name,
                    sku: formData.sku,
                    type: formData.type,
                    description: formData.description || "",
                    cost: cost,
                    margin: margin,
                    rrp: rrp
                }
            });

            onOpenChange(false);
        } catch (error) {
            console.error("Error updating general extra:", error);
            toast.error("Failed to update general extra");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value as GeneralExtraType }));
    };

    const calculateMargin = () => {
        if (formData.cost && formData.rrp) {
            const cost = parseFloat(formData.cost);
            const rrp = parseFloat(formData.rrp);
            if (!isNaN(cost) && !isNaN(rrp)) {
                const margin = rrp - cost;
                setFormData(prev => ({ ...prev, margin: margin.toString() }));
            }
        }
    };

    const calculateRRP = () => {
        if (formData.cost && formData.margin) {
            const cost = parseFloat(formData.cost);
            const margin = parseFloat(formData.margin);
            if (!isNaN(cost) && !isNaN(margin)) {
                const rrp = cost + margin;
                setFormData(prev => ({ ...prev, rrp: rrp.toString() }));
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit General Extra</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Spa Jets">Spa Jets</SelectItem>
                                <SelectItem value="Deck Jets">Deck Jets</SelectItem>
                                <SelectItem value="Misc">Misc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add a description of the extra item"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost ($) *</Label>
                            <Input
                                id="cost"
                                name="cost"
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={handleChange}
                                onBlur={calculateMargin}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="margin">Margin ($)</Label>
                            <Input
                                id="margin"
                                name="margin"
                                type="number"
                                step="0.01"
                                value={formData.margin}
                                onChange={handleChange}
                                onBlur={calculateRRP}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rrp">RRP ($) *</Label>
                            <Input
                                id="rrp"
                                name="rrp"
                                type="number"
                                step="0.01"
                                value={formData.rrp}
                                onChange={handleChange}
                                onBlur={calculateMargin}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 