import { Pool } from "@/types/pool";
import { MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

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
    const [formattedData, setFormattedData] = useState(siteRequirements);

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

    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Site Requirements"
            sectionId="site-requirements"
            data={formattedData}
            icon={<MapPin className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 