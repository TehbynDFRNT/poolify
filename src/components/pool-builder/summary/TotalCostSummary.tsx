import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Pool } from "@/types/pool";
import { ExtendedPoolEquipmentSelection } from '@/utils/poolProjectHelpers';
import React, { useContext, useEffect, useState } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface TotalCostSummaryProps {
    pool: Pool;
    customerId: string;
    projectData: any;
}

export const TotalCostSummary: React.FC<TotalCostSummaryProps> = ({
    pool,
    customerId,
    projectData
}) => {
    // Use the margin visibility context
    const showMargins = useContext(MarginVisibilityContext);

    // Set up state for calculated values
    const [basePoolCost, setBasePoolCost] = useState(0);
    const [siteRequirementsCost, setSiteRequirementsCost] = useState(0);
    const [concretePavingCost, setConcretePavingCost] = useState(0);
    const [retainingWallsCost, setRetainingWallsCost] = useState(0);
    const [waterFeaturesCost, setWaterFeaturesCost] = useState(0);
    const [fencingCost, setFencingCost] = useState(0);
    const [electricalCost, setElectricalCost] = useState(0);
    const [upgradesExtrasCost, setUpgradesExtrasCost] = useState(0);
    const [heatingCost, setHeatingCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [marginPercentage, setMarginPercentage] = useState(0.3); // Default margin percentage

    // This function calculates the site requirements cost
    const calculateSiteRequirementsCost = async () => {
        try {
            // Get equipment selections
            const equipmentSelections = projectData.pool_equipment_selections?.[0] as ExtendedPoolEquipmentSelection | undefined;

            // Default costs to 0
            let craneCost = 0;
            let trafficControlCost = 0;
            let bobcatCost = 0;

            // Extract equipment costs if available
            if (equipmentSelections) {
                // Get crane cost if available
                if (equipmentSelections.crane?.price) {
                    craneCost = equipmentSelections.crane.price;
                }

                // Get traffic control cost if available
                if (equipmentSelections.traffic_control?.price) {
                    trafficControlCost = equipmentSelections.traffic_control.price;
                }

                // Get bobcat cost if available
                if (equipmentSelections.bobcat?.price) {
                    bobcatCost = equipmentSelections.bobcat.price;
                }
            }

            // Get site requirements data
            const siteRequirementsData = projectData.site_requirements_data || [];

            // Calculate custom site requirements cost
            let customRequirementsCost = 0;
            if (Array.isArray(siteRequirementsData)) {
                customRequirementsCost = siteRequirementsData.reduce((sum, item) => sum + (item.price || 0), 0);
            }

            // Calculate total site requirements cost
            const total = craneCost + trafficControlCost + bobcatCost + customRequirementsCost;

            return total;
        } catch (error) {
            console.error("Error calculating site requirements cost:", error);
            return 0;
        }
    };

    // Calculate totals based on project data
    const calculateTotals = () => {
        // Base pool cost
        const baseCost = pool.buy_price_inc_gst || 0;
        setBasePoolCost(baseCost);

        // Site requirements cost from function
        calculateSiteRequirementsCost().then(cost => {
            setSiteRequirementsCost(cost);
        });

        // Concrete and paving cost
        const concreteCost = projectData.concrete_paving_total || 0;
        setConcretePavingCost(concreteCost);

        // Retaining walls cost
        const retainingCost = projectData.retaining_walls_total || 0;
        setRetainingWallsCost(retainingCost);

        // Water features cost
        const waterCost = projectData.water_features_total || 0;
        setWaterFeaturesCost(waterCost);

        // Fencing cost
        const fenceCost = projectData.fencing_total || 0;
        setFencingCost(fenceCost);

        // Electrical cost
        const elecCost = projectData.electrical_total || 0;
        setElectricalCost(elecCost);

        // Upgrades and extras cost
        const upgradesCost = projectData.upgrades_extras_total || 0;
        setUpgradesExtrasCost(upgradesCost);

        // Heating cost
        const heatCost = projectData.heating_total_cost || 0;
        setHeatingCost(heatCost);

        // Calculate the sum of all costs for the subtotal
        const calculatedTotal =
            baseCost +
            (projectData.site_requirements_total || 0) +
            concreteCost +
            retainingCost +
            waterCost +
            fenceCost +
            elecCost +
            upgradesCost +
            heatCost;

        setTotalCost(calculatedTotal);

        // Set the margin percentage if available
        if (projectData.pool_margin_pct) {
            setMarginPercentage(projectData.pool_margin_pct);
        }
    };

    // Calculate totals when data changes
    useEffect(() => {
        calculateTotals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pool, projectData]);

    // Format currency for display
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD'
        }).format(value);
    };

    // Calculate RRP with margin
    const calculateRRP = (cost: number, marginPercentage: number) => {
        const marginMultiplier = 1 + marginPercentage;
        return cost * marginMultiplier;
    };

    // Calculate total RRP
    const totalRRP = calculateRRP(totalCost, marginPercentage);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Total Costs Summary</h3>
                <EditSectionLink section="formula-reference" customerId={customerId} />
            </div>

            <div className="space-y-4">
                <Table>
                    <TableBody>
                        {/* Base Pool Cost */}
                        <TableRow>
                            <TableCell className="font-medium">Base Pool</TableCell>
                            <TableCell className="text-right">{formatCurrency(basePoolCost)}</TableCell>
                            {showMargins && (
                                <TableCell className="text-right">{formatCurrency(calculateRRP(basePoolCost, marginPercentage))}</TableCell>
                            )}
                        </TableRow>

                        {/* Site Requirements */}
                        {siteRequirementsCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Site Requirements</TableCell>
                                <TableCell className="text-right">{formatCurrency(siteRequirementsCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(siteRequirementsCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Concrete and Paving */}
                        {concretePavingCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Concrete & Paving</TableCell>
                                <TableCell className="text-right">{formatCurrency(concretePavingCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(concretePavingCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Retaining Walls */}
                        {retainingWallsCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Retaining Walls</TableCell>
                                <TableCell className="text-right">{formatCurrency(retainingWallsCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(retainingWallsCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Water Features */}
                        {waterFeaturesCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Water Features</TableCell>
                                <TableCell className="text-right">{formatCurrency(waterFeaturesCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(waterFeaturesCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Fencing */}
                        {fencingCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Fencing</TableCell>
                                <TableCell className="text-right">{formatCurrency(fencingCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(fencingCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Electrical */}
                        {electricalCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Electrical</TableCell>
                                <TableCell className="text-right">{formatCurrency(electricalCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(electricalCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Upgrades & Extras */}
                        {upgradesExtrasCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Upgrades & Extras</TableCell>
                                <TableCell className="text-right">{formatCurrency(upgradesExtrasCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(upgradesExtrasCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Heating */}
                        {heatingCost > 0 && (
                            <TableRow>
                                <TableCell className="font-medium">Heating Options</TableCell>
                                <TableCell className="text-right">{formatCurrency(heatingCost)}</TableCell>
                                {showMargins && (
                                    <TableCell className="text-right">{formatCurrency(calculateRRP(heatingCost, marginPercentage))}</TableCell>
                                )}
                            </TableRow>
                        )}

                        {/* Total Cost */}
                        <TableRow className="border-t-2">
                            <TableCell className="font-bold text-lg">Total</TableCell>
                            <TableCell className="text-right font-bold text-lg">{formatCurrency(totalCost)}</TableCell>
                            {showMargins && (
                                <TableCell className="text-right font-bold text-lg">{formatCurrency(totalRRP)}</TableCell>
                            )}
                        </TableRow>
                    </TableBody>
                </Table>

                {showMargins && (
                    <div className="text-sm text-muted-foreground text-right">
                        Margin: {(marginPercentage * 100).toFixed(0)}%
                    </div>
                )}
            </div>
        </div>
    );
}; 