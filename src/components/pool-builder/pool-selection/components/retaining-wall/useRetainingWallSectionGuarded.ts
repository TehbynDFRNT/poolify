import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall } from "@/types/retaining-wall";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RetainingWallFormValues {
    wallType: string;
    height1: number;
    height2: number;
    length: number;
}

interface RetainingWallSummary {
    totalCost: number;
    marginAmount: number;
    squareMeters: number;
}

export const useRetainingWallSectionGuarded = (
    customerId?: string | null,
    wallNumber?: number,
    retainingWalls?: RetainingWall[]
) => {
    const [summary, setSummary] = useState<RetainingWallSummary>({
        totalCost: 0,
        marginAmount: 0,
        squareMeters: 0,
    });

    const [existingData, setExistingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWall, setSelectedWall] = useState<RetainingWall | null>(null);

    const form = useForm<RetainingWallFormValues>({
        defaultValues: {
            wallType: "",
            height1: 0,
            height2: 0,
            length: 0,
        },
    });

    // Guarded save mutation
    const {
        mutate: saveRetainingWallMutation,
        isPending: isSubmitting,
        StatusWarningDialog: SaveStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (data: RetainingWallFormValues) => {
            if (!customerId) {
                throw new Error("Customer ID is required");
            }

            if (!data.wallType || !data.height1 || !data.height2 || !data.length) {
                throw new Error("Please fill in all required fields");
            }

            const retainingWallData = {
                pool_project_id: customerId,
                wall_type: wallNumber ? `Wall ${wallNumber}: ${data.wallType}` : data.wallType,
                height1: data.height1,
                height2: data.height2,
                length: data.length,
                total_cost: summary.totalCost,
                margin: summary.marginAmount,
            };

            if (existingData?.id) {
                // Update existing record
                const { error } = await supabase
                    .from("pool_retaining_walls")
                    .update({
                        ...retainingWallData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", existingData.id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("pool_retaining_walls")
                    .insert(retainingWallData);

                if (error) throw error;
            }

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success(`Retaining wall ${wallNumber || ''} saved successfully`);
                // Refresh existing data
                fetchExistingData();
            },
            onError: (error) => {
                console.error("Error saving retaining wall:", error);
                toast.error("Failed to save retaining wall");
            },
        },
    });

    // Guarded delete mutation
    const {
        mutate: deleteRetainingWallMutation,
        isPending: isDeleting,
        StatusWarningDialog: DeleteStatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async () => {
            if (!existingData?.id) {
                throw new Error("No retaining wall data to delete");
            }

            const { error } = await supabase
                .from("pool_retaining_walls")
                .delete()
                .eq("id", existingData.id);

            if (error) throw error;
            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success(`Retaining wall ${wallNumber || ''} removed successfully`);
                // Reset form and state
                setExistingData(null);
                form.reset({
                    wallType: "",
                    height1: 0,
                    height2: 0,
                    length: 0,
                });
            },
            onError: (error) => {
                console.error("Error removing retaining wall:", error);
                toast.error("Failed to remove retaining wall");
            },
        },
    });

    // Fetch existing retaining wall data if available
    useEffect(() => {
        fetchExistingData();
    }, [customerId, wallNumber]);

    const fetchExistingData = async () => {
        if (!customerId) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("pool_retaining_walls")
                .select("*")
                .eq("pool_project_id", customerId);

            if (error) {
                console.error("Error fetching retaining wall data:", error);
                return;
            }

            if (data && data.length > 0) {
                // Find the wall for this specific wall number if provided
                let wallData = data[0];
                if (wallNumber) {
                    const specificWall = data.find(wall =>
                        wall.wall_type?.includes(`Wall ${wallNumber}:`)
                    );
                    if (specificWall) {
                        wallData = specificWall;
                    }
                }

                setExistingData(wallData);

                // Extract wall type from the stored format
                let wallType = wallData.wall_type || "";
                if (wallNumber && wallType.includes(`Wall ${wallNumber}:`)) {
                    wallType = wallType.replace(`Wall ${wallNumber}: `, "");
                }

                form.reset({
                    wallType,
                    height1: wallData.height1 || 0,
                    height2: wallData.height2 || 0,
                    length: wallData.length || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching retaining wall data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate costs whenever form values change
    useEffect(() => {
        const calculateCosts = () => {
            const values = form.getValues();

            // Find the selected wall type
            const wall = retainingWalls?.find(w => w.type === values.wallType);
            setSelectedWall(wall || null);

            if (!wall || !values.height1 || !values.height2 || !values.length) {
                setSummary({
                    totalCost: 0,
                    marginAmount: 0,
                    squareMeters: 0,
                });
                return;
            }

            // Calculate square meters: (height1 + height2) / 2 * length
            const squareMeters = ((values.height1 + values.height2) / 2) * values.length;

            // Calculate costs
            const totalCost = squareMeters * wall.total;
            const marginAmount = squareMeters * wall.margin;

            setSummary({
                totalCost,
                marginAmount,
                squareMeters,
            });
        };

        // Run calculation on mount and when form changes
        calculateCosts();

        // Subscribe to form changes
        const subscription = form.watch(() => calculateCosts());

        return () => subscription.unsubscribe();
    }, [form, retainingWalls]);

    const saveRetainingWall = async (data: RetainingWallFormValues) => {
        saveRetainingWallMutation(data);
    };

    const deleteRetainingWall = async () => {
        deleteRetainingWallMutation();
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
        selectedWall,
        isSubmitting,
        isDeleting,
        isLoading,
        existingData,
        saveRetainingWall,
        deleteRetainingWall,
        StatusWarningDialog,
    };
}; 