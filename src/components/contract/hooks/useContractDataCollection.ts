/**
 * Hook for collecting all contract-related data from multiple sources
 * Aggregates data from various hooks and sources to build complete contract payload
 */
import { useState, useCallback } from 'react';
import type { ProposalSnapshot } from '@/types/snapshot';
import type { PoolProject } from '@/types/pool';
import { useContractSummaryLineItems } from '@/hooks/calculations/useContractSummaryLineItems';
import { usePriceCalculator } from '@/hooks/calculations/use-calculator-totals';
import { useContractBasics } from './useContractBasics';
import { useContractSiteDetails } from './useContractSiteDetails';
import { useContractSafety } from './useContractSafety';
import { useContractExtraCosts } from './useContractExtraCosts';
import { useContractSpecialWork } from './useContractSpecialWork';
import { useContractInclusions } from './useContractInclusions';
import { useContractCustomerDetails } from './useContractCustomerDetails';

export interface ContractDataPayload {
  // Customer Information
  customer: {
    id: string;
    owner1: string;
    owner2?: string;
    phone: string;
    email: string;
    home_address: string;
    site_address?: string;
    installation_area?: string;
    proposal_name?: string;
    resident_homeowner: boolean;
  };
  
  // Financial Summary
  financials: {
    contract_grand_total: number;
    contract_total_excluding_hwi: number;
    deposit_total: number;
    pc_contract_bod: number;
    fire_ant_cost: number;
    hwi_cost: number;
    form15_cost: number;
    deposit_remainder: number;
    pool_shell_supply_total: number;
    excavation_total: number;
    pool_shell_installation_total: number;
    pc_shell_install_crane_hire: number;
    pc_shell_install_backfill: number;
    pc_shell_install_remainder: number;
    pc_paving_coping_supply: number;
    pc_paving_laying: number;
    retaining_walls_cost: number;
    water_feature_cost: number;
    total_delays: number;
    interest_rate: number;
    beam_cost: number;
    extra_concreting_total: number;
    paving_total: number;
    retaining_walls_water_feature_total: number;
    special_inclusions: number;
    handover_total: number;
    // PCI (Prime Cost Items) breakdown
    pci_1_description: string;
    pci_1_rate: number;
    pci_1_qty: number;
    pci_1_allowance: number;
    pci_2_description: string;
    pci_2_rate: number;
    pci_2_qty: number;
    pci_2_allowance: number;
    pci_total: number;
    margin_applied_temp_safety_barrier_cost: number;
  };
  
  // Contract Q&A Data (will be populated later)
  contract_qa: {
    contract_basics?: any;
    site_details?: any;
    safety_temporary_works?: any;
    extra_cost_risks?: any;
    special_work_instructions?: any;
    owner_supplied_items?: any;
    inclusions_exclusions?: any;
    customer_details?: any;
  };
  
  // Snapshot Data (raw proposal data)
  snapshot: ProposalSnapshot | null;
  
  // Metadata
  metadata: {
    submission_timestamp: string;
    submission_type: 'contract'; // vs 'proposal'
    version: string;
  };
}

