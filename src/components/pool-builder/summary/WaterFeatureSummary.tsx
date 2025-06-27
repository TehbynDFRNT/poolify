import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
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
    // Get margin data
    const { marginData } = useMargin(pool.id);

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

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

    // Extract total cost from water features data, with fallback options
    const getWaterFeaturesCost = (): number => {
        // First check if there's a direct total_cost property
        if (hasValue(waterFeatures, 'total_cost')) {
            return waterFeatures.total_cost;
        }

        // If no direct total_cost, try to calculate from components if available
        let calculatedCost = 0;

        // Check for base cost from size
        if (hasValue(waterFeatures, 'water_feature_size') && waterFeatures.water_feature_size) {
            // This is a simplified calculation - adjust based on your actual pricing logic
            switch (waterFeatures.water_feature_size) {
                case 'small':
                    calculatedCost += 3200;
                    break;
                case 'medium':
                    calculatedCost += 3500;
                    break;
                case 'large':
                    calculatedCost += 4000;
                    break;
                case 'xlarge':
                    calculatedCost += 4500;
                    break;
                default:
                    calculatedCost += 3000; // Default fallback
            }
        }

        // Add cost for back cladding if needed
        if (hasValue(waterFeatures, 'back_cladding_needed') && waterFeatures.back_cladding_needed) {
            calculatedCost += 500; // Example cost for back cladding
        }

        // Add cost for LED blade if specified
        if (hasValue(waterFeatures, 'led_blade') && waterFeatures.led_blade &&
            waterFeatures.led_blade.toLowerCase() !== 'none') {
            calculatedCost += 800; // Example cost for LED blade
        }

        return calculatedCost;
    };

    // Get the water features cost
    const waterFeaturesCost = getWaterFeaturesCost();
    // Calculate the RRP for water features
    const waterFeaturesRRP = calculateRRP(waterFeaturesCost, marginData || 0);

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

    // Calculate margin amount
    const waterFeaturesMargin = waterFeaturesRRP - waterFeaturesCost;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Water Features</h3>
                <EditSectionLink section="water-feature" customerId={customerId} />
            </div>
            
            {/* Feature Details Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 font-medium">Feature</th>
                            <th className="text-left py-2 font-medium">Selection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hasValue(waterFeatures, 'water_feature_size') && (
                            <tr className="border-b">
                                <td className="py-2">Water Feature Size</td>
                                <td className="py-2">{getWaterFeatureSizeName(waterFeatures.water_feature_size)}</td>
                            </tr>
                        )}
                        {hasValue(waterFeatures, 'front_finish') && (
                            <tr className="border-b">
                                <td className="py-2">Front Finish</td>
                                <td className="py-2">{formatValue(waterFeatures.front_finish)}</td>
                            </tr>
                        )}
                        {hasValue(waterFeatures, 'top_finish') && (
                            <tr className="border-b">
                                <td className="py-2">Top Finish</td>
                                <td className="py-2">{formatValue(waterFeatures.top_finish)}</td>
                            </tr>
                        )}
                        {hasValue(waterFeatures, 'sides_finish') && (
                            <tr className="border-b">
                                <td className="py-2">Sides Finish</td>
                                <td className="py-2">{formatValue(waterFeatures.sides_finish)}</td>
                            </tr>
                        )}
                        {hasValue(waterFeatures, 'back_cladding_needed') && (
                            <tr className="border-b">
                                <td className="py-2">Back Cladding</td>
                                <td className="py-2 flex items-center">
                                    {waterFeatures.back_cladding_needed ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Yes
                                        </>
                                    ) : (
                                        'No'
                                    )}
                                </td>
                            </tr>
                        )}
                        {hasValue(waterFeatures, 'led_blade') && (
                            <tr className="border-b">
                                <td className="py-2">LED Blade</td>
                                <td className="py-2">{formatValue(waterFeatures.led_blade)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Cost Summary Table */}
            <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 font-medium">Cost Breakdown</th>
                            <th className="text-right py-2 font-medium">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showMargins && (
                            <>
                                <tr className="border-b">
                                    <td className="py-2">Base Cost</td>
                                    <td className="text-right py-2">{formatCurrency(waterFeaturesCost)}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2">Margin</td>
                                    <td className="text-right py-2 text-green-600">{formatCurrency(waterFeaturesMargin)}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2">
                            <td className="pt-3 font-semibold">Total Water Features:</td>
                            <td className="text-right pt-3 font-semibold text-primary">{formatCurrency(waterFeaturesRRP)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}; 