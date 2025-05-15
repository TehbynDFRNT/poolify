import { useCostBuilderAuth } from '@/contexts/CostBuilderAuthContext';
import React from 'react';
import { PasswordEntryForm } from './PasswordEntryForm';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isCostBuilderAuthenticated } = useCostBuilderAuth();

    if (!isCostBuilderAuthenticated) {
        return <PasswordEntryForm />;
    }

    return children;
}; 