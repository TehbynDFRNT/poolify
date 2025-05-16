import { supabase } from "@/integrations/supabase/client";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { MapPin } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface SiteRequirementsSummaryProps {
    pool: Pool;
    customerId: string;
    siteRequirements?: any;
}

export const SiteRequirementsSummary: React.FC<SiteRequirementsSummaryProps> = ({
    pool,
    customerId,
    siteRequirements
}) => {
    // Get margin visibility from context
    const showMargins = useContext(MarginVisibilityContext);
    const { marginData } = useMargin(pool.id);

    const [formattedData, setFormattedData] = useState(siteRequirements);
    const [customRequirements, setCustomRequirements] = useState<any[]>([]);
    const [craneCost, setCraneCost] = useState<number>(0);
    const [trafficControlCost, setTrafficControlCost] = useState<number>(0);
    const [bobcatCost, setBobcatCost] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch costs based on IDs when the component loads
    useEffect(() => {
        const fetchCosts = async () => {
            if (!siteRequirements) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                // Fetch crane cost if ID exists
                if (siteRequirements.crane_id) {
                    const { data: craneData, error: craneError } = await supabase
                        .from('crane_costs')
                        .select('price')
                        .eq('id', siteRequirements.crane_id)
                        .single();

                    if (craneError) {
                        console.error("Error fetching crane cost:", craneError);
                    } else if (craneData) {
                        setCraneCost(craneData.price);
                    }
                }

                // Fetch traffic control cost if ID exists
                if (siteRequirements.traffic_control_id && siteRequirements.traffic_control_id !== 'none') {
                    const { data: trafficData, error: trafficError } = await supabase
                        .from('traffic_control_costs')
                        .select('price')
                        .eq('id', siteRequirements.traffic_control_id)
                        .single();

                    if (trafficError) {
                        console.error("Error fetching traffic control cost:", trafficError);
                    } else if (trafficData) {
                        setTrafficControlCost(trafficData.price);
                    }
                }

                // Fetch bobcat cost if ID exists
                if (siteRequirements.bobcat_id && siteRequirements.bobcat_id !== 'none') {
                    const { data: bobcatData, error: bobcatError } = await supabase
                        .from('bobcat_costs')
                        .select('price')
                        .eq('id', siteRequirements.bobcat_id)
                        .single();

                    if (bobcatError) {
                        console.error("Error fetching bobcat cost:", bobcatError);
                    } else if (bobcatData) {
                        setBobcatCost(bobcatData.price);
                    }
                }
            } catch (error) {
                console.error("Error fetching costs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCosts();
    }, [siteRequirements]);

    useEffect(() => {
        if (!siteRequirements) return;

        // Process the data to handle complex objects
        const processData = () => {
            const updatedData = { ...siteRequirements };

            // Handle site_requirements_data which is an array of objects with description and price
            if (siteRequirements.site_requirements_data) {
                try {
                    let reqData = siteRequirements.site_requirements_data;

                    // If it's a string, try to parse it
                    if (typeof reqData === 'string') {
                        try {
                            reqData = JSON.parse(reqData);
                        } catch (e) {
                            console.error('Error parsing site_requirements_data string:', e);
                        }
                    }

                    // Handle array of objects
                    if (Array.isArray(reqData)) {
                        setCustomRequirements(reqData);

                        const formattedItems = reqData.map((item: any) => {
                            const description = item.description || 'No description';
                            const price = item.price ? `$${Number(item.price).toLocaleString()}` : '';
                            return price ? `${description} - ${price}` : description;
                        }).join(', ');

                        // Create a new field with a better name
                        updatedData.additional_site_requirements = formattedItems;

                        // Remove the original complex object to avoid [object Object] display
                        delete updatedData.site_requirements_data;
                    }
                    // Handle single object
                    else if (reqData && typeof reqData === 'object') {
                        setCustomRequirements([reqData]);

                        const description = reqData.description || 'No description';
                        const price = reqData.price ? `$${Number(reqData.price).toLocaleString()}` : '';

                        // Create a new field with a better name
                        updatedData.additional_site_requirements = price ? `${description} - ${price}` : description;

                        // Remove the original complex object to avoid [object Object] display
                        delete updatedData.site_requirements_data;
                    }
                } catch (error) {
                    console.error('Error processing site requirements data:', error);
                }
            }

            setFormattedData(updatedData);
        };

        processData();
    }, [siteRequirements]);

    // Debug log the site requirements
    if (process.env.NODE_ENV !== 'production') {
        console.log("SiteRequirementsSummary - siteRequirements:", siteRequirements);
        console.log("SiteRequirementsSummary - Fetched Costs:", {
            craneCost,
            trafficControlCost,
            bobcatCost
        });
    }

    // Calculate custom requirements total
    const customRequirementsTotal = Array.isArray(customRequirements)
        ? customRequirements.reduce((total, req) => total + (req.price || 0), 0)
        : 0;

    // Subtract $700 from the crane cost as it's already included elsewhere
    const adjustedCraneCost = craneCost > 700 ? craneCost - 700 : 0;

    // Total cost as shown in the site requirements tab
    const totalSiteRequirementsCost = adjustedCraneCost + trafficControlCost + bobcatCost + customRequirementsTotal;

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

    const totalRRP = calculateRRP(totalSiteRequirementsCost, marginData || 0);

    if (!siteRequirements) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Site Requirements</h3>
                    <EditSectionLink section="site-requirements" customerId={customerId} />
                </div>
                <div className="p-4 text-center bg-slate-50 rounded-md">
                    <div className="py-4">
                        <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">No site requirements data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Site Requirements</h3>
                <EditSectionLink section="site-requirements" customerId={customerId} />
            </div>

            {isLoading ? (
                <div className="p-4 text-center bg-slate-50 rounded-md">
                    <div className="py-4">
                        <p className="text-muted-foreground">Loading site requirements data...</p>
                    </div>
                </div>
            ) : (
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-x-8 mb-6">
                        {craneCost > 0 && (
                            <div>
                                <div className="text-muted-foreground">Crane</div>
                                {showMargins ? (
                                    <div className="font-medium">{formatCurrency(adjustedCraneCost)}</div>
                                ) : (
                                    <div className="font-medium">{formatCurrency(calculateRRP(adjustedCraneCost, marginData || 0))}</div>
                                )}
                                {craneCost > 700 && (
                                    <div className="text-xs text-muted-foreground">
                                        (Base includes $700 of crane cost)
                                    </div>
                                )}
                            </div>
                        )}

                        {customRequirementsTotal > 0 && (
                            <div>
                                <div className="text-muted-foreground">Custom Requirements</div>
                                {showMargins ? (
                                    <div className="font-medium">{formatCurrency(customRequirementsTotal)}</div>
                                ) : (
                                    <div className="font-medium">{formatCurrency(calculateRRP(customRequirementsTotal, marginData || 0))}</div>
                                )}
                            </div>
                        )}

                        {trafficControlCost > 0 && (
                            <div className="mt-4">
                                <div className="text-muted-foreground">Traffic Control</div>
                                {showMargins ? (
                                    <div className="font-medium">{formatCurrency(trafficControlCost)}</div>
                                ) : (
                                    <div className="font-medium">{formatCurrency(calculateRRP(trafficControlCost, marginData || 0))}</div>
                                )}
                            </div>
                        )}

                        {bobcatCost > 0 && (
                            <div className="mt-4">
                                <div className="text-muted-foreground">Bobcat</div>
                                {showMargins ? (
                                    <div className="font-medium">{formatCurrency(bobcatCost)}</div>
                                ) : (
                                    <div className="font-medium">{formatCurrency(calculateRRP(bobcatCost, marginData || 0))}</div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 col-span-2">
                            <div className="text-muted-foreground font-semibold">Total Site Requirements</div>
                            {showMargins ? (
                                <div className="font-medium">
                                    {formatCurrency(totalSiteRequirementsCost)} <span className="text-primary">({formatCurrency(totalRRP)})</span>
                                </div>
                            ) : (
                                <div className="font-medium text-primary">{formatCurrency(totalRRP)}</div>
                            )}
                        </div>
                    </div>

                    {siteRequirements.site_requirements_notes && (
                        <div className="mb-2">
                            <div className="text-muted-foreground">Notes</div>
                            <div>{siteRequirements.site_requirements_notes}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}; 
