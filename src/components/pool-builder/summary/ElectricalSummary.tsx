import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, Zap } from "lucide-react";
import React, { useContext } from "react";
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

    if (!electrical) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Electrical</h3>
                    <EditSectionLink section="electrical" customerId={customerId} />
                </div>
                <div className="p-4 bg-slate-50 rounded-md text-muted-foreground text-center">
                    <Zap className="h-6 w-6 mx-auto mb-2" />
                    <p>No electrical data available</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Electrical</h3>
                <EditSectionLink section="electrical" customerId={customerId} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Standard Power</p>
                    <p className="font-medium flex items-center">
                        {electrical.standard_power ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Yes
                            </>
                        ) : (
                            'No'
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Fence Earthing</p>
                    <p className="font-medium flex items-center">
                        {electrical.fence_earthing ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Yes
                            </>
                        ) : (
                            'No'
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Heat Pump Circuit</p>
                    <p className="font-medium flex items-center">
                        {electrical.heat_pump_circuit ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Yes
                            </>
                        ) : (
                            'No'
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Total Electrical Cost</p>
                    <p className="font-medium">{formatCurrency(electrical.total_cost || 0)}</p>
                </div>
            </div>
        </div>
    );
}; 