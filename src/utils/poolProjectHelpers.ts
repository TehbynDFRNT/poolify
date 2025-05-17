import { supabase } from "@/integrations/supabase/client";
import {
    PoolConcreteSelection,
    PoolEquipmentSelection,
    PoolFenceConcreteStrip,
    PoolPavingSelection,
    PoolRetainingWall,
} from "@/integrations/supabase/types";
import { PoolProject } from "@/types/pool";

/**
 * Type definition for extended equipment selections with related data
 */
export interface ExtendedPoolEquipmentSelection extends PoolEquipmentSelection {
    crane?: { id: string; name?: string; price: number };
    traffic_control?: { id: string; name?: string; price: number };
    bobcat?: { id: string; size_category?: string; price: number };
}

/**
 * Validate UUID format
 */
export const isValidUuid = (id: string): boolean => {
    return !!id && typeof id === 'string' && !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
};

/**
 * Comprehensive function to fetch a pool project with all related junction table data
 */
export const fetchPoolProjectWithRelations = async (projectId: string) => {
    try {
        console.log(`[fetchPoolProjectWithRelations] Fetching data for projectId: ${projectId}`);

        // Check if projectId is a valid UUID
        if (!isValidUuid(projectId)) {
            console.error("Invalid UUID format for projectId:", projectId);
            return { data: null, error: new Error("Invalid UUID format") };
        }

        // Get the main project data without trying to include pool_heating_options directly
        const { data, error } = await supabase
            .from('pool_projects')
            .select(`
                *,
                pool_specifications(*),
                pool_retaining_walls(*),
                pool_concrete_selections(*),
                pool_paving_selections(*),
                pool_fence_concrete_strips(*),
                pool_equipment_selections(
                    *,
                    crane:crane_id(*),
                    traffic_control:traffic_control_id(*),
                    bobcat:bobcat_id(*)
                )
            `)
            .eq('id', projectId)
            .single();

        if (error) {
            console.error("[fetchPoolProjectWithRelations] Error fetching pool project:", error);
            throw error;
        }

        console.log(`[fetchPoolProjectWithRelations] Successfully fetched main project data for ${projectId}`);

        // Separately fetch heating options
        // Note: pool_heating_options.customer_id points to pool_projects.id
        const { data: heatingOptions, error: heatingError } = await supabase
            .from('pool_heating_options')
            .select('*')
            .eq('customer_id', projectId)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (heatingError) {
            console.error("[fetchPoolProjectWithRelations] Error fetching heating options:", heatingError);
        } else {
            console.log(`[fetchPoolProjectWithRelations] Successfully fetched heating options for ${projectId}:`, heatingOptions?.length || 0);
        }

        // Combine all the data for a complete project view
        const combinedData = {
            ...data,
            pool_heating_options: heatingOptions || []
        };

        return { data: combinedData, error: null };
    } catch (error) {
        console.error("[fetchPoolProjectWithRelations] Error fetching pool project with relations:", error);
        return { data: null, error };
    }
};

/**
 * Function to update a pool project and its junction table data
 */
export const updatePoolProject = async (
    projectId: string,
    projectData: Partial<PoolProject>,
    retainingWalls?: Partial<PoolRetainingWall>[],
    concreteSelections?: Partial<PoolConcreteSelection>,
    pavingSelections?: Partial<PoolPavingSelection>,
    fenceConcreteStrips?: Partial<PoolFenceConcreteStrip>,
    equipmentSelections?: Partial<PoolEquipmentSelection>
) => {
    try {
        // Check if projectId is a valid UUID
        if (!isValidUuid(projectId)) {
            console.error("Invalid UUID format for projectId:", projectId);
            return { success: false, error: new Error("Invalid UUID format") };
        }

        // Update main project data
        const { error: projectError } = await supabase
            .from('pool_projects')
            .update(projectData)
            .eq('id', projectId);

        if (projectError) throw projectError;

        // Update retaining walls if provided
        if (retainingWalls && retainingWalls.length > 0) {
            // First delete existing walls
            await supabase
                .from('pool_retaining_walls')
                .delete()
                .eq('pool_project_id', projectId);

            // Then insert new ones
            const { error: wallsError } = await supabase
                .from('pool_retaining_walls')
                .insert(
                    retainingWalls.map(wall => ({
                        ...wall,
                        pool_project_id: projectId
                    }))
                );

            if (wallsError) throw wallsError;
        }

        // Update concrete selections if provided
        if (concreteSelections) {
            const { data: existingData } = await supabase
                .from('pool_concrete_selections')
                .select('id')
                .eq('pool_project_id', projectId)
                .maybeSingle();

            if (existingData?.id) {
                // Update existing record
                const { error: concreteError } = await supabase
                    .from('pool_concrete_selections')
                    .update(concreteSelections)
                    .eq('id', existingData.id);

                if (concreteError) throw concreteError;
            } else {
                // Insert new record
                const { error: concreteError } = await supabase
                    .from('pool_concrete_selections')
                    .insert({
                        ...concreteSelections,
                        pool_project_id: projectId
                    });

                if (concreteError) throw concreteError;
            }
        }

        // Update paving selections if provided
        if (pavingSelections) {
            const { data: existingData } = await supabase
                .from('pool_paving_selections')
                .select('id')
                .eq('pool_project_id', projectId)
                .maybeSingle();

            if (existingData?.id) {
                // Update existing record
                const { error: pavingError } = await supabase
                    .from('pool_paving_selections')
                    .update(pavingSelections)
                    .eq('id', existingData.id);

                if (pavingError) throw pavingError;
            } else {
                // Insert new record
                const { error: pavingError } = await supabase
                    .from('pool_paving_selections')
                    .insert({
                        ...pavingSelections,
                        pool_project_id: projectId
                    });

                if (pavingError) throw pavingError;
            }
        }

        // Update fence concrete strips if provided
        if (fenceConcreteStrips) {
            const { data: existingData } = await supabase
                .from('pool_fence_concrete_strips')
                .select('id')
                .eq('pool_project_id', projectId)
                .maybeSingle();

            if (existingData?.id) {
                // Update existing record
                const { error: fenceError } = await supabase
                    .from('pool_fence_concrete_strips')
                    .update(fenceConcreteStrips)
                    .eq('id', existingData.id);

                if (fenceError) throw fenceError;
            } else {
                // Insert new record
                const { error: fenceError } = await supabase
                    .from('pool_fence_concrete_strips')
                    .insert({
                        ...fenceConcreteStrips,
                        pool_project_id: projectId
                    });

                if (fenceError) throw fenceError;
            }
        }

        // Update equipment selections if provided
        if (equipmentSelections) {
            const { data: existingData } = await supabase
                .from('pool_equipment_selections')
                .select('id')
                .eq('pool_project_id', projectId)
                .maybeSingle();

            if (existingData?.id) {
                // Update existing record
                const { error: equipmentError } = await supabase
                    .from('pool_equipment_selections')
                    .update(equipmentSelections)
                    .eq('id', existingData.id);

                if (equipmentError) throw equipmentError;
            } else {
                // Insert new record
                const { error: equipmentError } = await supabase
                    .from('pool_equipment_selections')
                    .insert({
                        ...equipmentSelections,
                        pool_project_id: projectId
                    });

                if (equipmentError) throw equipmentError;
            }
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating pool project with relations:", error);
        return { success: false, error };
    }
};

/**
 * Helper to extract first item from a junction table array or return empty object
 */
export const getFirstOrEmpty = <T>(items: T[] | undefined | null): T | Record<string, never> => {
    if (!items || items.length === 0) return {};
    return items[0];
}; 