import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useProjectStatusGuard } from './useProjectStatusGuard';

interface UseGuardedMutationProps<TData, TError, TVariables, TContext> {
    projectId: string;
    mutationFn: (variables: TVariables) => Promise<TData>;
    mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;
}

/**
 * A higher-order hook that wraps useMutation with project status guard functionality.
 * This ensures that any mutation that could modify project data shows a warning
 * if the project is not in 'created' or 'sent' status.
 */
export function useGuardedMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>({
    projectId,
    mutationFn,
    mutationOptions,
}: UseGuardedMutationProps<TData, TError, TVariables, TContext>): UseMutationResult<TData, TError, TVariables, TContext> & {
    StatusWarningDialog: () => JSX.Element | null;
} {
    const { guardedOperation, StatusWarningDialog } = useProjectStatusGuard({ projectId });

    // Wrap the original mutation function with the guard
    const guardedMutationFn = async (variables: TVariables): Promise<TData> => {
        let result: TData;

        // Execute the mutation within the guarded operation
        await guardedOperation(async () => {
            result = await mutationFn(variables);
        });

        // Return the result (this will only be reached if the guard allowed the operation)
        return result!;
    };

    const mutation = useMutation({
        ...mutationOptions,
        mutationFn: guardedMutationFn,
    });

    return {
        ...mutation,
        StatusWarningDialog,
    };
}

/**
 * Utility function to wrap an existing mutation hook with status guard functionality.
 * This is useful for retrofitting existing hooks without rewriting them.
 */
export function withStatusGuard<THookResult extends UseMutationResult<any, any, any, any>>(
    useHook: (projectId: string, ...args: any[]) => THookResult,
    projectId: string,
    ...hookArgs: any[]
) {
    const originalHook = useHook(projectId, ...hookArgs);
    const { guardedOperation, StatusWarningDialog } = useProjectStatusGuard({ projectId });

    // Override the mutate and mutateAsync functions
    const originalMutate = originalHook.mutate;
    const originalMutateAsync = originalHook.mutateAsync;

    const guardedMutate = (variables: any, options?: any) => {
        guardedOperation(async () => {
            originalMutate(variables, options);
        });
    };

    const guardedMutateAsync = async (variables: any, options?: any) => {
        return new Promise((resolve, reject) => {
            guardedOperation(async () => {
                try {
                    const result = await originalMutateAsync(variables, options);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    return {
        ...originalHook,
        mutate: guardedMutate,
        mutateAsync: guardedMutateAsync,
        StatusWarningDialog,
    };
} 