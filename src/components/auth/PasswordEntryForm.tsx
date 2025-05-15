import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCostBuilderAuth } from '@/contexts/CostBuilderAuthContext';
import React, { useState } from 'react';

export const PasswordEntryForm: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { attemptAuthentication } = useCostBuilderAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await attemptAuthentication(password);
        if (!success) {
            setError('Invalid password. Please try again.');
        }
        // On successful authentication, the ProtectedRoute component will render the children
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-4 md:p-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Enter Password</CardTitle>
                    <CardDescription className="text-center">
                        Please enter the password to access the Cost Builder.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full"
                        />
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                            Access Cost Builder
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}; 