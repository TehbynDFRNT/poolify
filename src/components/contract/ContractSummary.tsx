import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/format';
import { getHWIInsuranceCost, getHWILookupAmount } from '@/types/hwi-insurance';
import { usePriceCalculator } from '@/hooks/calculations/use-calculator-totals';
import { useContractSummaryLineItems } from '@/hooks/calculations/useContractSummaryLineItems';
import type { ProposalSnapshot } from '@/types/snapshot';
import { ChevronDown, ChevronUp, FileText, User } from 'lucide-react';
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

// Section card component for each section
const SectionCard = ({ title, children }) => (
    <Card className="mb-6 shadow-none">
        <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <div className="space-y-4">
                <table className="w-full">
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
);

interface ContractSummaryProps {
    snapshot: ProposalSnapshot | null | undefined;
    showMargins?: boolean;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({
    snapshot,
    showMargins = false,
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

    // Get calculated totals from price calculator hook
    const { contractGrandTotal, totals, fmt } = usePriceCalculator(snapshot);
    
    // Get contract summary line items
    const { deposit, contractData } = useContractSummaryLineItems(snapshot);
    
    console.log('🏗️ ContractSummary rendered', { 
        snapshot: !!snapshot, 
        snapshotId: snapshot?.project_id,
        deposit, 
        contractData 
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

    // contractData now comes from the useContractSummaryLineItems hook

    // Use the calculated contract grand total plus HWI insurance
    const grandTotal = contractGrandTotal

    // Calculate HWI insurance cost based on rounded down total
    const hwiLookupAmount = getHWILookupAmount(grandTotal);
    const hwiInsuranceCost = getHWIInsuranceCost(grandTotal);

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
            <Card className="mb-8 shadow-none">
                <CardContent className="py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">CONTRACT TOTAL</h3>
                            <p className="text-sm text-muted-foreground">Total Contract Price Including All Components</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(grandTotal)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Contract Summary Grand Total Comparison */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Contract Summary Total</span>
                                {!isCustomerView && (
                                    <p className="text-xs text-muted-foreground">
                                        Delta: {formatCurrency(Math.abs(grandTotal - contractData.contractSummaryGrandTotal))}
                                    </p>
                                )}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                                {formatCurrency(contractData.contractSummaryGrandTotal)}
                            </div>
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
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.deposit)}</span>
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
                                        label="HWI Insurance Cost"
                                        code=""
                                        value={deposit.hwiCost}
                                        breakdown={!isCustomerView ? "Home Warranty Insurance included in deposit" : null}
                                    />
                                    <LineItem
                                        label="Form 15"
                                        code=""
                                        value={deposit.form15Cost}
                                        breakdown={!isCustomerView ? "Building permit and compliance costs" : null}
                                    />
                                    <LineItem
                                        label="Deposit Remainder"
                                        code=""
                                        value={deposit.depositRemainder}
                                        breakdown={!isCustomerView ? "Additional deposit component to reach 10% total" : null}
                                    />
                                    <TotalRow
                                        label="Deposit Total"
                                        value={deposit.totalDeposit}
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
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.poolShellSupply)}</span>
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
                                        label="Equipment & Upgrades"
                                        code=""
                                        value={contractData.equipmentOnly}
                                        breakdown={!isCustomerView ? "Pool cleaners, heat pumps, blanket rollers, and other upgrades" : null}
                                    />
                                    <LineItem
                                        label="Shell Value"
                                        code=""
                                        value={contractData.shellValueInContract}
                                        breakdown={!isCustomerView ? "Core pool shell value excluding itemized components" : null}
                                    />
                                    <TotalRow
                                        label="Pool Shell Supply Total"
                                        value={contractData.poolShellSupply}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 3. POOL SHELL INSTALLATION SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.poolShellInstallation ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('poolShellInstallation')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">3. Pool Shell Installation</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.poolShellInstallation)}</span>
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
                                        value={contractData.craneCost}
                                        breakdown={!isCustomerView ? "Crane services for pool installation" : null}
                                    />
                                    <LineItem
                                        label="Traffic Control"
                                        code=""
                                        value={contractData.trafficControlInstallationCost}
                                        breakdown={!isCustomerView ? "Traffic management during installation" : null}
                                    />
                                    <LineItem
                                        label="Install Fee"
                                        code=""
                                        value={contractData.installFeeCost}
                                        breakdown={!isCustomerView ? "Pool installation service fee" : null}
                                    />
                                    <LineItem
                                        label="Pea Gravel / Backfill"
                                        code=""
                                        value={contractData.peaGravelBackfillCost}
                                        breakdown={!isCustomerView ? "Pea gravel and backfill materials" : null}
                                    />
                                    <TotalRow
                                        label="Pool Shell Installation Total"
                                        value={contractData.poolShellInstallation}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 4. EXCAVATION SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.excavation ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('excavation')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">4. Excavation</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.excavation)}</span>
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
                                        value={contractData.excavationTotal}
                                        breakdown={!isCustomerView ? "Site excavation and material removal" : null}
                                    />
                                    <LineItem
                                        label="Bobcat"
                                        code=""
                                        value={contractData.bobcatCost}
                                        breakdown={!isCustomerView ? "Bobcat equipment for site preparation" : null}
                                    />
                                    <LineItem
                                        label="Custom Site Requirements"
                                        code=""
                                        value={contractData.customSiteRequirementsCost}
                                        breakdown={!isCustomerView ? "Project-specific site requirements and equipment" : null}
                                    />
                                    <TotalRow
                                        label="Excavation Total"
                                        value={contractData.excavation}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 5. ENGINEERED BEAM SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.engineeredBeam ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('engineeredBeam')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">5. Engineered Beam</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.engineeredBeam)}</span>
                            {expandedSections.engineeredBeam ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </div>

                    {expandedSections.engineeredBeam && (
                        <div className="space-y-4">
                            <table className="w-full">
                                <tbody>
                                    <LineItem
                                        label="Structural Beam"
                                        code=""
                                        value={contractData.beamCost}
                                        breakdown={!isCustomerView ? "Engineered structural beam components" : null}
                                    />
                                    <TotalRow
                                        label="Engineered Beam Total"
                                        value={contractData.engineeredBeam}
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
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.extraConcreting)}</span>
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
                                    <LineItem
                                        label="Extra Concreting"
                                        code=""
                                        value={contractData.extraConcretingCost}
                                        breakdown={!isCustomerView ? "Additional concrete work requirements" : null}
                                    />
                                    <TotalRow
                                        label="Extra Concreting Total"
                                        value={contractData.extraConcreting}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 7. PAVING / COPING SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.pavingCoping ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('pavingCoping')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">7. Paving / Coping</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.pavingCoping)}</span>
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
                                    <LineItem
                                        label="Extra Paving + Concrete"
                                        code=""
                                        value={contractData.extraPavingCost}
                                        breakdown={!isCustomerView ? "Additional paving and concrete work" : null}
                                    />
                                    <LineItem
                                        label="Extra Paving on Existing Concrete"
                                        code=""
                                        value={contractData.existingPavingCost}
                                        breakdown={!isCustomerView ? "Paving work on existing concrete surfaces" : null}
                                    />
                                    <LineItem
                                        label="Concrete Pump"
                                        code=""
                                        value={contractData.concretePumpCost}
                                        breakdown={!isCustomerView ? "Concrete pumping services" : null}
                                    />
                                    <LineItem
                                        label="Under-fence Concrete Strips"
                                        code=""
                                        value={contractData.underFenceConcreteStripsCost}
                                        breakdown={!isCustomerView ? "Concrete strips under fencing" : null}
                                    />
                                    <LineItem
                                        label="Coping Supply"
                                        code=""
                                        value={contractData.copingSupplyCost}
                                        breakdown={!isCustomerView ? "Pool edge coping materials" : null}
                                    />
                                    <LineItem
                                        label="Coping Lay"
                                        code=""
                                        value={contractData.copingLayCost}
                                        breakdown={!isCustomerView ? "Pool edge coping installation" : null}
                                    />
                                    <LineItem
                                        label="Concrete Cuts"
                                        code=""
                                        value={contractData.concreteCutsCopingCost}
                                        breakdown={!isCustomerView ? "Concrete cutting and preparation work" : null}
                                    />
                                    <TotalRow
                                        label="Paving / Coping Total"
                                        value={contractData.pavingCoping}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 8. RETAINING WALLS / DROP EDGE RETAINING / WATER FEATURE SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.retainingWalls ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('retainingWalls')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">8. Retaining Walls / Drop Edge Retaining / Water Feature</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.retainingWalls)}</span>
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
                                        label="Retaining Walls"
                                        code=""
                                        value={contractData.retainingWallsCost}
                                        breakdown={!isCustomerView ? "Structural retaining walls" : null}
                                    />
                                    <LineItem
                                        label="Water Feature"
                                        code=""
                                        value={contractData.waterFeatureCost}
                                        breakdown={!isCustomerView ? "Water feature installation" : null}
                                    />
                                    <TotalRow
                                        label="Retaining Walls / Water Feature Total"
                                        value={contractData.retainingWalls}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 9. SPECIAL INCLUSIONS SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.specialInclusions ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('specialInclusions')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">9. Special Inclusions</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.specialInclusions)}</span>
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
                                        label="Special Items"
                                        code=""
                                        value={contractData.specialInclusions}
                                        breakdown={!isCustomerView ? "Project-specific inclusions" : null}
                                    />
                                    <TotalRow
                                        label="Special Inclusions Total"
                                        value={contractData.specialInclusions}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 10. HANDOVER SECTION */}
            <Card className="mb-6 shadow-none">
                <CardContent className="pt-6">
                    <div
                        className={`flex justify-between items-center cursor-pointer ${expandedSections.handover ? 'mb-4' : ''}`}
                        onClick={() => toggleSection('handover')}
                    >
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">10. Handover</h3>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(contractData.handover)}</span>
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
                                        value={contractData.handover}
                                        breakdown={!isCustomerView ? "Final project handover and documentation" : null}
                                    />
                                    <TotalRow
                                        label="Handover Total"
                                        value={contractData.handover}
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