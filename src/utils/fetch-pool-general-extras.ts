import { supabase } from "@/integrations/supabase/client";
import { PoolGeneralExtra, mapDbToPoolGeneralExtra } from "@/types/pool-general-extra";

/**
 * Fetches general extras associated with a pool project
 * @param customerId The pool project ID (not the customer ID, despite the parameter name)
 * @returns Array of pool general extras or empty array if none found
 */
export const fetchPoolGeneralExtras = async (customerId: string): Promise<PoolGeneralExtra[]> => {
    if (!customerId) return [];

    try {
        const { data, error } = await supabase
            .from('pool_general_extras' as any)
            .select('*')
            .eq('pool_project_id', customerId)
            .order('created_at');

        if (error) {
            console.error("Error fetching pool general extras:", error);
            return [];
        }

        return data.map(mapDbToPoolGeneralExtra);
    } catch (error) {
        console.error("Error in pool general extras fetch:", error);
        return [];
    }
}; 