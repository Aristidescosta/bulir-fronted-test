import React from 'react'

interface TimelineItemProps {
    label: string;
    date: string;
    active: boolean;
    color?: 'blue' | 'green' | 'red' | 'gray';
}

export const TimelineItem = ({ label, date, active, color = 'blue' }: TimelineItemProps) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        gray: 'bg-gray-300',
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div
                    className={`h-3 w-3 rounded-full ${active ? colorClasses[color] : colorClasses.gray
                        }`}
                />
                <div className="w-0.5 h-full bg-gray-200 mt-1" />
            </div>
            <div className="pb-4">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
            </div>
        </div>
    );
}