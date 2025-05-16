import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface ConcreteAndPavingSummaryProps {
    pool: Pool;
    customerId: string;
    concretePaving?: any;
}

export const ConcreteAndPavingSummary: React.FC<ConcreteAndPavingSummaryProps> = ({
    pool,
    customerId,
    concretePaving
}) => {
    const [formattedData, setFormattedData] = useState(concretePaving);

    useEffect(() => {
        if (!concretePaving) return;

        const fetchCategoryNames = async () => {
            let updatedData = { ...concretePaving };

            // Fetch paving category names
            if (concretePaving.extra_paving_category) {
                try {
                    const { data } = await supabase
                        .from('extra_paving_costs')
                        .select('category')
                        .eq('id', concretePaving.extra_paving_category)
                        .single();

                    if (data?.category) {
                        updatedData.extra_paving_category = data.category;
                    }
                } catch (error) {
                    console.error('Error fetching extra paving category:', error);
                }
            }

            // Fetch existing concrete paving category
            if (concretePaving.existing_concrete_paving_category) {
                try {
                    const { data } = await supabase
                        .from('extra_paving_costs')
                        .select('category')
                        .eq('id', concretePaving.existing_concrete_paving_category)
                        .single();

                    if (data?.category) {
                        updatedData.existing_concrete_paving_category = data.category;
                    }
                } catch (error) {
                    console.error('Error fetching existing concrete paving category:', error);
                }
            }

            // Fetch concrete cuts info - parse the "id:quantity" format
            if (concretePaving.concrete_cuts) {
                try {
                    // Parse the concrete_cuts string which is in format "id:quantity"
                    const cutParts = concretePaving.concrete_cuts.split(':');
                    if (cutParts.length >= 1) {
                        const cutId = cutParts[0];
                        const quantity = cutParts.length > 1 ? parseInt(cutParts[1], 10) : 1;

                        const { data } = await supabase
                            .from('concrete_cuts')
                            .select('cut_type')
                            .eq('id', cutId)
                            .single();

                        if (data?.cut_type) {
                            // Format as "Cut Type x Quantity"
                            updatedData.concrete_cuts = quantity > 1 ?
                                `${data.cut_type} x ${quantity}` :
                                data.cut_type;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching concrete cuts name:', error);
                }
            }

            // Handle under fence concrete strips data
            if (concretePaving.under_fence_concrete_strips_data) {
                try {
                    let stripsData = concretePaving.under_fence_concrete_strips_data;

                    // Parse if it's a string
                    if (typeof stripsData === 'string') {
                        stripsData = JSON.parse(stripsData);
                    }

                    // If it's an array with IDs, get the details
                    if (Array.isArray(stripsData) && stripsData.length > 0) {
                        const stripIds = stripsData.map(item => item.id).filter(Boolean);

                        if (stripIds.length > 0) {
                            const { data } = await supabase
                                .from('under_fence_concrete_strips')
                                .select('id, type')
                                .in('id', stripIds);

                            if (data && data.length > 0) {
                                const nameMap = data.reduce((acc, item) => {
                                    acc[item.id] = item.type;
                                    return acc;
                                }, {} as Record<string, string>);

                                const formattedStrips = stripsData.map((item: any) => {
                                    const name = nameMap[item.id] || 'Unknown';
                                    const length = item.length ? ` (Length: ${item.length}m)` : '';
                                    return `${name}${length}`;
                                }).join(', ');

                                updatedData.under_fence_concrete_strips_data = formattedStrips;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error processing under fence concrete strips data:', error);
                }
            }

            setFormattedData(updatedData);
        };

        fetchCategoryNames();
    }, [concretePaving]);

    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Concrete & Paving"
            sectionId="concrete-paving"
            data={formattedData}
            icon={<Layers className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 