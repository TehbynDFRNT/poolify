
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import type { FiltrationComponentType } from "@/types/filtration";

interface AddComponentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentTypes: FiltrationComponentType[];
}

export function AddComponentForm({ open, onOpenChange, componentTypes }: AddComponentFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model_number: "",
    description: "",
    type_id: "",
    price_ex_gst: 0,
    price_inc_gst: 0,
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
          price_ex_gst: formData.price_ex_gst,
          price_inc_gst: formData.price_inc_gst
        },
      ]);

      if (error) throw error;

      toast.success("Component added successfully");

      // Reset form and close dialog
      setFormData({
        name: "",
        model_number: "",
        description: "",
        type_id: "",
        price_ex_gst: 0,
        price_inc_gst: 0,
      });
      onOpenChange(false);

      // Refresh the components list
      queryClient.invalidateQueries({ queryKey: ["filtration-components"] });
    } catch (error) {
      toast.error("Failed to add component");
      console.error("Error adding component:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type_id: value }));
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
            <Label htmlFor="price_ex_gst">Price (ex GST) *</Label>
            <Input
              id="price_ex_gst"
              name="price_ex_gst"
              type="number"
              step="0.01"
              value={formData.price_ex_gst}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_inc_gst">Price (inc GST) *</Label>
            <Input
              id="price_inc_gst"
              name="price_inc_gst"
              type="number"
              step="0.01"
              value={formData.price_inc_gst}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_id">Type *</Label>
            <Select 
              value={formData.type_id} 
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger id="type_id" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {componentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="automation">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Automation
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-[80px]"
              value={formData.description}
              onChange={handleChange}
              rows={4}
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
