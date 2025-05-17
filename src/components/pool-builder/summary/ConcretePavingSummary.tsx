import { Card, CardContent } from '@/components/ui/card';
import { PoolConcreteSelection, PoolFenceConcreteStrip, PoolPavingSelection } from '@/integrations/supabase/types';
import { Pool } from '@/types/pool';
import { Construction } from 'lucide-react';
import React from 'react';
import { PlaceholderSummary } from './PlaceholderSummary';

interface ConcretePavingSummaryProps {
    pool: Pool;
    customerId: string;
    concreteSelections?: PoolConcreteSelection | Record<string, never>;
    pavingSelections?: PoolPavingSelection | Record<string, never>;
    fenceConcreteStrips?: PoolFenceConcreteStrip | Record<string, never>;
}

export const ConcretePavingSummary: React.FC<ConcretePavingSummaryProps> = ({
    pool,
    customerId,
    concreteSelections,
    pavingSelections,
    fenceConcreteStrips
}) => {
    // Check if we have any concrete or paving data
    const hasData =
        (concreteSelections && Object.keys(concreteSelections).length > 0) ||
        (pavingSelections && Object.keys(pavingSelections).length > 0) ||
        (fenceConcreteStrips && Object.keys(fenceConcreteStrips).length > 0);

    // If no data, show placeholder
    if (!hasData) {
        return (
            <PlaceholderSummary
                pool={pool}
                customerId={customerId}
                title="Concrete & Paving"
                sectionId="concrete-paving"
                icon={<Construction className="h-6 w-6 mx-auto mb-2" />}
                data={null}
            />
        );
    }

    // Format currency for display
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD'
        }).format(value);
    };

    // Calculate total costs
    const concretePumpCost = concreteSelections?.concrete_pump_total_cost || 0;
    const concreteCutsCost = concreteSelections?.concrete_cuts_cost || 0;
    const extraPavingCost = pavingSelections?.extra_paving_total_cost || 0;
    const existingPavingCost = pavingSelections?.existing_concrete_paving_total_cost || 0;
    const extraConcretingCost = pavingSelections?.extra_concreting_total_cost || 0;
    const fenceStripsCost = fenceConcreteStrips?.total_cost || 0;

    const totalCost =
        concretePumpCost +
        concreteCutsCost +
        extraPavingCost +
        existingPavingCost +
        extraConcretingCost +
        fenceStripsCost;

    return (
        <Card className="shadow-md">
            <CardContent className="py-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Construction className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Concrete & Paving</h3>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(totalCost)}
                        </div>
                    </div>

                    {/* Concrete Selections */}
                    {(concretePumpCost > 0 || concreteCutsCost > 0) && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Concrete Work</h4>
                            <div className="space-y-2">
                                {concretePumpCost > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Concrete Pump</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(concretePumpCost)}</p>
                                        </div>
                                        {concreteSelections?.concrete_pump_quantity && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Quantity: {concreteSelections.concrete_pump_quantity}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {concreteCutsCost > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Concrete Cuts</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(concreteCutsCost)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Paving Selections */}
                    {(extraPavingCost > 0 || existingPavingCost > 0 || extraConcretingCost > 0) && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Paving</h4>
                            <div className="space-y-2">
                                {extraPavingCost > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Extra Paving</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(extraPavingCost)}</p>
                                        </div>
                                        {pavingSelections?.extra_paving_square_meters && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Area: {pavingSelections.extra_paving_square_meters} m²
                                            </p>
                                        )}
                                    </div>
                                )}

                                {existingPavingCost > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Existing Concrete Paving</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(existingPavingCost)}</p>
                                        </div>
                                        {pavingSelections?.existing_concrete_paving_square_meters && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Area: {pavingSelections.existing_concrete_paving_square_meters} m²
                                            </p>
                                        )}
                                    </div>
                                )}

                                {extraConcretingCost > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Extra Concreting: {pavingSelections?.extra_concreting_type}</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(extraConcretingCost)}</p>
                                        </div>
                                        {pavingSelections?.extra_concreting_square_meters && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Area: {pavingSelections.extra_concreting_square_meters} m²
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fence Concrete Strips */}
                    {fenceStripsCost > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Fence Concrete Strips</h4>
                            <div className="p-3 bg-slate-50 rounded-md">
                                <div className="flex justify-between">
                                    <p className="font-medium">Under Fence Concrete Strips</p>
                                    <p className="text-sm text-muted-foreground">{formatCurrency(fenceStripsCost)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 