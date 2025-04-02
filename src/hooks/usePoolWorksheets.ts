
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolWorksheet } from "@/types/pool-worksheet";
import { toast } from "sonner";

export const usePoolWorksheets = () => {
  return useQuery({
    queryKey: ['pool-worksheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_worksheets')
        .select(`
          *,
          pool:pool_id(id, name, range, length, width, depth_shallow, depth_deep, volume_liters)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching pool worksheets:', error);
        throw error;
      }
      
      return data as (PoolWorksheet & { 
        pool: { 
          id: string; 
          name: string; 
          range: string;
          length: number;
          width: number;
          depth_shallow: number;
          depth_deep: number;
          volume_liters: number | null;
        } | null 
      })[];
    },
    meta: {
      onError: () => {
        toast.error("Failed to load pool worksheets");
      }
    }
  });
};

export const useCreatePoolWorksheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (worksheetData: Partial<PoolWorksheet>) => {
      const { data, error } = await supabase
        .from('pool_worksheets')
        .insert(worksheetData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating pool worksheet:', error);
        throw error;
      }
      
      return data as PoolWorksheet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-worksheets'] });
      toast.success("Pool worksheet created successfully");
    },
    onError: () => {
      toast.error("Failed to create pool worksheet");
    }
  });
};

export const useDeletePoolWorksheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pool_worksheets')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting pool worksheet:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-worksheets'] });
      toast.success("Pool worksheet deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete pool worksheet");
    }
  });
};
