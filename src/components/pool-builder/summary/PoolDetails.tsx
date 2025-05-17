import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Pool } from '@/types/pool';
import React, { useContext } from 'react';
import { MarginVisibilityContext } from './SummarySection';

interface PoolDetailsProps {
    pool: Pool;
    customerId: string;
    projectData: any;
}

export const PoolDetails: React.FC<PoolDetailsProps> = ({
    pool,
    customerId,
    projectData
}) => {
    // Access margin visibility context
    const showMargins = useContext(MarginVisibilityContext);

    // Get pool margin
    const marginData = 0.3; // Default margin percentage, replace with actual margin from database

    // Format currency values
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

    // Calculate base pool RRP
    const basePoolRRP = calculateRRP(pool.buy_price_inc_gst || 0, marginData || 0);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Names</TableCell>
                                <TableCell>{projectData.owner1} {projectData.owner2 ? `& ${projectData.owner2}` : ''}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Email</TableCell>
                                <TableCell>{projectData.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Phone</TableCell>
                                <TableCell>{projectData.phone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Home Address</TableCell>
                                <TableCell>{projectData.home_address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Site Address</TableCell>
                                <TableCell>{projectData.site_address || projectData.home_address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Project Name</TableCell>
                                <TableCell>{projectData.proposal_name}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Pool Specification Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Pool Specification</h3>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Pool Model</TableCell>
                                <TableCell>{pool.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Range</TableCell>
                                <TableCell>{pool.range}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Dimensions</TableCell>
                                <TableCell>{`${pool.length}m x ${pool.width}m x ${pool.depth_shallow}m/${pool.depth_deep}m`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Color</TableCell>
                                <TableCell>{projectData.pool_color || 'Not specified'}</TableCell>
                            </TableRow>
                            {showMargins && (
                                <TableRow>
                                    <TableCell className="font-medium">Margin</TableCell>
                                    <TableCell>{`${(marginData * 100).toFixed(0)}%`}</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell className="font-medium">Base Price</TableCell>
                                <TableCell>{formatCurrency(basePoolRRP)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}; 