import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ProjectStatus {
    status: string;
    accepted_datetime?: string;
}

interface UseProjectStatusGuardProps {
    projectId: string;
}

export const useProjectStatusGuard = ({ projectId }: UseProjectStatusGuardProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingOperation, setPendingOperation] = useState<(() => Promise<void>) | null>(null);
    const [pendingPromise, setPendingPromise] = useState<{
        resolve: () => void;
        reject: (error?: Error) => void;
    } | null>(null);

    // Fetch current project status
    const { data: projectStatus } = useQuery<ProjectStatus | null>({
        queryKey: ['project-status-guard', projectId],
        queryFn: async () => {
            if (!projectId) return null;

            try {
                const { data, error } = await supabase
                    .from('pool_proposal_status')
                    .select('status, accepted_datetime')
                    .eq('pool_project_id', projectId)
                    .single();

                if (error) {
                    console.error('Error fetching project status:', error);
                    return null;
                }

                return data;
            } catch (error) {
                console.error('Error in project status query:', error);
                return null;
            }
        },
        enabled: !!projectId,
    });

    // Generate session storage key for this project
    const getSessionKey = useCallback(() => {
        return `project_status_acknowledged_${projectId}`;
    }, [projectId]);

    // Check if user has already acknowledged the warning for this session
    const hasUserAcknowledged = useCallback(() => {
        try {
            return sessionStorage.getItem(getSessionKey()) === 'true';
        } catch {
            return false;
        }
    }, [getSessionKey]);

    // Set acknowledgment in session storage
    const setUserAcknowledged = useCallback(() => {
        try {
            sessionStorage.setItem(getSessionKey(), 'true');
        } catch (error) {
            console.error('Error setting session storage:', error);
        }
    }, [getSessionKey]);

    // Clear acknowledgment from session storage
    const clearUserAcknowledged = useCallback(() => {
        try {
            sessionStorage.removeItem(getSessionKey());
        } catch (error) {
            console.error('Error clearing session storage:', error);
        }
    }, [getSessionKey]);

    // Get user-friendly status description
    const getStatusDescription = useCallback((status: string) => {
        switch (status) {
            case 'viewed':
                return 'viewed by the customer';
            case 'accepted':
                return 'accepted by the customer';
            case 'change_requested':
                return 'has change requests from the customer';
            default:
                return `in "${status}" status`;
        }
    }, []);

    // Main guard function
    const guardedOperation = useCallback(async (operation: () => Promise<void>): Promise<void> => {
        if (!projectStatus) {
            // If we can't determine status, allow the operation
            await operation();
            return;
        }

        const { status } = projectStatus;

        // If status is 'created' or 'sent', allow operation without warning
        if (['created', 'sent'].includes(status)) {
            await operation();
            return;
        }

        // If user has already acknowledged this session, proceed
        if (hasUserAcknowledged()) {
            await operation();
            return;
        }

        // Show warning dialog and return a Promise that resolves/rejects based on user action
        return new Promise<void>((resolve, reject) => {
            setPendingOperation(() => operation);
            setPendingPromise({ resolve, reject });
            setDialogOpen(true);
        });
    }, [projectStatus, hasUserAcknowledged]);

    // Handle user confirmation
    const handleConfirm = useCallback(async () => {
        if (pendingOperation && pendingPromise) {
            setUserAcknowledged();
            setDialogOpen(false);

            try {
                await pendingOperation();
                pendingPromise.resolve();
            } catch (error) {
                console.error('Error executing pending operation:', error);
                pendingPromise.reject(error instanceof Error ? error : new Error('Operation failed'));
            } finally {
                setPendingOperation(null);
                setPendingPromise(null);
            }
        }
    }, [pendingOperation, pendingPromise, setUserAcknowledged]);

    // Handle user cancellation
    const handleCancel = useCallback(() => {
        setDialogOpen(false);
        if (pendingPromise) {
            pendingPromise.reject(new Error('Operation cancelled by user'));
        }
        setPendingOperation(null);
        setPendingPromise(null);
    }, [pendingPromise]);

    // Handle dialog close (including X button)
    const handleDialogClose = useCallback((open: boolean) => {
        if (!open) {
            // Dialog is being closed
            setDialogOpen(false);
            if (pendingPromise) {
                pendingPromise.reject(new Error('Operation cancelled by user'));
            }
            setPendingOperation(null);
            setPendingPromise(null);
        } else {
            setDialogOpen(true);
        }
    }, [pendingPromise]);

    // Warning dialog component
    const StatusWarningDialog = useCallback(() => {
        if (!projectStatus) return null;

        const statusDescription = getStatusDescription(projectStatus.status);
        const isAccepted = projectStatus.status === 'accepted';

        return (
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Project Status Warning
                        </DialogTitle>
                        <DialogDescription className="space-y-2">
                            <p>
                                This project has been <strong>{statusDescription}</strong>.
                            </p>
                            {isAccepted && (
                                <p className="text-amber-600 font-medium">
                                    Making changes to an accepted project may require the customer to re-accept the proposal.
                                </p>
                            )}
                            <p>
                                Are you sure you want to proceed with this change?
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} className="bg-amber-600 hover:bg-amber-700">
                            Proceed Anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }, [dialogOpen, projectStatus, getStatusDescription, handleConfirm, handleCancel, handleDialogClose]);

    return {
        guardedOperation,
        clearUserAcknowledged,
        StatusWarningDialog,
        projectStatus,
        isDialogOpen: dialogOpen,
    };
}; 