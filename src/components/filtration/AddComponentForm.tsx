
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FiltrationComponentType } from "@/types/filtration";

interface AddComponentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentTypes: FiltrationComponentType[];
}

export function AddComponentForm({ open, onOpenChange, componentTypes }: AddComponentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model_number: "",
    description: "",
    type_id: "",
    price: "",
    flow_rate: "",
    power_consumption: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("filtration_components").insert([
        {
          name: formData.name,
          model_number: formData.model_number,
          description: formData.description || null,
          type_id: formData.type_id,
          price: parseFloat(formData.price),
          flow_rate: formData.flow_rate ? parseFloat(formData.flow_rate) : null,
          power_consumption: formData.power_consumption ? parseFloat(formData.power_consumption) : null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Component added successfully",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        model_number: "",
        description: "",
        type_id: "",
        price: "",
        flow_rate: "",
        power_consumption: "",
      });
      onOpenChange(false);

      // Refresh the components list
      queryClient.invalidateQueries({ queryKey: ["filtration-components"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add component",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Component</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model_number">Model Number *</Label>
            <Input
              id="model_number"
              name="model_number"
              value={formData.model_number}
              onChange={handleChange}
              required
            />
          </div>
          
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
            <Label htmlFor="type_id">Type *</Label>
            <select
              id="type_id"
              name="type_id"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.type_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              {componentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flow_rate">Flow Rate (L/min)</Label>
            <Input
              id="flow_rate"
              name="flow_rate"
              type="number"
              step="0.1"
              value={formData.flow_rate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="power_consumption">Power Consumption (W)</Label>
            <Input
              id="power_consumption"
              name="power_consumption"
              type="number"
              step="0.1"
              value={formData.power_consumption}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="w-full px-3 py-2 border rounded-md h-20"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Component"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
