import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface GeneralExtra {
    id: string;
    name: string;
    price: number;
    margin: number;
    total: number;
    category?: string;
}

interface GeneralExtrasFormValues {
    selectedExtras: string[];
    notes?: string;
}

interface GeneralExtrasSummary {
    selectedExtras: GeneralExtra[];
    totalCost: number;
    totalMargin: number;
    itemCount: number;
}

export const usePoolGeneralExtrasGuarded = (customerId?: string | null, poolId?: string | null) => {
    const [summary, setSummary] = useState<GeneralExtrasSummary>({
        selectedExtras: [],
        totalCost: 0,
        totalMargin: 0,
        itemCount: 0,
    });

    const [existingData, setExistingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [generalExtras, setGeneralExtras] = useState<GeneralExtra[]>([]);

    const form = useForm<GeneralExtrasFormValues>({
        defaultValues: {
            selectedExtras: [],
            notes: "",
        },
    });

    // Load general extras - this would need to be implemented based on actual schema
    useEffect(() => {
        const fetchGeneralExtras = async () => {
            try {
                // For now, set empty array since the table doesn't exist in schema
                // This would need to be implemented when the general_extras table is created
                setGeneralExtras([]);
            } catch (error) {
                console.error("Error fetching general extras:", error);
            }
        };

        fetchGeneralExtras();
    }, []);

    // Guarded save mutation
    const {
        mutate: saveGeneralExtrasMutation,
        isPending: isSubmitting,
        StatusWarningDialog: SaveStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (data: GeneralExtrasFormValues) => {
            if (!customerId || !poolId) {
                throw new Error("Customer and pool information is required");
            }

            const generalExtrasData = {
                customer_id: customerId,
                pool_id: poolId,
                selected_extras: data.selectedExtras,
                notes: data.notes || null,
                total_cost: summary.totalCost,
                total_margin: summary.totalMargin,
                item_count: summary.itemCount,
            };

            if (existingData?.id) {
                // Update existing record - would need proper table when implemented
                // For now, just throw an error
                throw new Error("General extras table not yet implemented");
            } else {
                // Insert new record - would need proper table when implemented
                throw new Error("General extras table not yet implemented");
            }

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("General extras saved successfully");
                // Refresh existing data
                fetchExistingData();
            },
            onError: (error) => {
                console.error("Error saving general extras:", error);
                toast.error("Failed to save general extras");
            },
        },
    });

    // Guarded delete mutation
    const {
        mutate: deleteGeneralExtrasMutation,
        isPending: isDeleting,
        StatusWarningDialog: DeleteStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!existingData?.id) {
                throw new Error("No general extras data to delete");
            }

            // Delete operation - would need proper table when implemented
            throw new Error("General extras table not yet implemented");
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("General extras removed successfully");
                // Reset form and state
                setExistingData(null);
                form.reset({
                    selectedExtras: [],
                    notes: "",
                });
            },
            onError: (error) => {
                console.error("Error removing general extras:", error);
                toast.error("Failed to remove general extras");
            },
        },
    });

    // Fetch existing general extras data if available
    useEffect(() => {
        fetchExistingData();
    }, [customerId, poolId]);

    const fetchExistingData = async () => {
        if (!customerId || !poolId) return;

        setIsLoading(true);
        try {
            // For now, no existing data since table doesn't exist
            // This would need to be implemented when the table is created
            setExistingData(null);
        } catch (error) {
            console.error("Error fetching general extras data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate costs whenever form values change
    useEffect(() => {
        const calculateCosts = () => {
            const values = form.getValues();

            // Find the selected extras
            const selectedExtras = generalExtras.filter(extra =>
                values.selectedExtras.includes(extra.id)
            );

            const totalCost = selectedExtras.reduce((sum, extra) => sum + extra.total, 0);
            const totalMargin = selectedExtras.reduce((sum, extra) => sum + extra.margin, 0);

            setSummary({
                selectedExtras,
                totalCost,
                totalMargin,
                itemCount: selectedExtras.length,
            });
        };

        // Run calculation on mount and when form changes
        calculateCosts();

        // Subscribe to form changes
        const subscription = form.watch(() => calculateCosts());

        return () => subscription.unsubscribe();
    }, [form, generalExtras]);

    const saveGeneralExtras = async (data: GeneralExtrasFormValues) => {
        saveGeneralExtrasMutation(data);
    };

    const deleteGeneralExtras = async () => {
        deleteGeneralExtrasMutation();
    };

    const toggleExtra = (extraId: string) => {
        const currentExtras = form.getValues("selectedExtras");
        const isSelected = currentExtras.includes(extraId);

        if (isSelected) {
            form.setValue("selectedExtras", currentExtras.filter(id => id !== extraId));
        } else {
            form.setValue("selectedExtras", [...currentExtras, extraId]);
        }
    };

    // Combined status warning dialog
    const StatusWarningDialog = () => {
        return (
            <>
            <SaveStatusWarningDialog />
            < DeleteStatusWarningDialog />
            </>
        );
    };

    return {
        form,
        summary,
        generalExtras,
        isSubmitting,
        isDeleting,
        isLoading,
        existingData,
        saveGeneralExtras,
        deleteGeneralExtras,
        toggleExtra,
        StatusWarningDialog,
    };
}; 