import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CostCalculation, FencingFormValues } from "../types";

export const useFencingFormGuarded = (
    customerId: string,
    onSaveSuccess?: () => void,
    poolId?: string
) => {
    const [existingDataId, setExistingDataId] = useState<string | null>(null);
    const [costs, setCosts] = useState<CostCalculation>({
        linearCost: 0,
        gatesCost: 0,
        freeGateDiscount: 0,
        simplePanelsCost: 0,
        complexPanelsCost: 0,
        earthingCost: 0,
        totalCost: 0
    });

    // Initialize form with default values
    const form = useForm<FencingFormValues>({
        defaultValues: {
            linearMeters: 0,
            gates: 0,
            simplePanels: 0,
            complexPanels: 0,
            earthingRequired: false
        }
    });

    // Watch for form changes to calculate costs in real-time
    const linearMeters = form.watch("linearMeters");
    const gates = form.watch("gates");
    const simplePanels = form.watch("simplePanels");
    const complexPanels = form.watch("complexPanels");
    const earthingRequired = form.watch("earthingRequired");

    // Guarded save mutation
    const {
        mutate: saveFencingMutation,
        isPending: isSubmitting,
        StatusWarningDialog: SaveStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (values: FencingFormValues) => {
            if (!customerId) {
                throw new Error("Customer ID is required");
            }

            if (!poolId) {
                throw new Error("Pool ID is required");
            }

            // Check if an entry already exists
            const { data: existingData, error: fetchError } = await supabase
                .from("frameless_glass_fencing")
                .select("id")
                .eq("customer_id", customerId)
                .limit(1);

            if (fetchError) {
                throw fetchError;
            }

            let saveError;

            if (existingData && existingData.length > 0) {
                // Update existing entry
                const { error } = await supabase
                    .from("frameless_glass_fencing")
                    .update({
                        linear_meters: values.linearMeters,
                        gates: values.gates,
                        simple_panels: values.simplePanels,
                        complex_panels: values.complexPanels,
                        earthing_required: values.earthingRequired,
                        total_cost: costs.totalCost,
                        pool_id: poolId
                    })
                    .eq("id", existingData[0].id);

                saveError = error;
                if (!error) {
                    setExistingDataId(existingData[0].id);
                }
            } else {
                // Create new entry
                const { data, error } = await supabase
                    .from("frameless_glass_fencing")
                    .insert({
                        customer_id: customerId,
                        pool_id: poolId,
                        linear_meters: values.linearMeters,
                        gates: values.gates,
                        simple_panels: values.simplePanels,
                        complex_panels: values.complexPanels,
                        earthing_required: values.earthingRequired,
                        total_cost: costs.totalCost
                    })
                    .select();

                saveError = error;
                if (!error && data) {
                    setExistingDataId(data[0].id);
                }
            }

            if (saveError) {
                throw saveError;
            }

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Frameless glass fencing saved successfully");
                // Call the callback if provided
                if (onSaveSuccess) {
                    onSaveSuccess();
                }
            },
            onError: (error) => {
                console.error("Error saving fencing:", error);
                toast.error("Failed to save fencing details");
            },
        },
    });

    // Guarded delete mutation
    const {
        mutate: deleteFencingMutation,
        isPending: isDeleting,
        StatusWarningDialog: DeleteStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!customerId || !existingDataId) {
                throw new Error("No fencing data to delete");
            }

            const { error } = await supabase
                .from("frameless_glass_fencing")
                .delete()
                .eq("id", existingDataId);

            if (error) {
                throw error;
            }

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Frameless glass fencing removed successfully");

                // Reset form after deletion
                form.reset({
                    linearMeters: 0,
                    gates: 0,
                    simplePanels: 0,
                    complexPanels: 0,
                    earthingRequired: false
                });

                setExistingDataId(null);

                // Call the callback if provided
                if (onSaveSuccess) {
                    onSaveSuccess();
                }
            },
            onError: (error) => {
                console.error("Error deleting fencing:", error);
                toast.error("Failed to delete fencing");
            },
        },
    });

    // Load existing data if available
    useEffect(() => {
        const loadExistingData = async () => {
            if (!customerId) return;

            const { data, error } = await supabase
                .from("frameless_glass_fencing")
                .select("*")
                .eq("customer_id", customerId)
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Error loading fencing data:", error);
                return;
            }

            if (data && data.length > 0) {
                const fencingData = data[0];
                setExistingDataId(fencingData.id);
                form.reset({
                    linearMeters: fencingData.linear_meters,
                    gates: fencingData.gates,
                    simplePanels: fencingData.simple_panels,
                    complexPanels: fencingData.complex_panels,
                    earthingRequired: fencingData.earthing_required
                });
            }
        };

        loadExistingData();
    }, [customerId, form]);

    // Calculate costs whenever form values change
    useEffect(() => {
        const linearCost = linearMeters * 195;
        const gatesCost = gates * 385;
        // First gate is free (if there is at least one gate)
        const freeGateDiscount = gates > 0 ? -385 : 0;
        const simplePanelsCost = simplePanels * 220;
        const complexPanelsCost = complexPanels * 385;
        const earthingCost = earthingRequired ? 40 : 0;

        const totalCost = linearCost + gatesCost + freeGateDiscount + simplePanelsCost + complexPanelsCost + earthingCost;

        setCosts({
            linearCost,
            gatesCost,
            freeGateDiscount,
            simplePanelsCost,
            complexPanelsCost,
            earthingCost,
            totalCost
        });
    }, [linearMeters, gates, simplePanels, complexPanels, earthingRequired]);

    // Handle form submission
    const onSubmit = async (values: FencingFormValues) => {
        saveFencingMutation(values);
    };

    // Handle delete
    const onDelete = async () => {
        deleteFencingMutation();
    };

    // Combined status warning dialog - we return the individual dialogs for the component to render
    const StatusWarningDialog = () => {
        // In a .ts file we can't use JSX, so we return the individual dialogs
        return () => {
            // The component using this hook will render both dialogs
            return null;
        };
    };

    return {
        form,
        costs,
        isSubmitting,
        isDeleting,
        hasExistingData: !!existingDataId,
        onSubmit,
        onDelete,
        StatusWarningDialog: SaveStatusWarningDialog,
        DeleteStatusWarningDialog,
    };
}; 