import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useSnapshot = (projectId: string) => {
    const { data: snapshot, isLoading: loading, error } = useQuery({
        queryKey: ['project-snapshot', projectId],
        queryFn: async () => {
            try {
                // Fetch snapshot from proposal_snapshot_v view
                const { data, error } = await supabase
                    .from('proposal_snapshot_v')
                    .select('*')
                    .eq('project_id', projectId)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching proposal snapshot:', error);
                return null;
            }
        },
        enabled: !!projectId,
    });

    return { snapshot, loading, error };
}; 