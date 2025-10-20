import React from 'react'

export const EmptyState = ({
    icon,
    message,
    action,
}: {
    icon: React.ReactNode;
    message: string;
    action?: React.ReactNode;
}) => {
    return (
        <div className="text-center py-8 text-muted-foreground">
            {icon}
            <p>{message}</p>
            {action}
        </div>
    );
}
