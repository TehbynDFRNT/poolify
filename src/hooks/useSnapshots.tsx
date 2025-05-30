import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useSnapshots = (projectIds: string[]) => {
    const { data: snapshots, isLoading: loading, error } = useQuery<Map<string, any>>({
        queryKey: ['project-statuses', projectIds],
        queryFn: async () => {
            try {
                if (!projectIds || projectIds.length === 0) {
                    return new Map<string, any>();
                }

                // Fetch status and date fields from pool_proposal_status and pool_projects tables
                const { data: statusData, error: statusError } = await supabase
                    .from('pool_proposal_status')
                    .select('pool_project_id, status, last_viewed, last_change_requested, accepted_datetime')
                    .in('pool_project_id', projectIds);

                if (statusError) throw statusError;

                // Fetch created_at and updated_at from pool_projects table
                const { data: projectData, error: projectError } = await supabase
                    .from('pool_projects')
                    .select('id, created_at, updated_at')
                    .in('id', projectIds);

                if (projectError) throw projectError;

                console.log('Fetched status data:', statusData);
                console.log('Fetched project data:', projectData);
                
                // Create maps for easy lookup
                const projectMap = new Map();
                projectData?.forEach(project => {
                    projectMap.set(project.id, project);
                });
                
                // Convert to a map for easy lookup, combining both datasets
                const snapshotMap = new Map<string, any>();
                statusData?.forEach(statusRecord => {
                    const projectInfo = projectMap.get(statusRecord.pool_project_id);
                    snapshotMap.set(statusRecord.pool_project_id, {
                        ...statusRecord,
                        created_at: projectInfo?.created_at,
                        updated_at: projectInfo?.updated_at
                    });
                });
                
                // For projects that don't have status records, add them with default status
                projectData?.forEach(project => {
                    if (!snapshotMap.has(project.id)) {
                        snapshotMap.set(project.id, {
                            pool_project_id: project.id,
                            status: 'created',
                            created_at: project.created_at,
                            updated_at: project.updated_at,
                            last_viewed: null,
                            last_change_requested: null,
                            accepted_datetime: null
                        });
                    }
                });
                
                console.log('Combined status map:', Array.from(snapshotMap.entries()));
                
                return snapshotMap;
            } catch (error) {
                console.error('Error fetching proposal snapshots:', error);
                return new Map();
            }
        },
        enabled: projectIds.length > 0,
    });

    return { snapshots, loading, error };
};