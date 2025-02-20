
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DigTypeFormData {
  name: string;
  truck_quantity: string;
  truck_hourly_rate: string;
  truck_hours: string;
  excavation_hourly_rate: string;
  excavation_hours: string;
}

const initialFormData: DigTypeFormData = {
  name: "",
  truck_quantity: "",
  truck_hourly_rate: "",
  truck_hours: "",
  excavation_hourly_rate: "",
  excavation_hours: "",
};

export const useDigTypeForm = (onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DigTypeFormData>(initialFormData);

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

      setFormData(initialFormData);
      queryClient.invalidateQueries({ queryKey: ["dig-types"] });
      onSuccess();
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

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleChange,
  };
};
