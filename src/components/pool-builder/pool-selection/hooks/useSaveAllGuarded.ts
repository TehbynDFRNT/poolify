import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useSaveAllGuarded = (
    customerId: string | null | undefined
) => {
    const queryClient = useQueryClient();
    
    // Guarded save all mutation
    const {
        mutate: saveAllMutation,
        isPending: isSubmittingAll,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (data: { selectedPoolId: string; selectedColor?: string }) => {
            if (!customerId) {
                throw new Error("Please save customer information first.");
            }

            if (!data.selectedPoolId) {
                throw new Error("Please select a pool model first.");
            }

            // Save the pool selection directly
            const { error } = await supabase
                .from('pool_projects')
                .update({
                    pool_specification_id: data.selectedPoolId,
                    pool_color: data.selectedColor
                })
                .eq('id', customerId);

            if (error) throw error;

            // Add other section saves here if needed in the future

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast("All sections saved successfully");
                // Invalidate snapshot query to trigger re-render
                if (customerId) {
                    queryClient.invalidateQueries({
                        queryKey: ['project-snapshot', customerId]
                    });
                }
            },
            onError: (error) => {
                console.error("Error saving all sections:", error);
                toast("Failed to save all sections. Please try again.", {
                    className: "bg-destructive text-destructive-foreground"
                });
            },
        },
    });

    const handleSaveAll = async (selectedPoolId: string, selectedColor?: string) => {
        saveAllMutation({ selectedPoolId, selectedColor });
    };

    return {
        isSubmittingAll,
        handleSaveAll,
        StatusWarningDialog,
    };
}; 