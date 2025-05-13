
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PoolCleaner, mapDbToPoolCleaner } from "@/types/pool-cleaner";

export const usePoolCleaners = () => {
  const queryClient = useQueryClient();

  const { data: poolCleaners, isLoading } = useQuery({
    queryKey: ['pool-cleaners'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pool_cleaners')
          .select('*')
          .order('model_number');
        
        if (error) throw error;
        
        // Map database fields to our PoolCleaner interface
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          model_number: item.model_number,
          description: item.description || "",
          sku: item.model_number, // Using model_number as SKU
          trade: item.cost_price || 0,
          rrp: item.price || 0,
          margin: item.margin || 0,
          created_at: item.created_at,
          price: item.price,
          cost_price: item.cost_price
        })) as PoolCleaner[];
      } catch (error) {
        console.error("Error fetching pool cleaners:", error);
        return [];
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newCleaner: Omit<PoolCleaner, 'id' | 'created_at'>) => {
      // Convert from our app's type to database schema
      const dbCleaner = {
        name: newCleaner.name,
        model_number: newCleaner.model_number,
        description: newCleaner.description || null,
        price: newCleaner.rrp,
        cost_price: newCleaner.trade,
        margin: newCleaner.margin || 0
      };
      
      const { data, error } = await supabase
        .from('pool_cleaners')
        .insert([dbCleaner])
        .select()
        .single();

      if (error) throw error;
      
      // Map result back to our PoolCleaner type
      return {
        id: data.id,
        name: data.name,
        model_number: data.model_number,
        description: data.description || "",
        sku: data.model_number,
        trade: data.cost_price || 0, 
        rrp: data.price || 0,
        margin: data.margin || 0,
        created_at: data.created_at,
        price: data.price,
        cost_price: data.cost_price
      } as PoolCleaner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add pool cleaner");
      console.error("Error adding pool cleaner:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PoolCleaner> }) => {
      // Convert from our app's type to database schema
      const dbUpdates: any = { ...updates };
      
      // Map rrp to price if it exists in the updates
      if (updates.rrp !== undefined) {
        dbUpdates.price = updates.rrp;
        delete dbUpdates.rrp;
      }
      
      // Map trade to cost_price if it exists in the updates
      if (updates.trade !== undefined) {
        dbUpdates.cost_price = updates.trade;
        delete dbUpdates.trade;
      }
      
      const { data, error } = await supabase
        .from('pool_cleaners')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Map result back to our PoolCleaner type
      return {
        id: data.id,
        name: data.name,
        model_number: data.model_number,
        description: data.description || "",
        sku: data.model_number,
        trade: data.cost_price || 0, 
        rrp: data.price || 0,
        margin: data.margin || 0,
        created_at: data.created_at,
        price: data.price,
        cost_price: data.cost_price
      } as PoolCleaner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pool cleaner");
      console.error("Error updating pool cleaner:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pool_cleaners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pool cleaner");
      console.error("Error deleting pool cleaner:", error);
    },
  });

  return {
    poolCleaners,
    isLoading,
    addPoolCleaner: addMutation.mutate,
    updatePoolCleaner: updateMutation.mutate,
    deletePoolCleaner: deleteMutation.mutate
  };
};
