import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGuardedMutation } from '@/hooks/useGuardedMutation';
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ExampleGuardedComponentProps {
    projectId: string;
}

/**
 * Example component demonstrating how to use the status guard system
 * with any pool project update operation.
 */
export const ExampleGuardedComponent: React.FC<ExampleGuardedComponentProps> = ({
    projectId
}) => {
    const [poolColor, setPoolColor] = useState('');

    // Example 1: Using useGuardedMutation for new save operations
    const {
        mutate: savePoolColor,
        isPending: isSaving,
        StatusWarningDialog
    } = useGuardedMutation({
        projectId,
        mutationFn: async (color: string) => {
            const { error } = await supabase
                .from('pool_projects')
                .update({ pool_color: color })
                .eq('id', projectId);

            if (error) throw error;
            return { success: true };
        },
        mutationOptions: {
            onSuccess: () => {
                toast.success('Pool color saved successfully');
            },
            onError: (error) => {
                toast.error('Failed to save pool color');
                console.error('Save error:', error);
            },
        },
    });

    const handleSave = () => {
        if (!poolColor.trim()) {
            toast.error('Please enter a pool color');
            return;
        }
        savePoolColor(poolColor);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Pool Color Selection (Guarded)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="pool-color">Pool Color</Label>
                        <Input
                            id="pool-color"
                            value={poolColor}
                            onChange={(e) => setPoolColor(e.target.value)}
                            placeholder="Enter pool color"
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Pool Color'}
                    </Button>
                </CardContent>
            </Card>

            {/* This dialog will automatically show when needed */}
            <StatusWarningDialog />
        </>
    );
}; 