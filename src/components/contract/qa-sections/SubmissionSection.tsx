import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileCheck, User, MapPin, Phone, Mail, Home, Building, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { useContractSummaryLineItems } from "@/hooks/calculations/useContractSummaryLineItems";
import { usePriceCalculator } from "@/hooks/calculations/use-calculator-totals";
import { useContractSubmission } from "@/components/contract/hooks/useContractSubmission";
import type { ProposalSnapshot } from "@/types/snapshot";
import type { PoolProject } from "@/types/pool";

interface SubmissionSectionProps {
  customer?: PoolProject | null;
  snapshot?: ProposalSnapshot | null;
  readonly?: boolean;
}

// Customer information row component
const CustomerInfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => {
  if (!value) return null;
  
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4 text-left">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-700">{label}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-left text-gray-900">{value}</td>
    </tr>
  );
};

// Contract summary row component
const SummaryRow = ({ label, value, isTotal = false }: { label: string, value: number, isTotal?: boolean }) => (
  <tr className={`border-b border-gray-100 ${isTotal ? 'bg-gray-50 font-bold' : ''}`}>
    <td className={`py-3 px-4 text-left ${isTotal ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
      {label}
    </td>
    <td className={`py-3 px-4 text-right ${isTotal ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
      {formatCurrency(value)}
    </td>
  </tr>
);

export const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  customer,
  snapshot,
  readonly = false,
}) => {
  // Call hooks at component level to avoid Rules of Hooks violations
  const lineItems = useContractSummaryLineItems(snapshot);
  const calculatorData = usePriceCalculator(snapshot);
  const { submitContract, isSubmitting, lastSubmission } = useContractSubmission();

  const handleSubmitContract = async () => {
    if (!customer) {
      console.error('❌ No customer data available for submission');
      return;
    }
    
    try {
      console.log('🚀 Initiating contract submission...');
      // Pass hook data to avoid calling hooks inside async function
      const result = await submitContract(customer, snapshot, lineItems, calculatorData);
      
      if (result.success) {
        console.log('🎉 Contract submission completed successfully!');
        console.log('📄 Submission ID:', result.submissionId);
        console.log('🔗 Webhook response:', result.webhookResponse);
      } else {
        console.error('💥 Contract submission failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Unexpected error during contract submission:', error);
    }
  };

  // Handle loading state
  if (!customer || !snapshot) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Contract Submission</h3>
          </div>
          <p className="text-muted-foreground">Loading contract data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Information Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Customer Information</h3>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <tbody>
                <CustomerInfoRow
                  icon={User}
                  label="Primary Owner"
                  value={customer.owner1}
                />
                {customer.owner2 && (
                  <CustomerInfoRow
                    icon={User}
                    label="Secondary Owner"
                    value={customer.owner2}
                  />
                )}
                <CustomerInfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={customer.phone}
                />
                <CustomerInfoRow
                  icon={Mail}
                  label="Email Address"
                  value={customer.email}
                />
                <CustomerInfoRow
                  icon={Home}
                  label="Home Address"
                  value={customer.home_address}
                />
                {customer.site_address && customer.site_address !== customer.home_address && (
                  <CustomerInfoRow
                    icon={MapPin}
                    label="Site Address"
                    value={customer.site_address}
                  />
                )}
                {customer.proposal_name && (
                  <CustomerInfoRow
                    icon={FileText}
                    label="Proposal Name"
                    value={customer.proposal_name}
                  />
                )}
                {customer.installation_area && (
                  <CustomerInfoRow
                    icon={Building}
                    label="Installation Area"
                    value={customer.installation_area}
                  />
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Contract Summary Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Contract Summary</h3>
          </div>
          
          <div className="space-y-4">
            {/* Grand Total - Prominently Displayed */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-blue-900">Contract Grand Total</h4>
                  <p className="text-sm text-blue-700">Total Contract Price Including HWI</p>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(lineItems.contractSummaryGrandTotalAfterDiscount)}
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="overflow-hidden border rounded-lg">
              <table className="w-full">
                <tbody>
                  <SummaryRow label="1. Deposit" value={lineItems.totalDeposit} />
                  <SummaryRow label="2. Pool Shell Supply" value={lineItems.totalDiscountAmount > 0 ? lineItems.poolShellSupplyAfterDiscount : lineItems.poolShellSupplyEquipmentTotal} />
                  <SummaryRow label="3. Excavation" value={lineItems.excavationContractTotal} />
                  <SummaryRow label="4. Pool Shell Installation" value={lineItems.poolShellInstallationTotal} />
                  <SummaryRow label="5. Paving / Coping" value={lineItems.pavingTotal} />
                  <SummaryRow label="6. Extra Concreting" value={lineItems.extraConcretingTotal} />
                  <SummaryRow label="7. Water Feature" value={lineItems.retainingWallsWaterFeatureTotal} />
                  <SummaryRow label="8. Special Inclusions & Equipment Upgrades" value={lineItems.specialInclusions} />
                  <SummaryRow label="9. Handover" value={lineItems.handoverTotal} />
                  <SummaryRow 
                    label="Contract Total Excluding HWI" 
                    value={lineItems.contractTotalExcludingHWI} 
                    isTotal={true}
                  />
                </tbody>
              </table>
            </div>

            {/* Additional Details */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• HWI Insurance Cost: {formatCurrency(lineItems.deposit.hwiCost)}</p>
              <p>• Fire Ant Treatment: {formatCurrency(lineItems.deposit.fireAntCost)}</p>
              <p>• Form 15 Cost: {formatCurrency(lineItems.deposit.form15Cost)}</p>
            </div>
            
            {/* Submission Status */}
            {lastSubmission && (
              <div className={`mt-4 p-3 rounded-lg border ${
                lastSubmission.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span className="font-medium">
                    {lastSubmission.success ? 'Submission Successful' : 'Submission Failed'}
                  </span>
                </div>
                {lastSubmission.success && lastSubmission.submissionId && (
                  <p className="text-xs mt-1">ID: {lastSubmission.submissionId}</p>
                )}
                {!lastSubmission.success && lastSubmission.error && (
                  <p className="text-xs mt-1">{lastSubmission.error}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button Section */}
      {!readonly && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={isSubmitting}
                    className="min-w-[160px] bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Submit Contract
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Contract</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit this contract? This action will finalize the contract details and cannot be easily undone.
                      <br /><br />
                      <strong>Customer:</strong> {customer.owner1}{customer.owner2 ? ` & ${customer.owner2}` : ''}
                      <br />
                      <strong>Contract Total:</strong> {formatCurrency(lineItems.contractSummaryGrandTotalAfterDiscount)}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSubmitContract}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Yes, Submit Contract
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};