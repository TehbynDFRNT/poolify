import { supabase } from "@/integrations/supabase/client";
import { GeneralExtra, mapDbToGeneralExtra } from "@/types/general-extra";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGeneralExtras = () => {
    const queryClient = useQueryClient();

    const { data: generalExtras, isLoading } = useQuery({
        queryKey: ['general-extras'],
        queryFn: async () => {
            try {
                const { data, error } = await supabase
                    .from('general_extras')
                    .select('*')
                    .order('name');

                if (error) throw error;

                return data.map(mapDbToGeneralExtra) as GeneralExtra[];
            } catch (error) {
                console.error("Error fetching general extras:", error);
                return [];
            }
        },
    });

    const addMutation = useMutation({
        mutationFn: async (newExtra: Omit<GeneralExtra, 'id' | 'created_at' | 'updated_at'>) => {
            // Convert from our app's type to database schema
            const dbExtra = {
                name: newExtra.name,
                description: newExtra.description || null,
                sku: newExtra.sku,
                cost: newExtra.cost,
                margin: newExtra.margin,
                rrp: newExtra.rrp
            };

            const { data, error } = await supabase
                .from('general_extras')
                .insert([dbExtra])
                .select()
                .single();

            if (error) throw error;

            return mapDbToGeneralExtra(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-extras'] });
            toast.success("Extra item added successfully");
        },
        onError: (error) => {
            toast.error("Failed to add extra item");
            console.error("Error adding extra item:", error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<GeneralExtra> }) => {
            const { data, error } = await supabase
                .from('general_extras')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return mapDbToGeneralExtra(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-extras'] });
            toast.success("Extra item updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update extra item");
            console.error("Error updating extra item:", error);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('general_extras')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['general-extras'] });
            toast.success("Extra item deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete extra item");
            console.error("Error deleting extra item:", error);
        },
    });

    return {
        generalExtras,
        isLoading,
        addGeneralExtra: addMutation.mutate,
        updateGeneralExtra: updateMutation.mutate,
        deleteGeneralExtra: deleteMutation.mutate
    };
}; 