export function useContractDataCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  
  // Import all contract hooks (these will be used to load data)
  const { loadContractBasics } = useContractBasics();
  const { loadContractSiteDetails } = useContractSiteDetails();
  const { loadContractSafety } = useContractSafety();
  const { loadContractExtraCosts } = useContractExtraCosts();
  const { loadContractSpecialWork } = useContractSpecialWork();
  const { loadContractInclusions } = useContractInclusions();
  const { loadContractCustomerDetails } = useContractCustomerDetails();

  /**
   * Collect all contract data from various sources
   */
  const collectContractData = useCallback(async (
    customer: PoolProject,
    snapshot: ProposalSnapshot | null,
    lineItems: any,
    calculatorData: any
  ): Promise<ContractDataPayload> => {
    setIsCollecting(true);
    
    try {
      console.log('🔍 Starting contract data collection for customer:', customer.id);
      
      // Prepare customer data
      const customerData = {
        id: customer.id,
        owner1: customer.owner1,
        owner2: customer.owner2 || undefined,
        phone: customer.phone,
        email: customer.email,
        home_address: customer.home_address,
        site_address: customer.site_address || undefined,
        installation_area: customer.installation_area || undefined,
        proposal_name: customer.proposal_name || undefined,
        resident_homeowner: customer.resident_homeowner || false,
      };
      
      // Prepare financial data
      const financialData = {
        contract_grand_total: lineItems?.contractSummaryGrandTotal || 0,
        contract_total_excluding_hwi: lineItems?.contractTotalExcludingHWI || 0,
        deposit_total: lineItems?.totalDeposit || 0,
        pc_contract_bod: lineItems?.pcContractBOD || 0,
        fire_ant_cost: lineItems?.deposit?.fireAntCost || 0,
        hwi_cost: lineItems?.deposit?.hwiCost || 0,
        form15_cost: lineItems?.deposit?.form15Cost || 0,
        deposit_remainder: lineItems?.deposit?.depositRemainder || 0,
        pool_shell_supply_total: lineItems?.poolShellSupplyEquipmentTotal || 0,
        excavation_total: lineItems?.excavationContractTotal || 0,
        pool_shell_installation_total: lineItems?.poolShellInstallationTotal || 0,
        pc_shell_install_crane_hire: lineItems?.pcShellInstallCraneHire || 0,
        pc_shell_install_backfill: lineItems?.pcShellInstallBackfill || 0,
        pc_shell_install_remainder: lineItems?.pcShellInstallRemainder || 0,
        pc_paving_coping_supply: lineItems?.marginAppliedPcCopingSupply || 0,
        pc_paving_laying: (lineItems?.marginAppliedPcCopingLay || 0) + (lineItems?.extraPaving || 0),
        retaining_walls_cost: lineItems?.retainingWallsCost || 0,
        water_feature_cost: lineItems?.waterFeatureCost || 0,
        total_delays: 0, // Will be populated from contract_qa.contract_basics
        interest_rate: 0, // Will be populated from contract_qa.contract_basics
        beam_cost: lineItems?.beamCost || 0,
        extra_concreting_total: lineItems?.extraConcretingTotal || 0,
        paving_total: lineItems?.pavingTotal || 0,
        retaining_walls_water_feature_total: lineItems?.retainingWallsWaterFeatureTotal || 0,
        special_inclusions: lineItems?.specialInclusions || 0,
        handover_total: lineItems?.handoverTotal || 0,
        margin_applied_temp_safety_barrier_cost: lineItems?.marginAppliedTempSafetyBarrierCost || 0,
        // PCI (Prime Cost Items) breakdown - will be calculated from snapshot data
        pci_1_description: "",
        pci_1_rate: 0,
        pci_1_qty: 0,
        pci_1_allowance: 0,
        pci_2_description: "",
        pci_2_rate: 0,
        pci_2_qty: 0,
        pci_2_allowance: 0,
        pci_total: 0,
        margin_applied_temp_safety_barrier_cost: 0,
      };
      
      // Load contract Q&A data from all sections
      console.log('📋 Loading contract Q&A data...');
      
      const contractQAData = {
        contract_basics: await loadContractBasics(customer.id).catch(err => {
          console.warn('Failed to load contract basics:', err);
          return null;
        }),
        site_details: await loadContractSiteDetails(customer.id).catch(err => {
          console.warn('Failed to load site details:', err);
          return null;
        }),
        safety_temporary_works: await loadContractSafety(customer.id).catch(err => {
          console.warn('Failed to load safety data:', err);
          return null;
        }),
        extra_cost_risks: await loadContractExtraCosts(customer.id).catch(err => {
          console.warn('Failed to load extra costs:', err);
          return null;
        }),
        special_work_instructions: await loadContractSpecialWork(customer.id).catch(err => {
          console.warn('Failed to load special work:', err);
          return null;
        }),
        inclusions_exclusions: await loadContractInclusions(customer.id).catch(err => {
          console.warn('Failed to load inclusions:', err);
          return null;
        }),
        customer_details: await loadContractCustomerDetails(customer.id).catch(err => {
          console.warn('Failed to load customer details:', err);
          return null;
        }),
      };
      
      // Prepare metadata
      const metadata = {
        submission_timestamp: new Date().toISOString(),
        submission_type: 'contract' as const,
        version: '1.0.0',
      };
      
      // Update financials with total_delays and interest_rate from contract_qa
      if (contractQAData.contract_basics?.total_delays !== undefined) {
        financialData.total_delays = contractQAData.contract_basics.total_delays;
      }
      if (contractQAData.contract_basics?.interest_rate !== undefined) {
        financialData.interest_rate = contractQAData.contract_basics.interest_rate;
      }
      
      // Calculate PCI (Prime Cost Items) breakdown from snapshot data
      if (snapshot) {
        // PCI-1: Coping Supply (always quantity 1)
        const pci1Rate = snapshot.pc_coping_supply || 0;
        financialData.pci_1_description = "Coping Supply";
        financialData.pci_1_rate = pci1Rate;
        financialData.pci_1_qty = 1;
        financialData.pci_1_allowance = pci1Rate * 1;
        
        // PCI-2: Paving per sqm (weighted average of extra and existing paving)
        const extraPavingSqm = snapshot.extra_paving_sqm || 0;
        const existingPavingSqm = snapshot.existing_paving_sqm || 0;
        const extraPavingCost = snapshot.extra_paving_cost || 0;
        const existingPavingCost = snapshot.existing_paving_cost || 0;
        
        const totalPavingSqm = extraPavingSqm + existingPavingSqm;
        const totalPavingCost = extraPavingCost + existingPavingCost;
        
        if (totalPavingSqm > 0) {
          const weightedAverageRate = totalPavingCost / totalPavingSqm;
          financialData.pci_2_description = "Paving per sqm";
          financialData.pci_2_rate = weightedAverageRate;
          financialData.pci_2_qty = totalPavingSqm;
          financialData.pci_2_allowance = totalPavingCost;
        } else {
          // No paving data available
          financialData.pci_2_description = "Paving per sqm";
          financialData.pci_2_rate = 0;
          financialData.pci_2_qty = 0;
          financialData.pci_2_allowance = 0;
        }
        
        // PCI Total: Sum of both allowances
        financialData.pci_total = financialData.pci_1_allowance + financialData.pci_2_allowance;
      }
      
      const payload: ContractDataPayload = {
        customer: customerData,
        financials: financialData,
        contract_qa: contractQAData,
        snapshot,
        metadata,
      };
      
      console.log('✅ Contract data collection complete:', payload);
      
      return payload;
      
    } catch (error) {
      console.error('❌ Error collecting contract data:', error);
      throw error;
    } finally {
      setIsCollecting(false);
    }
  }, [
    loadContractBasics,
    loadContractSiteDetails,
    loadContractSafety,
    loadContractExtraCosts,
    loadContractSpecialWork,
    loadContractInclusions,
    loadContractCustomerDetails
  ]);

  return {
    collectContractData,
    isCollecting,
  };
}