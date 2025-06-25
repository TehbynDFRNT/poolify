import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { type ExtraConcretingType } from "@/hooks/useExtraConcreting";
import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";
import { toast } from "sonner";

export const useConcretePavingActionsGuarded = (customerId: string | null | undefined) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        mutateAsync: saveDataAsync,
        isPending: isSavingGuarded,
        StatusWarningDialog: SaveStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async ({ data, tableName }: { data: any; tableName: string }) => {
            if (!customerId) {
                throw new Error("Project ID is missing for the operation.");
            }

            // Map slug ➞ UUID for extra_concreting_type if needed
            if (tableName === "pool_paving_selections" && data.extra_concreting_type) {
                try {
                    const { data: concretingTypes, error } = await supabase
                        .from("extra_concreting")
                        .select("id, type")
                        .order("display_order", { ascending: true });
                    
                    if (!error && concretingTypes) {
                        const found = concretingTypes.find((o: ExtraConcretingType) =>
                            o.id === data.extra_concreting_type ||
                            o.type.toLowerCase().replace(/\s+/g, "-") === data.extra_concreting_type.toLowerCase()
                        );
                        if (found) data.extra_concreting_type = found.id;
                    }
                } catch (error) {
                    console.warn("Could not fetch concreting types for slug mapping:", error);
                }
            }

            // Check if record exists for this pool_project_id
            const { data: existingData, error: checkError } = await supabase
                .from(tableName as any)
                .select('id')
                .eq('pool_project_id', customerId)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error(`[GuardedHook] Error checking for existing record in ${tableName}:`, checkError);
                throw checkError;
            }

            if (existingData?.id) {
                console.log(`[GuardedHook] Updating existing record in ${tableName} for pool_project_id=${customerId}`);
                
                // Fetch existing record to preserve other fields
                const { data: existingRecord, error: fetchError } = await supabase
                    .from(tableName as any)
                    .select('*')
                    .eq('id', existingData.id)
                    .single();

                if (fetchError) {
                    console.error(`[GuardedHook] Error fetching existing record:`, fetchError);
                    throw fetchError;
                }

                // Merge new data with existing data
                const mergedData = { ...existingRecord, ...data };

                // Update the existing record
                const { error: updateError } = await supabase
                    .from(tableName as any)
                    .update(mergedData)
                    .eq('id', existingData.id);

                if (updateError) {
                    console.error(`[GuardedHook] Error updating ${tableName}:`, updateError);
                    throw updateError;
                }
                return { success: true };
            } else {
                console.log(`[GuardedHook] Inserting new record in ${tableName} for pool_project_id=${customerId}`);
                
                // Insert new record with pool_project_id
                const insertData = {
                    ...data,
                    pool_project_id: customerId
                };

                const { error: insertError } = await supabase
                    .from(tableName as any)
                    .insert(insertData);

                if (insertError) {
                    console.error(`[GuardedHook] Error inserting into ${tableName}:`, insertError);
                    throw insertError;
                }
                return { success: true };
            }
        },
        mutationOptions: {
        },
    });

    const {
        mutateAsync: deleteDataAsync,
        isPending: isDeletingGuarded,
        StatusWarningDialog: DeleteStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async ({ field, tableName }: { field: string; tableName: string }) => {
            if (!customerId) {
                throw new Error("Customer ID is missing.");
            }
            const updateData: Record<string, null> = { [field]: null };

            let idColumnForEq: string = 'pool_project_id';
            let idValueForEq: string | undefined = customerId;

            if (tableName === 'pool_projects') {
                idColumnForEq = 'id';
            }
            if (!idValueForEq) {
                throw new Error(`Cannot determine ID for delete operation on table ${tableName}.`);
            }

            const { error } = await supabase
                .from(tableName as any)
                .update(updateData)
                .eq(idColumnForEq, idValueForEq);

            if (error) {
                console.error(`Error deleting data in ${tableName} for ${idColumnForEq} = ${idValueForEq}:`, error);
                throw error;
            }
            return { success: true };
        },
        mutationOptions: {
        },
    });

    const handleSave = async (data: any, tableName: string): Promise<{ success: boolean }> => {
        if (!customerId) {
            toast.error("Please save customer information first");
            return { success: false };
        }
        if (!saveDataAsync) {
            console.error("saveDataAsync (mutateAsync) is not available from useGuardedMutation.");
            toast.error("Save function not properly initialized.");
            return { success: false };
        }

        try {
            setIsSubmitting(true);
            const result = await saveDataAsync({ data, tableName });
            setIsSubmitting(false);
            toast.success(`${tableName} saved successfully.`);
            return result;
        } catch (error) {
            console.error("[GuardedHook] handleSave caught an error:", error);
            setIsSubmitting(false);
            return { success: false };
        }
    };

    const handleDelete = async (field: string, tableName: string) => {
        if (!customerId) {
            toast.error("Please save customer information first");
            return false;
        }
        if (!deleteDataAsync) {
            console.error("deleteDataAsync (mutateAsync) is not available from useGuardedMutation.");
            toast.error("Delete function not properly initialized.");
            return false;
        }
        try {
            setIsDeleting(true);
            await deleteDataAsync({ field, tableName });
            setIsDeleting(false);
            return true;
        } catch (error) {
            console.error("handleDelete caught an error:", error);
            setIsDeleting(false);
            return false;
        }
    };

    const StatusWarningDialog: React.FC = () => {
        return (
            <>
                <SaveStatusWarningDialog />
                <DeleteStatusWarningDialog />
            </>
        );
    };

    return {
        handleSave,
        handleDelete,
        isSubmitting: isSubmitting || isSavingGuarded,
        isDeleting: isDeleting || isDeletingGuarded,
        StatusWarningDialog,
    };
}; 