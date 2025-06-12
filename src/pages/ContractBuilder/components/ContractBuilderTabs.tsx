import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, FileBarChart, MapPin, Shovel, Shield, AlertTriangle, Settings, Package, DollarSign } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSnapshots } from "@/hooks/useSnapshots";
import { useSnapshot } from "@/hooks/useSnapshot";
import { useContractDetailsConfirmed } from "@/components/contract/hooks/useContractDetailsConfirmed";
import CustomerInformationSection from "@/components/pool-builder/customer-information/CustomerInformationSection";
import { SummarySection } from "@/components/pool-builder/summary/SummarySection";
import { Button } from "@/components/ui/button";

// Import individual Q&A section components
import { ContractBasicsSection } from "../../../components/contract/qa-sections/ContractBasicsSection";
import { AccessSiteConditionsSection } from "../../../components/contract/qa-sections/AccessSiteConditionsSection";
import { SitePreparationExcavationSection } from "../../../components/contract/qa-sections/SitePreparationExcavationSection";
import { ResponsibilitiesSection } from "../../../components/contract/qa-sections/ResponsibilitiesSection";
import { SafetyTemporaryWorksSection } from "../../../components/contract/qa-sections/SafetyTemporaryWorksSection";
import { ExtraCostRiskFlagsSection } from "../../../components/contract/qa-sections/ExtraCostRiskFlagsSection";
import { OwnerSuppliedItemsSection } from "../../../components/contract/qa-sections/OwnerSuppliedItemsSection";
import { SiteDueDiligenceSection } from "../../../components/contract/qa-sections/SiteDueDiligenceSection";
import { SpecialWorkInstructionsSection } from "../../../components/contract/qa-sections/SpecialWorkInstructionsSection";
import { SurveyReferenceSection } from "../../../components/contract/qa-sections/SurveyReferenceSection";
import { InclusionsSection } from "../../../components/contract/qa-sections/InclusionsSection";
import { ContractSummary } from "../../../components/contract/ContractSummary";

import {
  ContractQAFormData,
  ContractBasics,
  AccessSiteConditions,
  SitePreparationExcavation,
  Responsibilities,
  SafetyTemporaryWorks,
  ExtraCostRiskFlags,
  OwnerSuppliedItems,
  SiteDueDiligenceNotes,
  SpecialWorkInstructions,
  SurveyReference,
  ContractInclusions,
  DEFAULT_EXTRA_COST_RISK_FLAGS,
  DEFAULT_CONTRACT_INCLUSIONS,
} from "@/types/contract-qa";

interface ContractBuilderTabsProps {
  customerId: string | null;
  customer: PoolProject | null;
  selectedPool: Pool | null;
  loading: boolean;
}

// Import here to avoid circular dependencies
import { PoolProject, Pool } from "@/types/pool";

