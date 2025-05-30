/**
 * File: src/hooks/calculations/useContractSummaryLineItems.ts
 * 
 * Hook for calculating contract summary line items based on business logic
 * Calculates deposit and other line items from proposal snapshot data
 */
import { useMemo } from 'react';
import type { ProposalSnapshot } from '@/types/snapshot';
import { usePriceCalculator } from './use-calculator-totals';
import { getHWIInsuranceCost } from '@/types/hwi-insurance';

export interface DepositBreakdown {
  hwiCost: number;
  form15Cost: number;
  depositRemainder: number;
  totalDeposit: number;
}

export interface ContractSummaryData {
  deposit: number;
  poolShellSupply: number;
  poolShellInstallation: number;
  excavation: number;
  engineeredBeam: number;
  extraConcreting: number;
  pavingCoping: number;
  retainingWalls: number;
  specialInclusions: number;
  handover: number;
  extrasUpgradesEquipment: number;
}

export interface ContractSummaryLineItems {
  deposit: DepositBreakdown;
  contractData: ContractSummaryData;
}

/**
 * Hook for calculating contract summary line items
 * 
 * @param snapshot - The proposal snapshot containing all pricing data
 * @returns Calculated line items for contract summary
 */
export function useContractSummaryLineItems(snapshot: ProposalSnapshot | null | undefined): ContractSummaryLineItems {
  const { contractGrandTotal } = usePriceCalculator(snapshot);

  console.log('🔥 useContractSummaryLineItems hook fired', { 
    snapshot: !!snapshot, 
    contractGrandTotal,
    snapshotId: snapshot?.project_id,
    fixed_costs_json: snapshot?.fixed_costs_json 
  });

  return useMemo(() => {
    console.log('📊 useContractSummaryLineItems memoization triggered', { snapshot: !!snapshot, contractGrandTotal });
    // Handle null/undefined snapshot
    if (!snapshot) {
      return {
        deposit: {
          hwiCost: 0,
          form15Cost: 0,
          depositRemainder: 0,
          totalDeposit: 0
        },
        contractData: {
          deposit: 0,
          poolShellSupply: 0,
          poolShellInstallation: 0,
          excavation: 0,
          engineeredBeam: 0,
          extraConcreting: 0,
          pavingCoping: 0,
          retainingWalls: 0,
          specialInclusions: 0,
          handover: 0,
          extrasUpgradesEquipment: 0,
        }
      };
    }
    // Get HWI insurance cost based on contract grand total
    const hwiCost = getHWIInsuranceCost(contractGrandTotal);
    
    // Get Form 15 cost from fixed costs
    const form15Item = snapshot.fixed_costs_json?.find(fc => fc.name === "Form 15");
    const form15Cost = form15Item ? parseFloat(form15Item.price) : 0;
    
    // Calculate deposit remainder: (10% * ContractGrandTotal) - (Form 15 + HWI Costs)
    const tenPercentOfTotal = contractGrandTotal * 0.1;
    const depositRemainder = tenPercentOfTotal - (form15Cost + hwiCost);
    
    // Total deposit = HWI + Form 15 + Remainder (which equals 10% of contract total)
    const totalDeposit = hwiCost + form15Cost + depositRemainder;

    const deposit: DepositBreakdown = {
      hwiCost,
      form15Cost,
      depositRemainder,
      totalDeposit
    };

    // Calculate value displayed in contract (correlating snapshot values)
    const form15Price = form15Item ? parseFloat(form15Item.price) : 0;
    
    const excavationTotal = ((snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0)) + 
                           ((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0));
    
    const handoverTotal = (snapshot.handover_components || []).reduce((sum: number, c: any) => 
      sum + ((c.hk_component_price_inc_gst || 0) * (c.hk_component_quantity || 0)), 0);

    const valueDisplayedInContract = 
      (snapshot.pc_pea_gravel || 0) + // Pea Gravel/Backfill
      (snapshot.crane_cost || 0) + // Crane
      (snapshot.pc_install_fee || 0) + // Install Fee
      (snapshot.pc_coping_supply || 0) + // Supply Coping
      (snapshot.pc_beam || 0) + // BEAM Fixed
      (snapshot.pc_coping_lay || 0) + // Lay Pavers
      form15Price + // Council/Form 15
      excavationTotal + // Excavation
      handoverTotal; // Handover

    // Calculate extras total (same calculation as in usePriceCalculator)
    const extrasUpgradesEquipment = 
      (snapshot.cleaner_included ? (snapshot.cleaner_unit_price || 0) : 0) +
      (snapshot.include_heat_pump ? ((snapshot.heat_pump_rrp || 0) + (snapshot.heat_pump_installation_cost || 0)) : 0) +
      (snapshot.include_blanket_roller ? ((snapshot.blanket_roller_rrp || 0) + (snapshot.blanket_roller_installation_cost || 0)) : 0) +
      (snapshot.extras_total_rrp || 0) +
      valueDisplayedInContract; // Adding value displayed in contract

    // Calculate contract summary data - using hardcoded dummy data for now
    // TODO: Replace with actual calculations from snapshot data
    const contractData: ContractSummaryData = {
      deposit: totalDeposit,
      poolShellSupply: 25000 + extrasUpgradesEquipment, // Adding extras to shell supply as partial sum
      poolShellInstallation: 8000,
      excavation: 12000,
      engineeredBeam: 3500,
      extraConcreting: 2500,
      pavingCoping: 8500,
      retainingWalls: 4500,
      specialInclusions: 1500,
      handover: 2000,
      extrasUpgradesEquipment,
    };

    const result = {
      deposit,
      contractData
    };
    
    console.log('✅ useContractSummaryLineItems result:', result);
    
    return result;
  }, [snapshot, contractGrandTotal]);
}