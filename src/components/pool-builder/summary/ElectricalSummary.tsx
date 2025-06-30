import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, Zap } from "lucide-react";
import React, { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface ElectricalSummaryProps {
    pool: Pool;
    customerId: string;
    electrical?: any;
}

export const ElectricalSummary: React.FC<ElectricalSummaryProps> = ({
    pool,
    customerId,
    electrical
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

    // Calculate the electrical cost and RRP
    const electricalCost = electrical?.total_cost || 0;
    const electricalRRP = calculateRRP(electricalCost, marginData || 0);

    if (!electrical) {
        return (
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Electrical</h3>
                        <EditSectionLink section="electrical" customerId={customerId} />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-md text-muted-foreground text-center">
                        <Zap className="h-6 w-6 mx-auto mb-2" />
                        <p>No electrical data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate individual electrical costs and margins
    const standardPowerCost = electrical.standard_power_cost || 0;
    const fenceEarthingCost = electrical.fence_earthing_cost || 0;
    const heatPumpCircuitCost = electrical.heat_pump_circuit_cost || 0;
    
    // Calculate margins for individual items (using pool margin percentage)
    const standardPowerMargin = standardPowerCost * (marginData || 0) / 100;
    const fenceEarthingMargin = fenceEarthingCost * (marginData || 0) / 100;
    const heatPumpCircuitMargin = heatPumpCircuitCost * (marginData || 0) / 100;
    const totalElectricalMargin = electricalCost * (marginData || 0) / 100;

    return (
        <Card className="mb-6 shadow-none">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Electrical</h3>
                    <EditSectionLink section="electrical" customerId={customerId} />
                </div>
                <div className="space-y-4">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 font-medium">Item</th>
                                <th className="text-center py-2 font-medium">Included</th>
                                {showMargins && <th className="text-right py-2 font-medium">Margin</th>}
                                <th className="text-right py-2 font-medium">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-left">Standard Power</td>
                                <td className="py-3 px-4 text-center">
                                    {electrical.standard_power ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                    ) : (
                                        <span className="text-muted-foreground">No</span>
                                    )}
                                </td>
                                {showMargins && (
                                    <td className="py-3 px-4 text-right text-green-600">
                                        {electrical.standard_power ? formatCurrency(standardPowerMargin) : '-'}
                                    </td>
                                )}
                                <td className="py-3 px-4 text-right">
                                    {electrical.standard_power ? formatCurrency(standardPowerCost) : '-'}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-left">Fence Earthing</td>
                                <td className="py-3 px-4 text-center">
                                    {electrical.fence_earthing ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                    ) : (
                                        <span className="text-muted-foreground">No</span>
                                    )}
                                </td>
                                {showMargins && (
                                    <td className="py-3 px-4 text-right text-green-600">
                                        {electrical.fence_earthing ? formatCurrency(fenceEarthingMargin) : '-'}
                                    </td>
                                )}
                                <td className="py-3 px-4 text-right">
                                    {electrical.fence_earthing ? formatCurrency(fenceEarthingCost) : '-'}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-left">Heat Pump Circuit</td>
                                <td className="py-3 px-4 text-center">
                                    {electrical.heat_pump_circuit ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                    ) : (
                                        <span className="text-muted-foreground">No</span>
                                    )}
                                </td>
                                {showMargins && (
                                    <td className="py-3 px-4 text-right text-green-600">
                                        {electrical.heat_pump_circuit ? formatCurrency(heatPumpCircuitMargin) : '-'}
                                    </td>
                                )}
                                <td className="py-3 px-4 text-right">
                                    {electrical.heat_pump_circuit ? formatCurrency(heatPumpCircuitCost) : '-'}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 bg-gray-50 font-bold">
                                <td className="pt-3 pb-3 px-4 text-left">Total Electrical:</td>
                                <td className="pt-3 pb-3 px-4 text-center">-</td>
                                {showMargins && (
                                    <td className="pt-3 pb-3 px-4 text-right font-semibold text-green-600">
                                        {formatCurrency(totalElectricalMargin)}
                                    </td>
                                )}
                                <td className="pt-3 pb-3 px-4 text-right text-gray-900 font-semibold">
                                    {showMargins ? formatCurrency(electricalCost) : formatCurrency(electricalRRP)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}; 