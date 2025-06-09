import { useProjectStatusGuard } from '@/hooks/useProjectStatusGuard';
import { useCallback } from 'react';
import { usePoolSelection } from './usePoolSelection';

/**
 * Example of how to wrap an existing hook with status guard functionality.
 * This demonstrates the pattern for retrofitting existing save operations.
 */
export const usePoolSelectionWithGuard = (customerId?: string | null) => {
    // Get the original hook
    const originalHook = usePoolSelection(customerId);

    // Get the status guard functionality
    const { guardedOperation, StatusWarningDialog } = useProjectStatusGuard({
        projectId: customerId || ''
    });

    // Wrap the save function with the guard
    const guardedSavePoolSelection = useCallback(async () => {
        await guardedOperation(async () => {
            await originalHook.handleSavePoolSelection();
        });
    }, [guardedOperation, originalHook.handleSavePoolSelection]);

    // Return the original hook with the guarded save function
    return {
        ...originalHook,
        handleSavePoolSelection: guardedSavePoolSelection,
        StatusWarningDialog,
    };
}; 