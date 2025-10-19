'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegisterAlertsProps {
    error?: string;
    success?: string;
}

export function RegisterAlerts({ error, success }: RegisterAlertsProps) {
    return (
        <>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border-green-500 bg-green-50">
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}
        </>
    );
}
