import { supabase } from '@/integrations/supabase/client'; // Ensure Supabase client is imported
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CostBuilderAuthContextType {
    isCostBuilderAuthenticated: boolean;
    attemptAuthentication: (password: string) => Promise<boolean>;
    logoutCostBuilder: () => void;
}

const CostBuilderAuthContext = createContext<CostBuilderAuthContextType | undefined>(undefined);

// NICK: THIS IS WHERE THE PASSWORD IS SET
const SHARED_COST_BUILDER_PASSWORD = "mfp112233!!"; // TODO: Change this password!

export const CostBuilderAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isCostBuilderAuthenticated, setIsCostBuilderAuthenticated] = useState<boolean>(() => {
        // Check session storage to persist authentication state
        return sessionStorage.getItem('costBuilderAuthenticated') === 'true';
    });

    const attemptAuthentication = async (password: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase.functions.invoke('verify-cost-builder-password', {
                body: { password: password }, // Send the plain-text password to the Edge Function
            });

            if (error) {
                console.error("Error invoking verify-cost-builder-password function:", error.message);
                // More specific error handling can be added here if needed
                // e.g., if (error.context && error.context.status === 401) { console.warn("Invalid password from edge function"); }
                return false;
            }

            if (data && data.authenticated) {
                setIsCostBuilderAuthenticated(true);
                sessionStorage.setItem('costBuilderAuthenticated', 'true');
                return true;
            } else {
                // This case handles if the function returned successfully but authenticated: false, or an unexpected response
                console.warn("Authentication failed: Password incorrect or unexpected response from edge function.", data);
                return false;
            }
        } catch (e) {
            // Catch any other exceptions during the invoke call (e.g., network issues)
            console.error("Exception during attemptAuthentication:", e);
            return false;
        }
    };

    const logoutCostBuilder = () => {
        setIsCostBuilderAuthenticated(false);
        sessionStorage.removeItem('costBuilderAuthenticated');
    };

    return (
        <CostBuilderAuthContext.Provider value={{ isCostBuilderAuthenticated, attemptAuthentication, logoutCostBuilder }}>
            {children}
        </CostBuilderAuthContext.Provider>
    );
};

export const useCostBuilderAuth = (): CostBuilderAuthContextType => {
    const context = useContext(CostBuilderAuthContext);
    if (context === undefined) {
        throw new Error('useCostBuilderAuth must be used within a CostBuilderAuthProvider');
    }
    return context;
}; 