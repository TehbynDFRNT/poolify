
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type for hand grab rails data
export type HandGrabRailItem = {
  id: string;
  model_number: string;
  description: string;
  cost_price: number;
  margin: number;
  total: number;
};

export const useHandGrabRails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [handGrabRails, setHandGrabRails] = useState<HandGrabRailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandGrabRails = async () => {
      try {
        setIsLoading(true);
        // Use type assertion to handle the Supabase type issue
        const { data, error } = await supabase
          .from("hand_grab_rails" as any)
          .select("*");

        if (error) {
          throw error;
        }

        // Type cast the returned data to our HandGrabRailItem[] type
        setHandGrabRails(data as unknown as HandGrabRailItem[]);
      } catch (error) {
        console.error("Error fetching hand grab rails:", error);
        setError("Failed to load hand grab rails");
        toast.error("Failed to load hand grab rails");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHandGrabRails();
  }, []);

  const filteredHandGrabRails = handGrabRails.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.model_number.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const addHandGrabRail = async (newRail: Omit<HandGrabRailItem, "id">) => {
    try {
      // Use type assertion for the Supabase query
      const { data, error } = await supabase
        .from("hand_grab_rails" as any)
        .insert([newRail])
        .select();

      if (error) {
        throw error;
      }

      // Type cast the returned data
      const typedData = data as unknown as HandGrabRailItem[];
      setHandGrabRails([...typedData, ...handGrabRails]);
      toast.success("Hand grab rail added successfully");
      return true;
    } catch (error) {
      console.error("Error adding hand grab rail:", error);
      toast.error("Failed to add hand grab rail");
      return false;
    }
  };

  const updateHandGrabRail = async (id: string, updates: Partial<HandGrabRailItem>) => {
    try {
      // Use type assertion for the Supabase query
      const { error } = await supabase
        .from("hand_grab_rails" as any)
        .update(updates)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setHandGrabRails(
        handGrabRails.map((rail) =>
          rail.id === id ? { ...rail, ...updates } : rail
        )
      );
      toast.success("Hand grab rail updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating hand grab rail:", error);
      toast.error("Failed to update hand grab rail");
      return false;
    }
  };

  const deleteHandGrabRail = async (id: string) => {
    try {
      // Use type assertion for the Supabase query
      const { error } = await supabase
        .from("hand_grab_rails" as any)
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setHandGrabRails(handGrabRails.filter((rail) => rail.id !== id));
      toast.success("Hand grab rail deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting hand grab rail:", error);
      toast.error("Failed to delete hand grab rail");
      return false;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredHandGrabRails,
    isLoading,
    error,
    addHandGrabRail,
    updateHandGrabRail,
    deleteHandGrabRail
  };
};
