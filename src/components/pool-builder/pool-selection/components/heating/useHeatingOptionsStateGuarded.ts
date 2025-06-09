import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface HeatingOption {
    id: string;
    name: string;
    price: number;
    margin: number;
    total: number;
}

interface HeatingFormValues {
    selectedHeatingId: string;
    notes?: string;
}

interface HeatingSummary {
    selectedOption: HeatingOption | null;
    totalCost: number;
    marginAmount: number;
}

export const useHeatingOptionsStateGuarded = (customerId?: string | null, poolId?: string | null) => {
    const [summary, setSummary] = useState<HeatingSummary>({
        selectedOption: null,
        totalCost: 0,
        marginAmount: 0,
    });

    const [existingData, setExistingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [heatingOptions, setHeatingOptions] = useState<HeatingOption[]>([]);

    const form = useForm<HeatingFormValues>({
        defaultValues: {
            selectedHeatingId: "",
            notes: "",
        },
    });

    // Load heating options
    useEffect(() => {
        const fetchHeatingOptions = async () => {
            try {
                const { data, error } = await supabase
                    .from("heating_installations")
                    .select("*")
                    .order("installation_type");

                if (error) {
                    console.error("Error fetching heating options:", error);
                    return;
                }

                setHeatingOptions(data || []);
            } catch (error) {
                console.error("Error fetching heating options:", error);
            }
        };

        fetchHeatingOptions();
    }, []);

    // Guarded save mutation
    const {
        mutate: saveHeatingOptionsMutation,
        isPending: isSubmitting,
        StatusWarningDialog: SaveStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (data: HeatingFormValues) => {
            if (!customerId || !poolId) {
                throw new Error("Customer and pool information is required");
            }

            const heatingData = {
                customer_id: customerId,
                pool_id: poolId,
                include_heat_pump: data.selectedHeatingId !== "",
                heat_pump_id: data.selectedHeatingId || null,
                include_blanket_roller: false, // This would need to be handled separately
                blanket_roller_id: null,
                heat_pump_cost: summary.totalCost,
                blanket_roller_cost: 0,
                total_cost: summary.totalCost,
                total_margin: summary.marginAmount,
            };

            if (existingData?.id) {
                // Update existing record
                const { error } = await supabase
                    .from("pool_heating_options")
                    .update({
                        ...heatingData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", existingData.id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("pool_heating_options")
                    .insert(heatingData);

                if (error) throw error;
            }

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Heating options saved successfully");
                // Refresh existing data
                fetchExistingData();
            },
            onError: (error) => {
                console.error("Error saving heating options:", error);
                toast.error("Failed to save heating options");
            },
        },
    });

    // Guarded delete mutation
    const {
        mutate: deleteHeatingOptionsMutation,
        isPending: isDeleting,
        StatusWarningDialog: DeleteStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!existingData?.id) {
                throw new Error("No heating options data to delete");
            }

            const { error } = await supabase
                .from("pool_heating_options")
                .delete()
                .eq("id", existingData.id);

            if (error) throw error;
            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Heating options removed successfully");
                // Reset form and state
                setExistingData(null);
                form.reset({
                    selectedHeatingId: "",
                    notes: "",
                });
            },
            onError: (error) => {
                console.error("Error removing heating options:", error);
                toast.error("Failed to remove heating options");
            },
        },
    });

    // Fetch existing heating options data if available
    useEffect(() => {
        fetchExistingData();
    }, [customerId, poolId]);

    const fetchExistingData = async () => {
        if (!customerId || !poolId) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("pool_heating_options")
                .select("*")
                .eq("customer_id", customerId)
                .eq("pool_id", poolId);

            if (error) {
                console.error("Error fetching heating options data:", error);
                return;
            }

            if (data && data.length > 0) {
                const firstRecord = data[0];
                setExistingData(firstRecord);
                form.reset({
                    selectedHeatingId: firstRecord.heat_pump_id || "",
                    notes: "", // Notes field doesn't exist in this table
                });
            }
        } catch (error) {
            console.error("Error fetching heating options data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate costs whenever form values change
    useEffect(() => {
        const calculateCosts = () => {
            const values = form.getValues();

            // Find the selected heating option
            const selectedOption = heatingOptions.find(option => option.id === values.selectedHeatingId);

            if (!selectedOption) {
                setSummary({
                    selectedOption: null,
                    totalCost: 0,
                    marginAmount: 0,
                });
                return;
            }

            setSummary({
                selectedOption,
                totalCost: selectedOption.total,
                marginAmount: selectedOption.margin,
            });
        };

        // Run calculation on mount and when form changes
        calculateCosts();

        // Subscribe to form changes
        const subscription = form.watch(() => calculateCosts());

        return () => subscription.unsubscribe();
    }, [form, heatingOptions]);

    const saveHeatingOptions = async (data: HeatingFormValues) => {
        saveHeatingOptionsMutation(data);
    };

    const deleteHeatingOptions = async () => {
        deleteHeatingOptionsMutation();
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
        heatingOptions,
        isSubmitting,
        isDeleting,
        isLoading,
        existingData,
        saveHeatingOptions,
        deleteHeatingOptions,
        StatusWarningDialog,
    };
}; 