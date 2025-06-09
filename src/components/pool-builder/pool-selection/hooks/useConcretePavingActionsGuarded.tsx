import { useGuardedMutation } from "@/hooks/useGuardedMutation";
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
        mutationFn: async ({ data, tableName, recordIdToUpdate, poolProjectIdForInsert }: { data: any; tableName: string; recordIdToUpdate?: string; poolProjectIdForInsert?: string }) => {
            if (!customerId && !poolProjectIdForInsert) {
                throw new Error("Project ID is missing for the operation.");
            }

            if (recordIdToUpdate) {
                console.log(`[GuardedHook] Attempting UPDATE on ${tableName} for id=${recordIdToUpdate}`);
                const { error } = await supabase.from(tableName as any).update(data).eq('id', recordIdToUpdate);
                if (error) {
                    console.error(`[GuardedHook] Error updating ${tableName} for id=${recordIdToUpdate}:`, error);
                    throw error;
                }
                return { success: true };
            } else {
                console.log(`[GuardedHook] Attempting INSERT on ${tableName}`);
                const insertData = { ...data };
                if (poolProjectIdForInsert && !insertData.pool_project_id) {
                    insertData.pool_project_id = poolProjectIdForInsert;
                }
                if (!insertData.pool_project_id && tableName !== 'pool_projects') {
                    console.warn(`[GuardedHook] pool_project_id missing for INSERT into ${tableName}. This might be an issue.`);
                }

                const { data: newRecord, error } = await supabase.from(tableName as any).insert(insertData).select('id').single();

                if (error) {
                    console.error(`[GuardedHook] Error inserting into ${tableName}:`, error);
                    throw error;
                }
                if (!newRecord || typeof (newRecord as any).id === 'undefined') {
                    console.error(`[GuardedHook] Insert into ${tableName} did not return a new ID or newRecord is null.`);
                    throw new Error("Insert did not return a new ID.");
                }
                return { success: true, newId: (newRecord as any).id };
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

    const handleSave = async (data: any, tableName: string, recordIdToUpdate?: string | null): Promise<{ success: boolean, newId?: string }> => {
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
            const result = await saveDataAsync({ data, tableName, recordIdToUpdate: recordIdToUpdate || undefined, poolProjectIdForInsert: customerId });
            setIsSubmitting(false);
            if (result.success && recordIdToUpdate) toast.success(`${tableName} updated successfully.`);
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