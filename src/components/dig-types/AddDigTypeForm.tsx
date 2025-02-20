
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddDigTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDigTypeForm({ open, onOpenChange }: AddDigTypeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    truck_quantity: "",
    truck_hourly_rate: "",
    truck_hours: "",
    excavation_hourly_rate: "",
    excavation_hours: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("dig_types").insert([
        {
          name: formData.name,
          truck_quantity: parseInt(formData.truck_quantity),
          truck_hourly_rate: parseFloat(formData.truck_hourly_rate),
          truck_hours: parseInt(formData.truck_hours),
          excavation_hourly_rate: parseFloat(formData.excavation_hourly_rate),
          excavation_hours: parseInt(formData.excavation_hours),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dig type added successfully",
      });

      setFormData({
        name: "",
        truck_quantity: "",
        truck_hourly_rate: "",
        truck_hours: "",
        excavation_hourly_rate: "",
        excavation_hours: "",
      });
      onOpenChange(false);

      queryClient.invalidateQueries({ queryKey: ["dig-types"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add dig type",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Dig Type</DialogTitle>
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
            <Label htmlFor="truck_quantity">Number of Trucks *</Label>
            <Input
              id="truck_quantity"
              name="truck_quantity"
              type="number"
              value={formData.truck_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="truck_hourly_rate">Truck Hourly Rate *</Label>
            <Input
              id="truck_hourly_rate"
              name="truck_hourly_rate"
              type="number"
              step="0.01"
              value={formData.truck_hourly_rate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="truck_hours">Truck Hours *</Label>
            <Input
              id="truck_hours"
              name="truck_hours"
              type="number"
              value={formData.truck_hours}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excavation_hourly_rate">Excavation Hourly Rate *</Label>
            <Input
              id="excavation_hourly_rate"
              name="excavation_hourly_rate"
              type="number"
              step="0.01"
              value={formData.excavation_hourly_rate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excavation_hours">Excavation Hours *</Label>
            <Input
              id="excavation_hours"
              name="excavation_hours"
              type="number"
              value={formData.excavation_hours}
              onChange={handleChange}
              required
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
              {isSubmitting ? "Adding..." : "Add Dig Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
