import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SiteRequirementsFormData {
    craneId: string;
    trafficControlId: string;
    bobcatId: string;
    customRequirements: any[];
    notes: string;
}

export const useSiteRequirementsGuarded = (customerId: string) => {
    // Guarded save mutation
    const {
        mutate: saveSiteRequirementsMutation,
        isPending: isSubmitting,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId: customerId || '',
        mutationFn: async (formData: SiteRequirementsFormData) => {
            if (!customerId) {
                throw new Error("Customer ID is required");
            }

            console.log('Saving site requirements with data:', formData);

            // Start a transaction to update both tables

            // 1. First check if we already have an equipment selection record
            const { data: existingEquipment } = await supabase
                .from('pool_equipment_selections')
                .select('id')
                .eq('pool_project_id', customerId)
                .maybeSingle();

            if (existingEquipment?.id) {
                // Update existing equipment selections
                const updateData = {
                    crane_id: formData.craneId === 'none' ? null : formData.craneId,
                    traffic_control_id: formData.trafficControlId === 'none' ? null : formData.trafficControlId,
                    bobcat_id: formData.bobcatId === 'none' ? null : formData.bobcatId
                };
                
                console.log('Updating equipment selections with:', updateData);
                
                const { error: equipmentError } = await supabase
                    .from('pool_equipment_selections')
                    .update(updateData)
                    .eq('id', existingEquipment.id);

                if (equipmentError) throw equipmentError;
            } else {
                // Create new equipment selections record
                const { error: equipmentError } = await supabase
                    .from('pool_equipment_selections')
                    .insert({
                        pool_project_id: customerId,
                        crane_id: formData.craneId === 'none' ? null : formData.craneId,
                        traffic_control_id: formData.trafficControlId === 'none' ? null : formData.trafficControlId,
                        bobcat_id: formData.bobcatId === 'none' ? null : formData.bobcatId
                    });

                if (equipmentError) throw equipmentError;
            }

            // 2. Update site requirements data and notes in pool_projects
            const { error: projectError } = await supabase
                .from('pool_projects')
                .update({
                    site_requirements_data: formData.customRequirements,
                    site_requirements_notes: formData.notes
                })
                .eq('id', customerId);

            if (projectError) throw projectError;

            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success("Site requirements saved successfully");
            },
            onError: (error) => {
                console.error("Error saving site requirements:", error);
                toast.error("Failed to save site requirements");
            },
        },
    });

    const saveSiteRequirements = async (formData: SiteRequirementsFormData) => {
        saveSiteRequirementsMutation(formData);
    };

    return {
        saveSiteRequirements,
        isSubmitting,
        StatusWarningDialog,
    };
}; 