import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import React, { useContext } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

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
    sectionId,
    pool
}) => {
    // Get margin visibility from context
    const showMargins = useContext(MarginVisibilityContext);
    const { marginData } = useMargin(pool?.id);

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

    // Format value for display based on type and key
    const formatValue = (key: string, value: any) => {
        // Handle boolean values
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        // Handle numbers that are costs
        if (typeof value === 'number' && !key.includes('quantity') && !key.includes('count')) {
            if (key.includes('total') || key.includes('cost') || key.includes('price')) {
                if (showMargins) {
                    const rrp = calculateRRP(value, marginData || 0);
                    return (
                        <span>
                            {formatCurrency(value)} <span className="text-primary">({formatCurrency(rrp)})</span>
                        </span>
                    );
                } else {
                    return formatCurrency(calculateRRP(value, marginData || 0));
                }
            }
            return formatCurrency(value);
        }

        // Handle all other cases
        return String(value);
    };

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

                    // Skip margin-related fields if showMargins is false
                    if (!showMargins && (key.includes('margin') || key.includes('rrp'))) {
                        return null;
                    }

                    // Format the key for display
                    const formattedKey = key
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    // Determine if this is a cost field that should be highlighted when margins are shown
                    const isCostField = key.includes('total') || key.includes('cost') || key.includes('price');
                    const className = showMargins && isCostField ? "font-medium" : (
                        !showMargins && isCostField ? "font-medium text-primary" : "font-medium"
                    );

                    return (
                        <div key={key}>
                            <p className="text-sm text-muted-foreground">{formattedKey}</p>
                            <p className={className}>
                                {formatValue(key, value)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 