import { Pool } from "@/types/pool";
import React from "react";
import { EditSectionLink } from "./EditSectionLink";

interface PlaceholderSummaryProps {
    pool: Pool;
    customerId: string;
    title: string;
    sectionId: string;
    icon?: React.ReactNode;
    data?: any;
}

export const PlaceholderSummary: React.FC<PlaceholderSummaryProps> = ({
    title,
    data,
    icon,
    customerId,
    sectionId
}) => {
    if (!data) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <EditSectionLink section={sectionId} customerId={customerId} />
                </div>
                <div className="p-4 bg-slate-50 rounded-md text-muted-foreground text-center">
                    {icon}
                    <p>No {title.toLowerCase()} data available</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <EditSectionLink section={sectionId} customerId={customerId} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Generic data display for any provided data */}
                {Object.entries(data).map(([key, value]) => {
                    // Skip internal or technical fields
                    if (key.startsWith('_') || key.includes('id') || key === 'created_at' || key === 'updated_at') {
                        return null;
                    }

                    // Skip null or undefined values
                    if (value === null || value === undefined) {
                        return null;
                    }

                    // Format the key for display
                    const formattedKey = key
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    return (
                        <div key={key}>
                            <p className="text-sm text-muted-foreground">{formattedKey}</p>
                            <p className="font-medium">
                                {typeof value === 'boolean'
                                    ? (value ? 'Yes' : 'No')
                                    : typeof value === 'number' && !key.includes('quantity') && !key.includes('count')
                                        ? `$${value.toLocaleString()}`
                                        : String(value)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 