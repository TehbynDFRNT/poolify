import { Card, CardContent } from '@/components/ui/card';
import { Pool } from '@/types/pool';
import { ExtendedPoolEquipmentSelection } from '@/utils/poolProjectHelpers';
import { HardHat } from 'lucide-react';
import React from 'react';
import { PlaceholderSummary } from './PlaceholderSummary';

interface EquipmentData {
    id: string;
    name?: string;
    price: number;
}

interface SiteRequirementsSummaryProps {
    pool: Pool;
    customerId: string;
    siteRequirements: {
        requirementsData?: any[] | null;
        requirementsNotes?: string | null;
        equipmentSelections?: ExtendedPoolEquipmentSelection | Record<string, never>;
    };
}

export const SiteRequirementsSummary: React.FC<SiteRequirementsSummaryProps> = ({
    pool,
    customerId,
    siteRequirements
}) => {
    // Check if there are any site requirements
    const hasRequirements =
        (siteRequirements.requirementsData &&
            ((Array.isArray(siteRequirements.requirementsData) && siteRequirements.requirementsData.length > 0) ||
                (typeof siteRequirements.requirementsData === 'object'))) ||
        (siteRequirements.requirementsNotes && siteRequirements.requirementsNotes.trim() !== '') ||
        (siteRequirements.equipmentSelections &&
            (siteRequirements.equipmentSelections.crane ||
                siteRequirements.equipmentSelections.traffic_control ||
                siteRequirements.equipmentSelections.bobcat));

    // If no site requirements, show placeholder
    if (!hasRequirements) {
        return (
            <PlaceholderSummary
                pool={pool}
                customerId={customerId}
                title="Site Requirements"
                sectionId="site-requirements"
                icon={<HardHat className="h-6 w-6 mx-auto mb-2" />}
                data={null}
            />
        );
    }

    // Format currency values
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
        }).format(value);
    };

    // Extract equipment selections
    const { crane, traffic_control, bobcat } = siteRequirements.equipmentSelections || {};

    // Calculate total cost
    const customRequirementsCost = Array.isArray(siteRequirements.requirementsData)
        ? siteRequirements.requirementsData.reduce((sum, item) => sum + (item.price || 0), 0)
        : typeof siteRequirements.requirementsData === 'object' && siteRequirements.requirementsData
            ? (siteRequirements.requirementsData.price || 0)
            : 0;

    const craneCost = crane?.price || 0;
    const trafficControlCost = traffic_control?.price || 0;
    const bobcatCost = bobcat?.price || 0;

    const totalCost = customRequirementsCost + craneCost + trafficControlCost + bobcatCost;

    return (
        <Card className="shadow-md">
            <CardContent className="py-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HardHat className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Site Requirements</h3>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(totalCost)}
                        </div>
                    </div>

                    {/* Equipment selections */}
                    {(crane || traffic_control || bobcat) && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Equipment Required</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {crane && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <p className="font-medium">{crane.name || 'Crane'}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(crane.price)}</p>
                                    </div>
                                )}
                                {traffic_control && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <p className="font-medium">{traffic_control.name || 'Traffic Control'}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(traffic_control.price)}</p>
                                    </div>
                                )}
                                {bobcat && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <p className="font-medium">{bobcat.size_category || 'Bobcat'}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(bobcat.price)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Custom site requirements */}
                    {Array.isArray(siteRequirements.requirementsData) && siteRequirements.requirementsData.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Custom Requirements</h4>
                            <div className="space-y-2">
                                {siteRequirements.requirementsData.map((req, index) => (
                                    <div key={index} className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">{req.name || req.description || 'Custom Requirement'}</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(req.price || 0)}</p>
                                        </div>
                                        {req.notes && <p className="text-sm text-muted-foreground mt-1">{req.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional notes */}
                    {siteRequirements.requirementsNotes && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Additional Notes</h4>
                            <p className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-md">
                                {siteRequirements.requirementsNotes}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 
