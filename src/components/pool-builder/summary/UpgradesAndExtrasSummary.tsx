import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, Package, Sparkles, Thermometer } from "lucide-react";
import React, { useContext } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface UpgradesAndExtrasSummaryProps {
    pool: Pool;
    customerId: string;
    upgradesExtras?: {
        heating_options?: {
            include_heat_pump: boolean;
            include_blanket_roller: boolean;
            heat_pump_id?: string | null;
            blanket_roller_id?: string | null;
            heat_pump_cost: number;
            blanket_roller_cost: number;
            heating_total_cost: number;
            heating_total_margin?: number;
            heat_pump_installation_cost?: number;
            blanket_roller_installation_cost?: number;
        };
        pool_cleaner?: {
            include_cleaner: boolean;
            pool_cleaner_id?: string | null;
            pool_cleaners?: any;
            cost?: number;
        };
    };
}

export const UpgradesAndExtrasSummary: React.FC<UpgradesAndExtrasSummaryProps> = ({
    pool,
    customerId,
    upgradesExtras
}) => {
    // Get margin visibility from context
    const showMargins = useContext(MarginVisibilityContext);
    const { marginData } = useMargin(pool.id);

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

    // Helper function to safely check if properties exist
    const hasValue = (obj: any, path: string): boolean => {
        if (!obj) return false;
        const parts = path.split('.');
        let current = obj;

        for (const part of parts) {
            if (current === null || current === undefined || typeof current !== 'object' || !(part in current)) {
                return false;
            }
            current = current[part];
        }

        return current !== null && current !== undefined;
    };

    // Check if any heating options are included
    const hasHeatingOptions = hasValue(upgradesExtras, 'heating_options') &&
        (upgradesExtras?.heating_options?.include_heat_pump ||
            upgradesExtras?.heating_options?.include_blanket_roller);

    // Check if a pool cleaner is included
    const hasPoolCleaner = hasValue(upgradesExtras, 'pool_cleaner') &&
        upgradesExtras?.pool_cleaner?.include_cleaner;

    // If no data is available, show placeholder
    const hasUpgradesExtras = hasHeatingOptions || hasPoolCleaner;

    if (!hasUpgradesExtras) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Upgrades & Extras</h3>
                    <EditSectionLink section="upgrades-extras" customerId={customerId} />
                </div>
                <div className="p-4 bg-slate-50 rounded-md text-muted-foreground text-center">
                    <Package className="h-6 w-6 mx-auto mb-2" />
                    <p>No upgrades or extras selected</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upgrades & Extras</h3>
                <EditSectionLink section="upgrades-extras" customerId={customerId} />
            </div>

            <div className="space-y-6">
                {/* Heating Options Section */}
                {hasHeatingOptions && (
                    <div>
                        <h4 className="text-base font-medium flex items-center mb-2">
                            <Thermometer className="h-4 w-4 mr-1" /> Heating Options
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {upgradesExtras?.heating_options?.include_heat_pump && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Heat Pump</p>
                                    <p className="font-medium flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Included
                                    </p>
                                </div>
                            )}

                            {upgradesExtras?.heating_options?.include_blanket_roller && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Blanket & Roller</p>
                                    <p className="font-medium flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Included
                                    </p>
                                </div>
                            )}

                            {upgradesExtras?.heating_options?.include_heat_pump && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Heat Pump Cost</p>
                                    {showMargins ? (
                                        <p className="font-medium">
                                            {formatCurrency(upgradesExtras.heating_options.heat_pump_cost)}
                                            <span className="text-primary"> ({formatCurrency(calculateRRP(upgradesExtras.heating_options.heat_pump_cost, marginData || 0))})</span>
                                        </p>
                                    ) : (
                                        <p className="font-medium text-primary">
                                            {formatCurrency(calculateRRP(upgradesExtras.heating_options.heat_pump_cost, marginData || 0))}
                                        </p>
                                    )}
                                </div>
                            )}

                            {upgradesExtras?.heating_options?.include_heat_pump && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Heat Pump Installation</p>
                                    <p className="font-medium text-primary">
                                        {formatCurrency(upgradesExtras.heating_options.heat_pump_installation_cost || 605.00)}
                                    </p>
                                </div>
                            )}

                            {upgradesExtras?.heating_options?.include_blanket_roller && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Blanket & Roller Cost</p>
                                    {showMargins ? (
                                        <p className="font-medium">
                                            {formatCurrency(upgradesExtras.heating_options.blanket_roller_cost)}
                                            <span className="text-primary"> ({formatCurrency(calculateRRP(upgradesExtras.heating_options.blanket_roller_cost, marginData || 0))})</span>
                                        </p>
                                    ) : (
                                        <p className="font-medium text-primary">
                                            {formatCurrency(calculateRRP(upgradesExtras.heating_options.blanket_roller_cost, marginData || 0))}
                                        </p>
                                    )}
                                </div>
                            )}

                            {upgradesExtras?.heating_options?.include_blanket_roller && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Blanket & Roller Installation</p>
                                    <p className="font-medium text-primary">
                                        {formatCurrency(upgradesExtras.heating_options.blanket_roller_installation_cost || 155.00)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">Total Heating Cost</p>
                                {showMargins ? (
                                    <p className="font-medium">
                                        {formatCurrency(upgradesExtras?.heating_options?.heating_total_cost || 0)}
                                        <span className="text-primary"> ({formatCurrency(calculateRRP(upgradesExtras?.heating_options?.heating_total_cost || 0, marginData || 0))})</span>
                                    </p>
                                ) : (
                                    <p className="font-medium text-primary">
                                        {formatCurrency(calculateRRP(upgradesExtras?.heating_options?.heating_total_cost || 0, marginData || 0))}
                                    </p>
                                )}
                            </div>

                            {showMargins && upgradesExtras?.heating_options?.heating_total_margin !== undefined && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Heating Margin</p>
                                    <p className="font-medium">
                                        {formatCurrency(upgradesExtras.heating_options.heating_total_margin)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pool Cleaner Section */}
                {hasPoolCleaner && (
                    <div>
                        <h4 className="text-base font-medium flex items-center mb-2">
                            <Sparkles className="h-4 w-4 mr-1" /> Pool Cleaner
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Pool Cleaner</p>
                                <p className="font-medium flex items-center">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Included
                                </p>
                            </div>

                            {upgradesExtras?.pool_cleaner?.pool_cleaners && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Model</p>
                                    <p className="font-medium">
                                        {upgradesExtras.pool_cleaner.pool_cleaners.name || 'Standard Model'}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">Pool Cleaner Cost</p>
                                {showMargins ? (
                                    <p className="font-medium">
                                        {formatCurrency(
                                            upgradesExtras?.pool_cleaner?.cost ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.rrp ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.price ||
                                            4125.00
                                        )}
                                        <span className="text-primary"> ({formatCurrency(calculateRRP(
                                            upgradesExtras?.pool_cleaner?.cost ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.rrp ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.price ||
                                            4125.00,
                                            marginData || 0
                                        ))})</span>
                                    </p>
                                ) : (
                                    <p className="font-medium text-primary">
                                        {formatCurrency(calculateRRP(
                                            upgradesExtras?.pool_cleaner?.cost ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.rrp ||
                                            upgradesExtras?.pool_cleaner?.pool_cleaners?.price ||
                                            4125.00,
                                            marginData || 0
                                        ))}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 