export const ContractBuilderTabs: React.FC<ContractBuilderTabsProps> = ({
  customerId,
  customer,
  selectedPool,
  loading
}) => {
  const [activeTab, setActiveTab] = useState("contract");
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState<PoolProject | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");
  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [contractSignatoryDiffers, setContractSignatoryDiffers] = useState(false);
  const navigate = useNavigate();
  
  // Get proposal IDs for snapshot fetching
  const proposalIds = proposals.map(proposal => proposal.id);
  const { snapshots = new Map(), loading: snapshotsLoading } = useSnapshots(proposalIds);
  
  // Get full snapshot data for selected customer
  const { snapshot: customerSnapshot, loading: customerSnapshotLoading } = useSnapshot(customerId || "");
  
  // Check if contract customer details have been confirmed
  const { isConfirmed: contractDetailsConfirmed, isLoading: contractDetailsLoading, refreshConfirmationStatus } = useContractDetailsConfirmed(customerId);
  
  useEffect(() => {
    fetchProposals();
  }, []);
  
  // Auto-select proposal if customerId is provided
  useEffect(() => {
    if (customerId && proposals.length > 0 && !selectedProposal) {
      const customerProposal = proposals.find(p => p.id === customerId);
      if (customerProposal) {
        setSelectedProposal(customerProposal);
      }
    }
  }, [customerId, proposals, selectedProposal]);
  
  const fetchProposals = async () => {
    try {
      setProposalsLoading(true);
      const { data, error } = await supabase
        .from('pool_projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProposals(data || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setProposalsLoading(false);
    }
  };
  
  // Filter proposals to only show accepted ones
  const acceptedProposals = proposals.filter(proposal => {
    const statusData = snapshots?.get(proposal.id);
    return statusData?.status === 'accepted';
  });
  
  const handleProposalSelect = (proposalId: string) => {
    setSelectedProposalId(proposalId);
  };
  
  const handleConfirmSelection = () => {
    if (selectedProposalId) {
      navigate(`/contract-builder?customerId=${selectedProposalId}`);
    }
  };
  
  const handleSelectAnotherCustomer = () => {
    navigate('/contract-builder');
  };

  // Q&A Form state management
  const [formData, setFormData] = useState<ContractQAFormData>({
    contractBasics: {
      isResidentOwner: "",
      contractSubjectToFinance: "",
      lenderName: "",
      workPeriodDays: "",
      anticipatedCommWeek: "",
      inclementWeatherDays: "",
      weekendDays: "",
    },
    accessSiteConditions: {
      accessVideoProvided: "",
      minAccessWidthMm: "",
      minAccessHeightMm: "",
      craneRequired: "",
      minCraneClearanceMm: "",
      fencesInAccessPath: "",
    },
    sitePreparationExcavation: {
      treesOrWallsRemovalNeeded: "",
      overburdenRemovalResp: "",
      excavationRequiredBy: "",
      excavationMethod: "",
      serviceLinesRelocationNeeded: "",
      serviceLinesRelocatedBy: "",
      excavatedMaterialLeftOnSite: "",
      excavatedMaterialRemoved: "",
      excavatedMaterialRemovedBy: "",
    },
    responsibilities: {
      fenceRemovalBy: "",
      fenceReinstatementBy: "",
      treeRemovalBy: "",
      treeReinstatementBy: "",
    },
    safetyTemporaryWorks: {
      tempPoolSafetyBarrier: "",
      tempSafetyBarrierType: "",
      powerConnectionProvided: "",
      hardCoverRequired: "",
      permPoolSafetyBarrier: "",
      tempFenceProvided: "",
    },
    extraCostRiskFlags: DEFAULT_EXTRA_COST_RISK_FLAGS,
    ownerSuppliedItems: {
      ownerSuppliedItem1: "",
      ownerSuppliedItem2: "",
    },
    siteDueDiligenceNotes: {
      mattersAffectingSiteByd: "",
      mattersAffectingSiteOwner: "",
    },
    specialWorkInstructions: {
      extraOrSpecialWork: "",
    },
    surveyReference: {
      datumPoint: "",
    },
    inclusions: DEFAULT_CONTRACT_INCLUSIONS,
  });

  // Section update handlers
  const updateContractBasics = (data: ContractBasics) => {
    setFormData(prev => ({ ...prev, contractBasics: data }));
  };

  const updateAccessSiteConditions = (data: AccessSiteConditions) => {
    setFormData(prev => ({ ...prev, accessSiteConditions: data }));
  };

  const updateSitePreparationExcavation = (data: SitePreparationExcavation) => {
    setFormData(prev => ({ ...prev, sitePreparationExcavation: data }));
  };

  const updateResponsibilities = (data: Responsibilities) => {
    setFormData(prev => ({ ...prev, responsibilities: data }));
  };

  const updateSafetyTemporaryWorks = (data: SafetyTemporaryWorks) => {
    setFormData(prev => ({ ...prev, safetyTemporaryWorks: data }));
  };

  const updateExtraCostRiskFlags = (data: ExtraCostRiskFlags) => {
    setFormData(prev => ({ ...prev, extraCostRiskFlags: data }));
  };

  const updateOwnerSuppliedItems = (data: OwnerSuppliedItems) => {
    setFormData(prev => ({ ...prev, ownerSuppliedItems: data }));
  };

  const updateSiteDueDiligenceNotes = (data: SiteDueDiligenceNotes) => {
    setFormData(prev => ({ ...prev, siteDueDiligenceNotes: data }));
  };

  const updateSpecialWorkInstructions = (data: SpecialWorkInstructions) => {
    setFormData(prev => ({ ...prev, specialWorkInstructions: data }));
  };

  const updateSurveyReference = (data: SurveyReference) => {
    setFormData(prev => ({ ...prev, surveyReference: data }));
  };

  const updateInclusions = (data: ContractInclusions) => {
    setFormData(prev => ({ ...prev, inclusions: data }));
  };

  // Placeholder save handlers - replace with actual database saves later
  const handleSaveContractBasics = () => {
    console.log("Saving Contract Basics:", formData.contractBasics);
    // TODO: Implement database save
  };

  const handleSaveAccessSiteConditions = () => {
    console.log("Saving Access Site Conditions:", formData.accessSiteConditions);
    // TODO: Implement database save
  };

  const handleSaveSitePreparationExcavation = () => {
    console.log("Saving Site Preparation Excavation:", formData.sitePreparationExcavation);
    // TODO: Implement database save
  };

  const handleSaveResponsibilities = () => {
    console.log("Saving Responsibilities:", formData.responsibilities);
    // TODO: Implement database save
  };

  const handleSaveSafetyTemporaryWorks = () => {
    console.log("Saving Safety Temporary Works:", formData.safetyTemporaryWorks);
    // TODO: Implement database save
  };

  const handleSaveExtraCostRiskFlags = () => {
    console.log("Saving Extra Cost Risk Flags:", formData.extraCostRiskFlags);
    // TODO: Implement database save
  };

  const handleSaveOwnerSuppliedItems = () => {
    console.log("Saving Owner Supplied Items:", formData.ownerSuppliedItems);
    // TODO: Implement database save
  };

  const handleSaveSiteDueDiligenceNotes = () => {
    console.log("Saving Site Due Diligence Notes:", formData.siteDueDiligenceNotes);
    // TODO: Implement database save
  };

  const handleSaveSpecialWorkInstructions = () => {
    console.log("Saving Special Work Instructions:", formData.specialWorkInstructions);
    // TODO: Implement database save
  };

  const handleSaveSurveyReference = () => {
    console.log("Saving Survey Reference:", formData.surveyReference);
    // TODO: Implement database save
  };

  const handleSaveInclusions = () => {
    console.log("Saving Inclusions:", formData.inclusions);
    // TODO: Implement database save
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading customer data...</p>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="contract" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Customer Details
        </TabsTrigger>
        <TabsTrigger value="contractsummary" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Contract Summary
        </TabsTrigger>
        <TabsTrigger value="basics" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Contract Basics
        </TabsTrigger>
        <TabsTrigger value="site" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Site Details
        </TabsTrigger>
        <TabsTrigger value="safety" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Safety & Temporary Works
        </TabsTrigger>
        <TabsTrigger value="risks" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Extra Cost Risks
        </TabsTrigger>
        <TabsTrigger value="special" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Special Considerations
        </TabsTrigger>
        <TabsTrigger value="inclusions" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Inclusions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contract">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Selected Customer</h2>
          
          {/* Proposal Selection Card - only show if no customerId provided */}
          {!customerId && (
            <Card className="p-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Proposal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Accepted Proposal</label>
                    <Select value={selectedProposalId} onValueChange={handleProposalSelect}>
                      <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Choose a proposal to create contract" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {proposalsLoading || snapshotsLoading ? (
                          <SelectItem value="loading" disabled>Loading proposals...</SelectItem>
                        ) : acceptedProposals.length === 0 ? (
                          <SelectItem value="none" disabled>No accepted proposals available</SelectItem>
                        ) : (
                          acceptedProposals.map((proposal) => (
                            <SelectItem key={proposal.id} value={proposal.id}>
                              {proposal.proposal_name} - {proposal.owner1}{proposal.owner2 ? ` & ${proposal.owner2}` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedProposalId && (
                    <Button 
                      onClick={handleConfirmSelection}
                      className="w-full max-w-md"
                    >
                      Confirm Selection
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
          
          {/* Selected Proposal Info Card - show when customerId is provided */}
          {customerId && selectedProposal && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900">Selected Proposal:</p>
                  <p className="text-blue-800">{selectedProposal.proposal_name} - {selectedProposal.owner1}{selectedProposal.owner2 ? ` & ${selectedProposal.owner2}` : ''}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleSelectAnotherCustomer}
                  className="w-full max-w-md"
                >
                  Select Another Customer
                </Button>
              </div>
            </Card>
          )}
          
          {/* Customer Information Card - only show when customer is selected */}
          {customerId && selectedProposal && (
            <Card className="p-6">
              <div className="space-y-6">
                {/* Toggle for contract signatory details */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-900">
                      Contract signatory details differ from the Proposal?
                    </label>
                    <p className="text-xs text-blue-700">
                      Enable editing if the contract signatory details need to be different from the proposal
                    </p>
                  </div>
                  <Switch
                    checked={contractSignatoryDiffers}
                    onCheckedChange={setContractSignatoryDiffers}
                  />
                </div>
                
                <CustomerInformationSection 
                  existingCustomer={selectedProposal}
                  readonly={!contractSignatoryDiffers}
                />
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Contract Basics Tab */}
      <TabsContent value="basics">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <ContractBasicsSection
              data={formData.contractBasics}
              onChange={updateContractBasics}
              onSave={handleSaveContractBasics}
            />
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete the contract basics."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Site Details Tab */}
      <TabsContent value="site">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <>
              <AccessSiteConditionsSection
                data={formData.accessSiteConditions}
                onChange={updateAccessSiteConditions}
                onSave={handleSaveAccessSiteConditions}
              />
              <SitePreparationExcavationSection
                data={formData.sitePreparationExcavation}
                onChange={updateSitePreparationExcavation}
                onSave={handleSaveSitePreparationExcavation}
              />
              <ResponsibilitiesSection
                data={formData.responsibilities}
                onChange={updateResponsibilities}
                onSave={handleSaveResponsibilities}
              />
              <SiteDueDiligenceSection
                data={formData.siteDueDiligenceNotes}
                onChange={updateSiteDueDiligenceNotes}
                onSave={handleSaveSiteDueDiligenceNotes}
              />
              <SurveyReferenceSection
                data={formData.surveyReference}
                onChange={updateSurveyReference}
                onSave={handleSaveSurveyReference}
              />
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete the site details."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Safety and Temporary Works Tab */}
      <TabsContent value="safety">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <SafetyTemporaryWorksSection
              data={formData.safetyTemporaryWorks}
              onChange={updateSafetyTemporaryWorks}
              onSave={handleSaveSafetyTemporaryWorks}
            />
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete safety and temporary works details."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Extra Cost Risks Tab */}
      <TabsContent value="risks">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <ExtraCostRiskFlagsSection
              data={formData.extraCostRiskFlags}
              onChange={updateExtraCostRiskFlags}
              onSave={handleSaveExtraCostRiskFlags}
            />
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete extra cost risk assessment."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Special Considerations Tab */}
      <TabsContent value="special">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <>
              <SpecialWorkInstructionsSection
                data={formData.specialWorkInstructions}
                onChange={updateSpecialWorkInstructions}
                onSave={handleSaveSpecialWorkInstructions}
              />
              <OwnerSuppliedItemsSection
                data={formData.ownerSuppliedItems}
                onChange={updateOwnerSuppliedItems}
                onSave={handleSaveOwnerSuppliedItems}
              />
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete special considerations."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Inclusions Tab */}
      <TabsContent value="inclusions">
        <div className="space-y-6">
          {customerId && selectedProposal && contractDetailsConfirmed ? (
            <InclusionsSection
              data={formData.inclusions}
              onChange={updateInclusions}
              onSave={handleSaveInclusions}
            />
          ) : (
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {!customerId || !selectedProposal 
                      ? "No Customer Selected" 
                      : "Contract Details Not Confirmed"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!customerId || !selectedProposal 
                      ? "Please select a customer to complete inclusions and exclusions."
                      : "Please confirm the contract customer details before proceeding."
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>


      <TabsContent value="contractsummary">
        <Card className="p-6">
          {selectedProposal ? (
            <ContractSummary 
              snapshot={customerSnapshot} 
              showMargins={false} 
            />
          ) : (
            <div className="text-center space-y-4">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No Customer Selected</h3>
                <p className="text-muted-foreground">
                  Please select a customer to view the contract summary.
                </p>
              </div>
            </div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};