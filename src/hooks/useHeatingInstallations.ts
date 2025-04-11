
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HeatingInstallation } from "@/types/heating-installation";

export const useHeatingInstallations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [heatingInstallations, setHeatingInstallations] = useState<HeatingInstallation[]>([]);
  const { toast } = useToast();

  const fetchHeatingInstallations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heating_installations")
        .select("*")
        .order("installation_type", { ascending: true }) as { data: HeatingInstallation[] | null; error: any };

      if (error) {
        throw error;
      }

      setHeatingInstallations(data || []);
    } catch (error: any) {
      console.error("Error fetching heating installations:", error);
      toast({
        title: "Error fetching heating installations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addHeatingInstallation = async (installation: Omit<HeatingInstallation, "id" | "created_at">) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heating_installations")
        .insert(installation)
        .select("*")
        .single() as { data: HeatingInstallation | null; error: any };

      if (error) {
        throw error;
      }

      setHeatingInstallations([...heatingInstallations, data as HeatingInstallation]);
      toast({
        title: "Heating installation added",
        description: `${installation.installation_type} has been added successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error adding heating installation:", error);
      toast({
        title: "Error adding heating installation",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeatingInstallation = async (id: string, updates: Partial<HeatingInstallation>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heating_installations")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single() as { data: HeatingInstallation | null; error: any };

      if (error) {
        throw error;
      }

      setHeatingInstallations(
        heatingInstallations.map((installation) => 
          (installation.id === id ? data as HeatingInstallation : installation)
        )
      );
      
      toast({
        title: "Heating installation updated",
        description: `${(data as HeatingInstallation).installation_type} has been updated successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error updating heating installation:", error);
      toast({
        title: "Error updating heating installation",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHeatingInstallation = async (id: string) => {
    setIsLoading(true);
    try {
      const installationToDelete = heatingInstallations.find(i => i.id === id);
      
      const { error } = await supabase
        .from("heating_installations")
        .delete()
        .eq("id", id) as { error: any };

      if (error) {
        throw error;
      }

      setHeatingInstallations(heatingInstallations.filter((installation) => installation.id !== id));
      
      toast({
        title: "Heating installation deleted",
        description: installationToDelete 
          ? `${installationToDelete.installation_type} has been deleted.` 
          : "Installation has been deleted.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting heating installation:", error);
      toast({
        title: "Error deleting heating installation",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    heatingInstallations,
    isLoading,
    fetchHeatingInstallations,
    addHeatingInstallation,
    updateHeatingInstallation,
    deleteHeatingInstallation,
  };
};
