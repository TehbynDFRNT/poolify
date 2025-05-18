/**
 * Utility function to validate UUID format
 * @param id - string to validate as UUID
 * @returns boolean indicating if the string is a valid UUID
 */
export const validateUuid = (id: string): boolean => {
    return !!id && typeof id === 'string' && !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
}; 