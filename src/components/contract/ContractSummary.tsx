import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/format';
import { usePriceCalculator } from '@/hooks/calculations/use-calculator-totals';
import { useContractSummaryLineItems } from '@/hooks/calculations/useContractSummaryLineItems';
import type { ProposalSnapshot } from '@/types/snapshot';
import { ChevronDown, ChevronUp, FileText, User, Percent } from 'lucide-react';
import React, { useState } from 'react';

// Line item component for detailed cost breakdowns
const LineItem = ({ label, code, value, breakdown = null }) => (
    <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-left">
            {label} {code && code.indexOf('_') === -1 && <span className="text-muted-foreground text-sm">({code})</span>}
        </td>
        <td className="py-3 px-4 text-right">{formatCurrency(value)}</td>
        {breakdown && <td className="py-3 px-4 text-left text-muted-foreground text-sm">{breakdown}</td>}
        {!breakdown && <td></td>}
    </tr>
);

// Subtotal row for sections
const SubtotalRow = ({ label, value }) => (
    <tr className="border-b border-gray-200 font-medium">
        <td className="py-3 px-4 text-left">{label}</td>
        <td className="py-3 px-4 text-right">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);

// Total row with background highlight
const TotalRow = ({ label, value }) => (
    <tr className="bg-gray-50 font-bold">
        <td className="py-3 px-4 text-left">{label}</td>
        <td className="py-3 px-4 text-right text-gray-900 font-semibold">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);


