import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SiteRequirementsFormData {
    craneId: string;
    trafficControlId: string;
    bobcatId: string;
    customRequirements: any[];
    notes: string;
    // Site conditions
    accessGrade: string;
    distanceFromTruck: string;
    poolShellDelivery: string;
    sewerDiversion: string;
    stormwaterDiversion: string;
    removeSlab: string;
    earthmoving: string;
    removeSlabSqm: string;
    earthmovingCubicMeters: string;
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

            // 2. Handle site conditions
            // Check if we already have a site conditions record
            const { data: existingSiteConditions } = await supabase
                .from('pool_site_conditions')
                .select('id')
                .eq('pool_project_id', customerId)
                .maybeSingle();

            const siteConditionsData = {
                access_grade: formData.accessGrade === 'none' ? null : formData.accessGrade || null,
                distance_from_truck: formData.distanceFromTruck === 'none' ? null : formData.distanceFromTruck || null,
                pool_shell_delivery: formData.poolShellDelivery === 'none' ? null : formData.poolShellDelivery || null,
                sewer_diversion: formData.sewerDiversion === 'none' ? null : formData.sewerDiversion || null,
                stormwater_diversion: formData.stormwaterDiversion === 'none' ? null : formData.stormwaterDiversion || null,
                remove_slab: formData.removeSlab === 'none' ? null : formData.removeSlab || null,
                earthmoving: formData.earthmoving === 'none' ? null : formData.earthmoving || null,
                remove_slab_sqm: formData.removeSlabSqm ? parseFloat(formData.removeSlabSqm) : null,
                earthmoving_cubic_meters: formData.earthmovingCubicMeters ? parseFloat(formData.earthmovingCubicMeters) : null
            };

            if (existingSiteConditions?.id) {
                // Update existing site conditions
                const { error: siteConditionsError } = await supabase
                    .from('pool_site_conditions')
                    .update(siteConditionsData)
                    .eq('id', existingSiteConditions.id);

                if (siteConditionsError) throw siteConditionsError;
            } else {
                // Create new site conditions record
                const { error: siteConditionsError } = await supabase
                    .from('pool_site_conditions')
                    .insert({
                        pool_project_id: customerId,
                        ...siteConditionsData
                    });

                if (siteConditionsError) throw siteConditionsError;
            }

            // 3. Update site requirements data and notes in pool_projects
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