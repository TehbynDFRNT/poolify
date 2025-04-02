
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolWorksheet, PoolWorksheetItem } from "@/types/pool-worksheet";
import { toast } from "sonner";

export const usePoolWorksheet = () => {
  return useQuery({
    queryKey: ['pool-worksheet'],
    queryFn: async () => {
      // First, check if a worksheet exists
      const { data: worksheets, error: worksheetError } = await supabase
        .from('pool_worksheets')
        .select(`
          *,
          pool:pool_id(id, name, range, length, width, depth_shallow, depth_deep, volume_liters)
        `)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (worksheetError) {
        console.error('Error fetching pool worksheet:', worksheetError);
        throw worksheetError;
      }
      
      // If no worksheet exists, create one
      if (!worksheets || worksheets.length === 0) {
        const { data: newWorksheet, error: createError } = await supabase
          .from('pool_worksheets')
          .insert({ name: "My Pool Worksheet" })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating pool worksheet:', createError);
          throw createError;
        }
        
        const worksheet = newWorksheet as PoolWorksheet;
        
        return {
          ...worksheet,
          items: [],
          pool: null
        };
      }
      
      // Get items for the worksheet
      const worksheet = worksheets[0] as PoolWorksheet & { 
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
      };
      
      const { data: items, error: itemsError } = await supabase
        .from('pool_worksheet_items')
        .select('*')
        .eq('worksheet_id', worksheet.id)
        .order('created_at', { ascending: true });
        
      if (itemsError) {
        console.error('Error fetching worksheet items:', itemsError);
        throw itemsError;
      }
      
      return {
        ...worksheet,
        items: items as PoolWorksheetItem[]
      };
    },
    meta: {
      onError: () => {
        toast.error("Failed to load pool worksheet");
      }
    }
  });
};

export const useAddWorksheetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: Omit<PoolWorksheetItem, 'id' | 'created_at' | 'updated_at' | 'worksheet_id'>) => {
      // Get the current worksheet
      const { data: worksheets } = await supabase
        .from('pool_worksheets')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (!worksheets || worksheets.length === 0) {
        throw new Error("No worksheet found");
      }
      
      const worksheetId = worksheets[0].id;
      
      // Add the item to the worksheet
      const { data, error } = await supabase
        .from('pool_worksheet_items')
        .insert({ ...itemData, worksheet_id: worksheetId })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding worksheet item:', error);
        throw error;
      }
      
      return data as PoolWorksheetItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-worksheet'] });
      toast.success("Item added to worksheet");
    },
    onError: () => {
      toast.error("Failed to add item to worksheet");
    }
  });
};

export const useDeleteWorksheetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pool_worksheet_items')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting worksheet item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-worksheet'] });
      toast.success("Item removed from worksheet");
    },
    onError: () => {
      toast.error("Failed to remove item from worksheet");
    }
  });
};
