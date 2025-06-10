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
  contractSummaryGrandTotal: number;
  // Pool Shell Supply breakdown
  equipmentOnly: number;
  shellValueInContract: number;
  // Pool Shell Installation breakdown
  craneCost: number;
  trafficControlInstallationCost: number;
  installFeeCost: number;
  peaGravelBackfillCost: number;
  // Excavation breakdown
  excavationTotal: number;
  bobcatCost: number;
  customSiteRequirementsCost: number;
  // Engineered Beam breakdown
  beamCost: number;
  // Extra Concreting breakdown
  extraConcretingCost: number;
  // Paving / Coping breakdown
  extraPavingCost: number;
  existingPavingCost: number;
  concretePumpCost: number;
  underFenceConcreteStripsCost: number;
  copingSupplyCost: number;
  copingLayCost: number;
  concreteCutsCopingCost: number;
  // Paving breakdown components
  pavingCopingCost: number;
  pavingLayingCost: number;
  pavingAndConcretingLayingTotal: number;
  pavingOnExistingConcreteLayingTotal: number;
  // Retaining Walls / Water Feature breakdown
  retainingWallsCost: number;
  waterFeatureCost: number;
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
  const { contractGrandTotal, totals, basePoolBreakdown } = usePriceCalculator(snapshot);

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
          contractSummaryGrandTotal: 0,
          equipmentOnly: 0,
          shellValueInContract: 0,
          craneCost: 0,
          trafficControlInstallationCost: 0,
          installFeeCost: 0,
          peaGravelBackfillCost: 0,
          excavationTotal: 0,
          bobcatCost: 0,
          customSiteRequirementsCost: 0,
          beamCost: 0,
          extraConcretingCost: 0,
          extraPavingCost: 0,
          existingPavingCost: 0,
          concretePumpCost: 0,
          underFenceConcreteStripsCost: 0,
          copingSupplyCost: 0,
          copingLayCost: 0,
          concreteCutsCopingCost: 0,
          retainingWallsCost: 0,
          waterFeatureCost: 0,
          pavingCopingCost: 0,
          pavingLayingCost: 0,
          pavingAndConcretingLayingTotal: 0,
          pavingOnExistingConcreteLayingTotal: 0,
        }
      };
    }
    // ==================================================================================
    // 1. DEPOSIT COMPONENTS (Calculated Later)
    // ==================================================================================
    // Get HWI insurance cost based on contract grand total
    const hwiCost = getHWIInsuranceCost(contractGrandTotal);
    
    // Get Form 15 cost from fixed costs
    const form15Item = snapshot.fixed_costs_json?.find(fc => fc.name === "Form 15");
    const form15Cost = form15Item ? parseFloat(form15Item.price) : 0;
    

    // ==================================================================================
    // 2. POOL SHELL SUPPLY CALCULATION
    // ==================================================================================
    // Get base pool total from use-calculator-totals.ts
    const basePoolTotal = totals.basePoolTotal;

    // Calculate value displayed in contract (correlating snapshot values)
    const form15Price = form15Item ? parseFloat(form15Item.price) : 0;
    
    const excavationTotal = basePoolBreakdown.digCost;
    
    // Calculate Handover cost from fixed costs
    const handoverItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Handover" || fc.name.includes("Handover"));
    const handoverCost = handoverItem ? parseFloat(handoverItem.price) : 0;

    // Find Temporary Safety Barrier from fixed costs
    const tempSafetyBarrierItem = snapshot.fixed_costs_json?.find(fc => fc.name.includes("Temporary Safety Barrier") || fc.name.includes("Safety Barrier"));
    const tempSafetyBarrierCost = tempSafetyBarrierItem ? parseFloat(tempSafetyBarrierItem.price) : 0;

    const valueDisplayedInContract = 
      (snapshot.pc_pea_gravel || 0) + // Pea Gravel/Backfill
      basePoolBreakdown.craneAllowance + // Crane allowance ($700)
      (snapshot.pc_install_fee || 0) + // Install Fee
      (snapshot.pc_coping_supply || 0) + // Supply Coping
      (snapshot.pc_beam || 0) + // BEAM Fixed
      (snapshot.pc_coping_lay || 0) + // Lay Pavers
      tempSafetyBarrierCost + // Temporary Safety Barrier
      form15Price + // Council/Form 15
      excavationTotal + // Excavation
      handoverCost; // Handover

    // Get equipment extras total from use-calculator-totals.ts
    const equipmentOnly = totals.extrasTotal;

    // Calculate shell value in contract: (RRP/Web Price - $ Displayed in Contract) + Temporary Safety Barrier
    const shellValueInContract = (basePoolTotal - valueDisplayedInContract) + tempSafetyBarrierCost;
    
    // Calculate pool shell supply equipment total: Equipment + Shell Value In Contract
    const poolShellSupplyEquipmentTotal = equipmentOnly + shellValueInContract;

    // ==================================================================================
    // 3. POOL SHELL INSTALLATION CALCULATION
    // ==================================================================================
    // Calculate Pool Shell Installation components from snapshot
    // Note: $700 crane allowance is already included in basePoolTotal with margin
    // Only the excess over $700 should be added here, with margin applied
    const marginMultiplier = 1 / (1 - (snapshot.pool_margin_pct || 0) / 100);
    const craneCost = ((snapshot.crane_cost || 0) > 700 ? (snapshot.crane_cost || 0) - 700 : 0) * marginMultiplier;
    const trafficControlInstallationCost = (snapshot.traffic_control_cost || 0) * marginMultiplier;
    const installFeeCost = snapshot.pc_install_fee || 0; // Install fee from individual pool costs
    const peaGravelBackfillCost = snapshot.pc_pea_gravel || 0;

    // Calculate Pool Shell Installation total
    const poolShellInstallationTotal = craneCost + trafficControlInstallationCost + installFeeCost + peaGravelBackfillCost;

    // ==================================================================================
    // 4. EXCAVATION CALCULATION
    // ==================================================================================
    // Calculate Excavation components from snapshot
    // Apply margin to site requirements to match proposal calculator logic
    const bobcatCost = (snapshot.bobcat_cost || 0) * marginMultiplier;
    
    // Calculate custom site requirements cost from site_requirements_data
    const customSiteRequirementsCostRaw = snapshot.site_requirements_data 
      ? (typeof snapshot.site_requirements_data === 'string'
         ? JSON.parse(snapshot.site_requirements_data)
         : snapshot.site_requirements_data).reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0)
      : 0;
    const customSiteRequirementsCost = customSiteRequirementsCostRaw * marginMultiplier;

    // Calculate total Excavation cost
    const excavationContractTotal = excavationTotal + bobcatCost + customSiteRequirementsCost;

    // ==================================================================================
    // 5. ENGINEERED BEAM CALCULATION
    // ==================================================================================
    // Calculate Engineered Beam cost from snapshot
    const beamCost = snapshot.pc_beam || 0;

    // ==================================================================================
    // 6. EXTRA CONCRETING CALCULATION
    // ==================================================================================
    // Calculate Extra Concreting components from snapshot
    const extraConcretingCost = snapshot.extra_concreting_cost || 0;

    // Calculate total Extra Concreting cost (just extra concreting, no cuts)
    const extraConcretingTotal = extraConcretingCost;

    // ==================================================================================
    // 7. PAVING / COPING CALCULATION
    // ==================================================================================
    // Calculate Paving / Coping components from snapshot
    const extraPavingCost = snapshot.extra_paving_cost || 0;
    const existingPavingCost = snapshot.existing_paving_cost || 0;
    const concretePumpCost = snapshot.concrete_pump_total_cost || 0;
    const underFenceConcreteStripsCost = snapshot.uf_strips_cost || 0;
    const copingSupplyCost = snapshot.pc_coping_supply || 0;
    const copingLayCost = snapshot.pc_coping_lay || 0;
    const concreteCutsCopingCost = snapshot.concrete_cuts_cost || 0; // Same as concreteCutsCost but for paving section

    // Calculate Paving / Coping cost using specified components:
    // "Supply Coping" + "Paving and Concreting Total" + "Concrete Pump Total" + "Paving On Existing Concrete Total" + "Under Fence Concrete Total"
    const pavingCopingCost = copingSupplyCost + extraPavingCost + concretePumpCost + existingPavingCost + underFenceConcreteStripsCost;

    // Calculate Paving / Laying cost using specified components:
    // "Paving and Concreting Laying Total (Sqm * 130)" + "Concrete Cuts Total" + "Lay Pavers" + "Paving on Existing Concrete Laying Total (Sqm * 130)"
    const pavingAndConcretingLayingTotal = (snapshot.extra_paving_sqm || 0) * 130;
    const concreteCutsTotal = concreteCutsCopingCost; // concrete_cuts_cost (covers both round pool cuts and diagonal cuts)
    const layPaversTotal = copingLayCost; // pc_coping_lay
    const pavingOnExistingConcreteLayingTotal = (snapshot.existing_paving_sqm || 0) * 130;
    
    const pavingLayingCost = pavingAndConcretingLayingTotal + concreteCutsTotal + layPaversTotal + pavingOnExistingConcreteLayingTotal;

    // Calculate total Paving cost (Coping + Laying)
    const pavingTotal = pavingCopingCost + pavingLayingCost;

    // ==================================================================================
    // 8. RETAINING WALLS / WATER FEATURE CALCULATION
    // ==================================================================================
    // Get Retaining Walls / Water Feature totals from use-calculator-totals.ts
    const retainingWallsCost = totals.retainingWallsTotal;
    const waterFeatureCost = totals.waterFeatureTotal;

    // Calculate total Retaining Walls / Water Feature cost
    const retainingWallsWaterFeatureTotal = retainingWallsCost + waterFeatureCost;

    // ==================================================================================
    // 9. SPECIAL INCLUSIONS CALCULATION (Currently 0)
    // ==================================================================================
    // TODO: Replace with actual calculation when requirements are defined

    // ==================================================================================
    // 10. HANDOVER CALCULATION (Already calculated above in section 2)
    // ==================================================================================
    // handoverCost is calculated from fixed costs in section 2

    // ==================================================================================
    // CONTRACT SUMMARY GRAND TOTAL CALCULATION
    // ==================================================================================
    // Calculate Contract Summary Grand Total (sum of all contract line item subtotals)
    const contractSummaryGrandTotal = 
      form15Cost +
      hwiCost +
      poolShellSupplyEquipmentTotal + 
      poolShellInstallationTotal + 
      excavationContractTotal + 
      beamCost + 
      extraConcretingTotal + 
      pavingTotal + 
      retainingWallsWaterFeatureTotal + 
      0 + // specialInclusions (currently 0)
      handoverCost;

    // ==================================================================================
    // 11. DEPOSIT CALCULATION
    // ==================================================================================
    
    // Calculate deposit as simply 10% of contract summary grand total
    const totalDeposit = contractSummaryGrandTotal * 0.1;

    const deposit: DepositBreakdown = {
      hwiCost,
      form15Cost,
      depositRemainder: 0, // No longer calculating remainder
      totalDeposit
    };

    // ==================================================================================
    // CONTRACT DATA ASSEMBLY
    // ==================================================================================
    // Calculate contract summary data using actual calculated values
    const contractData: ContractSummaryData = {
      // 1. DEPOSIT
      deposit: totalDeposit,
      
      // 2. POOL SHELL SUPPLY: Equipment + Shell Value In Contract
      poolShellSupply: poolShellSupplyEquipmentTotal,
      
      // 3. POOL SHELL INSTALLATION: Crane + Traffic Control + Install Fee + Pea Gravel
      poolShellInstallation: poolShellInstallationTotal,
      
      // 4. EXCAVATION: Excavation + Bobcat + Custom Site Requirements
      excavation: excavationContractTotal,
      
      // 5. ENGINEERED BEAM: pc_beam from variable costs
      engineeredBeam: beamCost,
      
      // 6. EXTRA CONCRETING: Extra Concreting only (no cuts)
      extraConcreting: extraConcretingTotal,
      
      // 7. PAVING / COPING: Extra Paving + Existing Paving + Concrete Pump + Under-fence Strips + Coping Supply + Coping Lay + Concrete Cuts
      pavingCoping: pavingTotal,
      
      // 8. RETAINING WALLS / WATER FEATURE: Retaining Walls + Water Feature
      retainingWalls: retainingWallsWaterFeatureTotal,
      
      // 9. SPECIAL INCLUSIONS: Currently 0
      specialInclusions: 0,
      
      // 10. HANDOVER: Handover cost from fixed costs
      handover: handoverCost,
      
      // CONTRACT SUMMARY GRAND TOTAL: Sum of all contract line item subtotals
      contractSummaryGrandTotal,
      equipmentOnly,
      shellValueInContract,
      craneCost,
      trafficControlInstallationCost,
      installFeeCost,
      peaGravelBackfillCost,
      excavationTotal,
      bobcatCost,
      customSiteRequirementsCost,
      beamCost,
      extraConcretingCost,
      extraPavingCost,
      existingPavingCost,
      concretePumpCost,
      underFenceConcreteStripsCost,
      copingSupplyCost,
      copingLayCost,
      concreteCutsCopingCost,
      retainingWallsCost,
      waterFeatureCost,
      pavingCopingCost,
      pavingLayingCost,
      pavingAndConcretingLayingTotal,
      pavingOnExistingConcreteLayingTotal,
    };

    const result = {
      deposit,
      contractData
    };
    
    console.log('✅ useContractSummaryLineItems result:', result);
    
    return result;
  }, [snapshot, contractGrandTotal]);
}