interface ContractSummaryProps {
    snapshot: ProposalSnapshot | null | undefined;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({
    snapshot
}) => {
    // Add state for view mode - default to Customer View
    const [isCustomerView, setIsCustomerView] = useState(true);
    // Add state for expanded sections
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        deposit: false,
        poolShellSupply: false,
        poolShellInstallation: false,
        excavation: false,
        engineeredBeam: false,
        extraConcreting: false,
        pavingCoping: false,
        retainingWalls: false,
        specialInclusions: false,
        handover: false
    });

    // Toggle expansion for a section
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Get calculated totals from price calculator hook with discount information
    const appliedDiscounts = snapshot?.applied_discounts_json?.map(discount => ({
        id: discount.id || 'unknown',
        discount_promotion: {
            uuid: discount.discount_promotion_uuid || 'unknown',
            discount_name: discount.discount_name || 'Unnamed Discount',
            discount_type: discount.discount_type as 'dollar' | 'percentage',
            dollar_value: discount.dollar_value,
            percentage_value: discount.percentage_value
        }
    })) || [];
    
    const { grandTotal, totals } = usePriceCalculator(snapshot, appliedDiscounts);
    
    // Get contract summary line items (now pulls discounts from snapshot internally)
    const lineItems = useContractSummaryLineItems(snapshot);
    
    console.log('🏗️ ContractSummary rendered', { 
        snapshot: !!snapshot, 
        snapshotId: snapshot?.project_id,
        lineItems 
    });
    
    // Handle loading state when snapshot is not available
    if (!snapshot) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Contract Price Summary</h2>
                </div>
                <p className="text-muted-foreground mb-6">Loading contract data...</p>
            </div>
        );
    }

    // lineItems now comes from the useContractSummaryLineItems hook

    // Use the calculated grand total from price calculator (includes third party costs)
    const proposalGrandTotal = grandTotal;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Contract Price Summary</h2>
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Switch
                                        id="view-mode"
                                        checked={isCustomerView}
                                        onCheckedChange={setIsCustomerView}
                                    />
                                    <div className="ml-2">
                                        {isCustomerView ?
                                            <User className="h-4 w-4 text-gray-600" /> :
                                            <FileText className="h-4 w-4 text-gray-600" />
                                        }
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-xs">
                                {isCustomerView ? "Presentation View" : "Detailed View"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <p className="text-muted-foreground mb-6">Complete breakdown of all contract components for this pool project</p>

            {/* GRAND TOTAL */}
            <Card className={`mb-8 shadow-none ${lineItems.totalDiscountAmount > 0 ? 'border-2 border-primary' : ''}`}>
                <CardContent className="py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Contract Grand Total</h3>
                            <p className="text-sm text-muted-foreground">Total Contract Price Including HWI</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(lineItems.contractSummaryGrandTotalAfterDiscount)}
                                </div>
                                {lineItems.totalDiscountAmount > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                        Before discounts: {formatCurrency(lineItems.contractSummaryGrandTotal)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Discount Breakdown */}
                    {lineItems.totalDiscountAmount > 0 && snapshot?.applied_discounts_json && snapshot.applied_discounts_json.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Discounts:</h4>
                            <div className="space-y-1">
                                {snapshot.applied_discounts_json.map((discount, index) => {
                                    const discountAmount = discount.discount_type === 'dollar'
                                        ? discount.dollar_value || 0
                                        : (lineItems.contractSummaryGrandTotal * (discount.percentage_value || 0)) / 100;
                                    
                                    return (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2 text-red-600">
                                                <Percent className="h-3 w-3" />
                                                <span>{discount.discount_name}</span>
                                                {discount.discount_type === 'percentage' && (
                                                    <span className="text-xs text-muted-foreground">
                                                        ({discount.percentage_value}% of {formatCurrency(lineItems.contractSummaryGrandTotal)})
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-red-600 font-medium">
                                                -{formatCurrency(discountAmount)}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="flex justify-between items-center text-sm font-medium text-red-600 pt-1 border-t border-red-100">
                                    <span>Total Discount:</span>
                                    <span>-{formatCurrency(lineItems.totalDiscountAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Contract Total Excluding HWI */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Contract Total Excluding HWI</span>
                                {!isCustomerView && (
                                    <p className="text-xs text-muted-foreground">
                                        Contract total without HWI insurance component
                                    </p>
                                )}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                                {formatCurrency(lineItems.contractTotalExcludingHWI)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Contract Summary Grand Total Comparison */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Total Proposal Cost</span>
                                <p className="text-xs text-muted-foreground">
                                    (Includes Third Party Fencing, Electrical & Temp Safety Barrier)
                                </p>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                                {formatCurrency(proposalGrandTotal)}
                            </div>
                        </div>
                        
                        {/* Third Party Costs Breakdown */}
                        <div className="mt-3 ml-4 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Fencing Total</span>
                                <span className="text-muted-foreground">{formatCurrency(totals.fencingTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Electrical Total</span>
                                <span className="text-muted-foreground">{formatCurrency(totals.electricalTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Temporary Safety Barrier</span>
                                <span className="text-muted-foreground">{formatCurrency(lineItems.marginAppliedTempSafetyBarrierCost)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-t pt-1">
                                <span className="text-muted-foreground font-medium">Third Party Subtotal</span>
                                <span className="text-muted-foreground font-medium">{formatCurrency(totals.fencingTotal + totals.electricalTotal + lineItems.marginAppliedTempSafetyBarrierCost)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-1">
                                <span className="text-muted-foreground">Third Party Subtotal - HWI Cost</span>
                                <span className="text-muted-foreground">{formatCurrency((totals.fencingTotal + totals.electricalTotal + lineItems.marginAppliedTempSafetyBarrierCost) - lineItems.deposit.hwiCost)}</span>
                            </div>
                            {!isCustomerView && (
                                <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-muted-foreground">Delta vs Contract Total (Debug)</span>
                                    <span className="text-muted-foreground">{formatCurrency(proposalGrandTotal - lineItems.contractSummaryGrandTotalAfterDiscount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 1. DEPOSIT SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.deposit ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('deposit')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">1. Deposit</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.totalDeposit)}</span>
                            {expandedSections.deposit ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.deposit && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Fire Ant"
                                        code=""
                                        value={lineItems.deposit.fireAntCost}
                                        breakdown={!isCustomerView ? "Fire ant treatment included in deposit" : null}
                                    />
                                    <LineItem
                                        label="HWI Insurance Cost"
                                        code=""
                                        value={lineItems.deposit.hwiCost}
                                        breakdown={!isCustomerView ? "Home Warranty Insurance included in deposit" : null}
                                    />
                                    <LineItem
                                        label="Form 15"
                                        code=""
                                        value={lineItems.deposit.form15Cost}
                                        breakdown={!isCustomerView ? "Building permit and compliance costs" : null}
                                    />
                                    <LineItem
                                        label="Deposit Remainder"
                                        code=""
                                        value={lineItems.deposit.depositRemainder}
                                        breakdown={!isCustomerView ? "Additional deposit component to reach 10% total" : null}
                                    />
                                    <TotalRow
                                        label="Deposit Total"
                                        value={lineItems.deposit.totalDeposit}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 2. POOL SHELL SUPPLY SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.poolShellSupply ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('poolShellSupply')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">2. Pool Shell Supply</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">
                                {formatCurrency(lineItems.totalDiscountAmount > 0 
                                    ? lineItems.poolShellSupplyAfterDiscount 
                                    : lineItems.poolShellSupplyEquipmentTotal)}
                            </span>
                            {expandedSections.poolShellSupply ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.poolShellSupply && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Filtration Package"
                                        code=""
                                        value={lineItems.equipmentOnly - totals.extrasTotal}
                                        breakdown={!isCustomerView ? "Pump, filter, sanitiser, light, and handover components (margin applied)" : null}
                                    />
                                    <LineItem
                                        label="Equipment Upgrades"
                                        code=""
                                        value={totals.extrasTotal}
                                        breakdown={!isCustomerView ? "Optional upgrades (cleaners, heat pumps, blanket rollers)" : null}
                                    />
                                    <LineItem
                                        label="Shell Value"
                                        code=""
                                        value={lineItems.shellValueInContract}
                                        breakdown={!isCustomerView ? "Pool shell, freight, and miscellaneous costs (margin applied)" : null}
                                    />
                                    {lineItems.totalDiscountAmount > 0 && (
                                        <>
                                            <SubtotalRow
                                                label="Pool Shell Supply Subtotal"
                                                value={lineItems.poolShellSupplyEquipmentTotal}
                                            />
                                            <tr className="border-b border-gray-100 text-red-600">
                                                <td className="py-3 px-4 text-left">
                                                    Discount Applied
                                                </td>
                                                <td className="py-3 px-4 text-right">-{formatCurrency(lineItems.totalDiscountAmount)}</td>
                                                <td className="py-3 px-4 text-left text-sm text-muted-foreground">
                                                    {!isCustomerView && "Discount taken from pool shell supply line item"}
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    <TotalRow
                                        label="Pool Shell Supply Total"
                                        value={lineItems.totalDiscountAmount > 0 
                                            ? lineItems.poolShellSupplyAfterDiscount 
                                            : lineItems.poolShellSupplyEquipmentTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 3. EXCAVATION SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.excavation ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('excavation')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">3. Excavation</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.excavationContractTotal)}</span>
                            {expandedSections.excavation ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.excavation && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Excavation & Truck"
                                        code=""
                                        value={lineItems.marginAppliedDigCost}
                                        breakdown={!isCustomerView ? "Site excavation and material removal" : null}
                                    />
                                    <LineItem
                                        label="Bobcat"
                                        code=""
                                        value={lineItems.marginAppliedBobcatCost}
                                        breakdown={!isCustomerView ? "Bobcat equipment for site preparation" : null}
                                    />
                                    <LineItem
                                        label="AG Line"
                                        code=""
                                        value={lineItems.marginAppliedAgLineCost}
                                        breakdown={!isCustomerView ? "Site conduit and electrical preparation" : null}
                                    />
                                    <LineItem
                                        label="Custom Site Requirements"
                                        code=""
                                        value={lineItems.marginAppliedCustomSiteRequirementsCost}
                                        breakdown={!isCustomerView ? "Project-specific site requirements and equipment" : null}
                                    />
                                    <TotalRow
                                        label="Excavation Total"
                                        value={lineItems.excavationContractTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 4. POOL SHELL INSTALLATION SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.poolShellInstallation ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('poolShellInstallation')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">4. Pool Shell Installation</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.poolShellInstallationTotal)}</span>
                            {expandedSections.poolShellInstallation ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.poolShellInstallation && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Crane"
                                        code=""
                                        value={lineItems.marginAppliedCraneCost}
                                        breakdown={!isCustomerView ? "Crane services for pool installation" : null}
                                    />
                                    <LineItem
                                        label="Traffic Control"
                                        code=""
                                        value={lineItems.marginAppliedTrafficControlCost}
                                        breakdown={!isCustomerView ? "Traffic management during installation" : null}
                                    />
                                    <LineItem
                                        label="Install Fee"
                                        code=""
                                        value={lineItems.marginAppliedPcInstallFee}
                                        breakdown={!isCustomerView ? "Pool installation service fee" : null}
                                    />
                                    <LineItem
                                        label="Pea Gravel / Backfill"
                                        code=""
                                        value={lineItems.marginAppliedPcPeaGravel}
                                        breakdown={!isCustomerView ? "Pea gravel and backfill materials" : null}
                                    />
                                    <LineItem
                                        label="Pipe Fitting + 3 Way Valve"
                                        code=""
                                        value={lineItems.marginAppliedPipeFittingCost}
                                        breakdown={!isCustomerView ? "Plumbing fittings and valve installation" : null}
                                    />
                                    <LineItem
                                        label="Filter Slab"
                                        code=""
                                        value={lineItems.marginAppliedFilterSlabCost}
                                        breakdown={!isCustomerView ? "Concrete slab for filtration equipment" : null}
                                    />
                                    <TotalRow
                                        label="Pool Shell Installation Total"
                                        value={lineItems.poolShellInstallationTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 5. PAVING / COPING SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.pavingCoping ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('pavingCoping')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">5. Paving / Coping</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.pavingTotal)}</span>
                            {expandedSections.pavingCoping ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.pavingCoping && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    {/* Included Paving & Coping Subsection */}
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <td className="py-2 px-4 text-left font-medium text-gray-700" colSpan={3}>
                                            Included Paving & Coping
                                        </td>
                                    </tr>
                                    <LineItem
                                        label="Supply Coping"
                                        code=""
                                        value={lineItems.marginAppliedPcCopingSupply}
                                        breakdown={!isCustomerView ? "Pool edge coping materials (margin applied)" : null}
                                    />
                                    <LineItem
                                        label="Lay Pavers"
                                        code=""
                                        value={lineItems.marginAppliedPcCopingLay}
                                        breakdown={!isCustomerView ? "Pool edge coping installation (margin applied)" : null}
                                    />
                                    <SubtotalRow
                                        label="Included Paving & Coping Subtotal"
                                        value={lineItems.includedPavingCoping}
                                    />

                                    {/* Extra Paving Subsection */}
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <td className="py-2 px-4 text-left font-medium text-gray-700" colSpan={3}>
                                            Extra Paving
                                        </td>
                                    </tr>
                                    <LineItem
                                        label="Paving and Concreting"
                                        code=""
                                        value={lineItems.extraPavingCost}
                                        breakdown={!isCustomerView ? "Additional paving and concrete work" : null}
                                    />
                                    <LineItem
                                        label="Paving On Existing Concrete"
                                        code=""
                                        value={lineItems.existingPavingCost}
                                        breakdown={!isCustomerView ? "Paving work on existing concrete surfaces" : null}
                                    />
                                    <SubtotalRow
                                        label="Extra Paving Subtotal"
                                        value={lineItems.extraPavingSubtotal}
                                    />

                                    {/* Concrete Works Subsection */}
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <td className="py-2 px-4 text-left font-medium text-gray-700" colSpan={3}>
                                            Concrete Works
                                        </td>
                                    </tr>
                                    <LineItem
                                        label="Structural Beam"
                                        code=""
                                        value={lineItems.beamCost}
                                        breakdown={!isCustomerView ? "Engineered structural beam components" : null}
                                    />
                                    <LineItem
                                        label="Concreting Costs"
                                        code=""
                                        value={lineItems.concretingCosts}
                                        breakdown={!isCustomerView ? "Concrete pump, under fence strips, and concrete cuts" : null}
                                    />
                                    <SubtotalRow
                                        label="Concrete Works Subtotal"
                                        value={lineItems.beamCost + lineItems.concretingCosts}
                                    />

                                    {/* Retaining Walls Subsection */}
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <td className="py-2 px-4 text-left font-medium text-gray-700" colSpan={3}>
                                            Retaining Walls
                                        </td>
                                    </tr>
                                    <LineItem
                                        label="Retaining Walls"
                                        code=""
                                        value={lineItems.retainingWallsCost}
                                        breakdown={!isCustomerView ? "Structural retaining walls" : null}
                                    />
                                    <SubtotalRow
                                        label="Retaining Walls Subtotal"
                                        value={lineItems.retainingWallsCost}
                                    />

                                    <TotalRow
                                        label="Paving / Coping Total"
                                        value={lineItems.pavingTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 6. EXTRA CONCRETING SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.extraConcreting ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('extraConcreting')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">6. Extra Concreting</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.extraConcretingTotal)}</span>
                            {expandedSections.extraConcreting ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.extraConcreting && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    {(snapshot?.extra_concreting_cost || 0) > 0 && (
                                        <LineItem
                                            label="Extra Concreting"
                                            code=""
                                            value={snapshot?.extra_concreting_cost || 0}
                                            breakdown={!isCustomerView ? "Additional structural concrete work" : null}
                                        />
                                    )}
                                    {(snapshot?.extra_concrete_pump_total_cost || 0) > 0 && (
                                        <LineItem
                                            label="Extra Concrete Pump"
                                            code=""
                                            value={snapshot?.extra_concrete_pump_total_cost || 0}
                                            breakdown={!isCustomerView ? "Additional concrete pump for extra concreting work" : null}
                                        />
                                    )}
                                    {lineItems.extraConcretingTotal === 0 && (
                                        <LineItem
                                            label="No Extra Concreting"
                                            code=""
                                            value={0}
                                            breakdown={!isCustomerView ? "No additional structural concrete work required" : null}
                                        />
                                    )}
                                    <TotalRow
                                        label="Extra Concreting Total"
                                        value={lineItems.extraConcretingTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 7. WATER FEATURE SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.retainingWalls ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('retainingWalls')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">7. Water Feature</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.retainingWallsWaterFeatureTotal)}</span>
                            {expandedSections.retainingWalls ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.retainingWalls && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Water Feature"
                                        code=""
                                        value={lineItems.waterFeatureCost}
                                        breakdown={!isCustomerView ? "Water feature installation" : null}
                                    />
                                    <TotalRow
                                        label="Water Feature Total"
                                        value={lineItems.retainingWallsWaterFeatureTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 8. SPECIAL INCLUSIONS SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.specialInclusions ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('specialInclusions')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">8. Special Inclusions & Equipment Upgrades</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.specialInclusions)}</span>
                            {expandedSections.specialInclusions ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.specialInclusions && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Custom Add-Ons"
                                        code=""
                                        value={lineItems.customAddOnsCost}
                                        breakdown={!isCustomerView ? "Custom, project-specific add-ons not in standard catalog" : null}
                                    />
                                    
                                    {/* Post-Installation Upgrades Subsection */}
                                    {lineItems.postInstallationUpgrades > 0 && (
                                        <>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <td className="py-2 px-4 text-left font-medium text-gray-700" colSpan={3}>
                                                    Post-Installation Upgrades
                                                </td>
                                            </tr>
                                            {lineItems.cleanerCost > 0 && (
                                                <LineItem
                                                    label="Pool Cleaner"
                                                    code=""
                                                    value={lineItems.cleanerCost}
                                                    breakdown={!isCustomerView ? "Automatic pool cleaner" : null}
                                                />
                                            )}
                                            {lineItems.heatPumpCost > 0 && (
                                                <LineItem
                                                    label="Heat Pump"
                                                    code=""
                                                    value={lineItems.heatPumpCost}
                                                    breakdown={!isCustomerView ? "Heat pump unit and installation" : null}
                                                />
                                            )}
                                            {lineItems.handGrabRailsCost > 0 && (
                                                <LineItem
                                                    label="Hand Grab Rails"
                                                    code=""
                                                    value={lineItems.handGrabRailsCost}
                                                    breakdown={!isCustomerView ? "Pool safety hand grab rails" : null}
                                                />
                                            )}
                                            <SubtotalRow
                                                label="Post-Installation Upgrades Subtotal"
                                                value={lineItems.postInstallationUpgrades}
                                            />
                                        </>
                                    )}
                                    
                                    <TotalRow
                                        label="Special Inclusions & Equipment Upgrades Total"
                                        value={lineItems.specialInclusions}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 9. HANDOVER SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.handover ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('handover')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">9. Handover</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(lineItems.handoverTotal)}</span>
                            {expandedSections.handover ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.handover && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Project Handover"
                                        code=""
                                        value={lineItems.handoverTotal}
                                        breakdown={!isCustomerView ? "Final project handover and documentation" : null}
                                    />
                                    <TotalRow
                                        label="Handover Total"
                                        value={lineItems.handoverTotal}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};