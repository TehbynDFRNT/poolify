import { Pool } from "@/types/pool";
import { PoolWaterFeature } from "@/types/water-feature";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, Droplets } from "lucide-react";
import React, { useContext } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface WaterFeatureSummaryProps {
    pool: Pool;
    customerId: string;
    waterFeatures?: PoolWaterFeature | any;
}

export const WaterFeatureSummary: React.FC<WaterFeatureSummaryProps> = ({
    pool,
    customerId,
    waterFeatures
}) => {
    // Get margin visibility from context
    const showMargins = useContext(MarginVisibilityContext);

    // Debug waterFeatures data
    if (process.env.NODE_ENV !== 'production') {
        console.log("Water Features data in summary:", waterFeatures);
    }

    // Helper function to safely check if properties exist and have values
    const hasValue = (obj: any, key: string): boolean => {
        return obj && typeof obj === 'object' &&
            key in obj &&
            obj[key] !== null &&
            obj[key] !== undefined;
    };

    // Check if waterFeatures has meaningful data
    const isEmpty = !waterFeatures ||
        typeof waterFeatures !== 'object' ||
        Object.keys(waterFeatures).length === 0 ||
        !hasValue(waterFeatures, 'water_feature_size');

    if (isEmpty) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Water Features</h3>
                    <EditSectionLink section="water-feature" customerId={customerId} />
                </div>
                <div className="p-4 bg-slate-50 rounded-md text-muted-foreground text-center">
                    <Droplets className="h-6 w-6 mx-auto mb-2" />
                    <p>No water features data available</p>
                </div>
            </div>
        );
    }

    // Get the size name from the water_feature_size value
    const getWaterFeatureSizeName = (sizeId: string) => {
        if (!sizeId) return "Not selected";

        // Common size formats, adjust if needed based on your data
        switch (sizeId) {
            case "small":
                return "Small (600mm)";
            case "medium":
                return "Medium (900mm)";
            case "large":
                return "Large (1200mm)";
            case "xlarge":
                return "Extra Large (1500mm)";
            default:
                return sizeId.charAt(0).toUpperCase() + sizeId.slice(1);
        }
    };

    // Helper function to format text values
    const formatValue = (value: any, defaultValue: string = "None"): string => {
        if (value === null || value === undefined) return defaultValue;
        if (typeof value === 'string') {
            return value.toLowerCase() === "none" ? "None" :
                value.charAt(0).toUpperCase() + value.slice(1);
        }
        return String(value);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Water Features</h3>
                <EditSectionLink section="water-feature" customerId={customerId} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hasValue(waterFeatures, 'water_feature_size') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Water Feature Size</p>
                        <p className="font-medium">{getWaterFeatureSizeName(waterFeatures.water_feature_size)}</p>
                    </div>
                )}

                {hasValue(waterFeatures, 'back_cladding_needed') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Back Cladding</p>
                        <p className="font-medium flex items-center">
                            {waterFeatures.back_cladding_needed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Yes
                                </>
                            ) : (
                                'No'
                            )}
                        </p>
                    </div>
                )}

                {hasValue(waterFeatures, 'led_blade') && (
                    <div>
                        <p className="text-sm text-muted-foreground">LED Blade</p>
                        <p className="font-medium">{formatValue(waterFeatures.led_blade)}</p>
                    </div>
                )}

                {hasValue(waterFeatures, 'front_finish') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Front Finish</p>
                        <p className="font-medium">{formatValue(waterFeatures.front_finish)}</p>
                    </div>
                )}

                {hasValue(waterFeatures, 'top_finish') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Top Finish</p>
                        <p className="font-medium">{formatValue(waterFeatures.top_finish)}</p>
                    </div>
                )}

                {hasValue(waterFeatures, 'sides_finish') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Sides Finish</p>
                        <p className="font-medium">{formatValue(waterFeatures.sides_finish)}</p>
                    </div>
                )}

                {hasValue(waterFeatures, 'total_cost') && (
                    <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="font-medium">{formatCurrency(waterFeatures.total_cost)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 