/**
 * File: src/hooks/calculations/useContractSummaryLineItems.ts
 * 
 * Hook for calculating contract summary line items based on business logic
 * Calculates deposit and other line items from proposal snapshot data
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ProposalSnapshot } from '@/types/snapshot';
import { usePriceCalculator } from './use-calculator-totals';
import { getHWIInsuranceCost } from '@/types/hwi-insurance';

export interface DepositBreakdown {
  fireAntCost: number;
  hwiCost: number;
  form15Cost: number;
  depositRemainder: number;
  totalDeposit: number;
}


export interface ContractSummaryLineItems {
  deposit: DepositBreakdown;
  // Section totals
  totalDeposit: number;
  pcContractBOD: number;
  poolShellSupplyEquipmentTotal: number;
  poolShellSupplyAfterDiscount: number;
  poolShellInstallationTotal: number;
  pcShellInstallCraneHire: number;
  pcShellInstallBackfill: number;
  pcShellInstallRemainder: number;
  excavationContractTotal: number;
  beamCost: number;
  extraConcretingTotal: number;
  pavingTotal: number;
  retainingWallsWaterFeatureTotal: number;
  specialInclusions: number;
  handoverTotal: number;
  contractSummaryGrandTotal: number;
  contractSummaryGrandTotalAfterDiscount: number;
  contractTotalExcludingHWI: number;
  totalDiscountAmount: number;
  // Breakdown values
  equipmentOnly: number;
  shellValueInContract: number;
  marginAppliedCraneCost: number;
  marginAppliedTrafficControlCost: number;
  marginAppliedPcInstallFee: number;
  marginAppliedPcPeaGravel: number;
  marginAppliedPipeFittingCost: number;
  marginAppliedFilterSlabCost: number;
  marginAppliedDigCost: number;
  marginAppliedBobcatCost: number;
  marginAppliedCustomSiteRequirementsCost: number;
  marginAppliedAgLineCost: number;
  excavationOnly: number;
  marginAppliedTempSafetyBarrierCost: number;
  extraPavingCost: number;
  existingPavingCost: number;
  concretePumpCost: number;
  underFenceConcreteStripsCost: number;
  marginAppliedPcCopingSupply: number;
  marginAppliedPcCopingLay: number;
  concreteCutsCost: number;
  retainingWallsCost: number;
  waterFeatureCost: number;
  includedPavingCoping: number;
  extraPaving: number;
  concretingCosts: number;
  extraPavingSubtotal: number;
  // Equipment upgrades breakdown
  cleanerCost: number;
  heatPumpCost: number;
  blanketRollerCost: number;
  handGrabRailsCost: number;
  otherGeneralExtrasCost: number;
  postInstallationUpgrades: number;
  customSiteRequirementsCost: number;
  customAddOnsCost: number;
}

/**
 * Hook for calculating contract summary line items
 * 
 * @param snapshot - The proposal snapshot containing all pricing data
 * @returns Calculated line items for contract summary
 */
export function useContractSummaryLineItems(
  snapshot: ProposalSnapshot | null | undefined
): ContractSummaryLineItems {
  const { contractGrandTotal, totals, basePoolBreakdown } = usePriceCalculator(snapshot);

  // Fetch custom add-ons cost from pool_general_extras table
  const { data: customAddOnsData } = useQuery({
    queryKey: ['custom-add-ons', snapshot?.project_id],
    queryFn: async () => {
      if (!snapshot?.project_id) return 0;
      
      const { data: poolExtras, error } = await supabase
        .from('pool_general_extras' as any)
        .select('total_rrp')
        .eq('pool_project_id', snapshot.project_id)
        .eq('type', 'custom');
        
      if (error) {
        console.warn('Failed to fetch custom add-ons:', error);
        return 0;
      }
      
      if (!poolExtras) return 0;
      
      return poolExtras.reduce((sum: number, extra: any) => sum + (extra.total_rrp || 0), 0);
    },
    enabled: !!snapshot?.project_id
  });

  const customAddOnsCost = customAddOnsData || 0;

  console.log('🔥 useContractSummaryLineItems hook fired', { 
    snapshot: !!snapshot, 
    contractGrandTotal,
    customAddOnsCost,
    snapshotId: snapshot?.project_id,
    fixed_costs_json: snapshot?.fixed_costs_json 
  });

  return useMemo(() => {
    console.log('📊 useContractSummaryLineItems memoization triggered', { snapshot: !!snapshot, contractGrandTotal, customAddOnsCost });
    // Handle null/undefined snapshot
    if (!snapshot) {
      return {
        deposit: {
          fireAntCost: 0,
          hwiCost: 0,
          form15Cost: 0,
          depositRemainder: 0,
          totalDeposit: 0
        },
        // Section totals
        totalDeposit: 0,
        pcContractBOD: 0,
        poolShellSupplyEquipmentTotal: 0,
        poolShellSupplyAfterDiscount: 0,
        poolShellInstallationTotal: 0,
        pcShellInstallCraneHire: 0,
        pcShellInstallBackfill: 0,
        pcShellInstallRemainder: 0,
        excavationContractTotal: 0,
        beamCost: 0,
        extraConcretingTotal: 0,
        pavingTotal: 0,
        retainingWallsWaterFeatureTotal: 0,
        specialInclusions: 0,
        handoverTotal: 0,
        contractSummaryGrandTotal: 0,
        contractSummaryGrandTotalAfterDiscount: 0,
        contractTotalExcludingHWI: 0,
        totalDiscountAmount: 0,
        // Breakdown values
        equipmentOnly: 0,
        shellValueInContract: 0,
        marginAppliedCraneCost: 0,
        marginAppliedTrafficControlCost: 0,
        marginAppliedPcInstallFee: 0,
        marginAppliedPcPeaGravel: 0,
        marginAppliedPipeFittingCost: 0,
        marginAppliedFilterSlabCost: 0,
        marginAppliedDigCost: 0,
        marginAppliedBobcatCost: 0,
        marginAppliedCustomSiteRequirementsCost: 0,
        marginAppliedAgLineCost: 0,
        excavationOnly: 0,
        marginAppliedTempSafetyBarrierCost: 0,
        extraPavingCost: 0,
        existingPavingCost: 0,
        concretePumpCost: 0,
        underFenceConcreteStripsCost: 0,
        marginAppliedPcCopingSupply: 0,
        marginAppliedPcCopingLay: 0,
        concreteCutsCost: 0,
        retainingWallsCost: 0,
        waterFeatureCost: 0,
        includedPavingCoping: 0,
        extraPaving: 0,
        concretingCosts: 0,
        extraPavingSubtotal: 0,
        // Equipment upgrades breakdown
        cleanerCost: 0,
        heatPumpCost: 0,
        blanketRollerCost: 0,
        handGrabRailsCost: 0,
        otherGeneralExtrasCost: 0,
        postInstallationUpgrades: 0,
        customSiteRequirementsCost: 0,
        customAddOnsCost: 0,
      };
    }
    // ==================================================================================
    // MARGIN CALCULATIONS
    // ==================================================================================
    // Prepare margin multiplier for post-margin calculations
    const marginMultiplier = 1 / (1 - (snapshot.pool_margin_pct || 0) / 100);

    // ==================================================================================
    // EQUIPMENT UPGRADES BREAKDOWN
    // ==================================================================================
    // Break down totals.extrasTotal into individual components
    const cleanerCost = snapshot.cleaner_included ? (snapshot.cleaner_unit_price || 0) : 0;
    const heatPumpCost = snapshot.include_heat_pump ? ((snapshot.heat_pump_rrp || 0) + (snapshot.heat_pump_installation_cost || 0)) : 0;
    const blanketRollerCost = snapshot.include_blanket_roller ? ((snapshot.blanket_roller_rrp || 0) + (snapshot.blanket_roller_installation_cost || 0)) : 0;
    
    // Split general extras between hand grab rails and other general extras
    const handGrabRailsCost = (snapshot.selected_extras_json || [])
      .filter((extra: any) => extra.name && extra.name.toLowerCase().includes('hand grab rail'))
      .reduce((sum: number, extra: any) => {
        return sum + ((extra.rrp || 0) * (extra.quantity || 1));
      }, 0);
    
    const otherGeneralExtrasCost = (snapshot.selected_extras_json || [])
      .filter((extra: any) => 
        (!extra.name || !extra.name.toLowerCase().includes('hand grab rail')) &&
        extra.type !== 'custom'
      )
      .reduce((sum: number, extra: any) => {
        return sum + ((extra.rrp || 0) * (extra.quantity || 1));
      }, 0);

    // Custom add-ons cost (from pool_general_extras table with type='custom')
    // Fetched directly using useQuery above

    // Get all fixed cost items
    const fireAntItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Fire Ant");
    const fireAntCost = fireAntItem ? parseFloat(fireAntItem.price) : 0;
    const form15Item = snapshot.fixed_costs_json?.find(fc => fc.name === "Form 15");
    const form15Cost = form15Item ? parseFloat(form15Item.price) : 0;
    const freightItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Freight");
    const freightCost = freightItem ? parseFloat(freightItem.price) : 0;
    const miscFixedItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Miscellaneous");
    const miscFixedCost = miscFixedItem ? parseFloat(miscFixedItem.price) : 0;
    const handoverItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Handover");
    const handoverCost = handoverItem ? parseFloat(handoverItem.price) : 0;
    const earthbondItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Earthbond");
    const earthbondCost = earthbondItem ? parseFloat(earthbondItem.price) : 0;
    const agLineItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Ag Line");
    const agLineCost = agLineItem ? parseFloat(agLineItem.price) : 0;
    const pipeFittingItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Pipe Fitting + 3 Way Valve");
    const pipeFittingCost = pipeFittingItem ? parseFloat(pipeFittingItem.price) : 0;
    const filterSlabItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Filter Slab");
    const filterSlabCost = filterSlabItem ? parseFloat(filterSlabItem.price) : 0;
    const tempSafetyBarrierItem = snapshot.fixed_costs_json?.find(fc => fc.name === "Temporary Safety Barrier");
    const tempSafetyBarrierCost = tempSafetyBarrierItem ? parseFloat(tempSafetyBarrierItem.price) : 0;

    // Apply margin to relevant items
    const marginAppliedFireAntCost = fireAntCost * marginMultiplier;
    const marginAppliedForm15Cost = form15Cost * marginMultiplier;
    const marginAppliedFreightCost = freightCost * marginMultiplier;
    const marginAppliedMiscFixedCost = miscFixedCost * marginMultiplier;
    const marginAppliedHandoverCost = handoverCost * marginMultiplier;
    const marginAppliedEarthbondCost = earthbondCost * marginMultiplier;
    const marginAppliedAgLineCost = agLineCost * marginMultiplier;
    const marginAppliedPipeFittingCost = pipeFittingCost * marginMultiplier;
    const marginAppliedFilterSlabCost = filterSlabCost * marginMultiplier;
    const marginAppliedTempSafetyBarrierCost = tempSafetyBarrierCost * marginMultiplier;
    
    // Margin-applied pool shell cost
    const poolShellCost = snapshot.spec_buy_inc_gst || 0;
    const marginAppliedPoolShellCost = poolShellCost * marginMultiplier;

    // Dig / Excavation
    const digCost = 
      (snapshot.dig_excavation_rate   || 0) * (snapshot.dig_excavation_hours || 0)
    + (snapshot.dig_truck_rate        || 0) * (snapshot.dig_truck_hours     || 0) * (snapshot.dig_truck_qty || 0);
    const marginAppliedDigCost = digCost * marginMultiplier;

    // Filtration & Handover-components
    const filtrationPackage =
      (snapshot.pump_price_inc_gst     || 0)
    + (snapshot.filter_price_inc_gst   || 0)
    + (snapshot.sanitiser_price_inc_gst|| 0)
    + (snapshot.light_price_inc_gst    || 0)
    + (snapshot.handover_components || [])
        .reduce((sum, c) => sum + (c.hk_component_price_inc_gst||0) * (c.hk_component_quantity||0), 0);
    const marginAppliedFiltrationPackage = filtrationPackage * marginMultiplier;

    // Individual "pc_…" extras - each component separately
    const pcBeam = snapshot.pc_beam || 0;
    const pcCopingSupply = snapshot.pc_coping_supply || 0;
    const pcCopingLay = snapshot.pc_coping_lay || 0;
    const pcSaltBags = snapshot.pc_salt_bags || 0;
    const pcTruckedWater = snapshot.pc_trucked_water || 0;
    const pcMisc = snapshot.pc_misc || 0;
    const pcPeaGravel = snapshot.pc_pea_gravel || 0;
    const pcInstallFee = snapshot.pc_install_fee || 0;

    // Apply margin to each individual cost
    const marginAppliedPcBeam = pcBeam * marginMultiplier;
    const marginAppliedPcCopingSupply = pcCopingSupply * marginMultiplier;
    const marginAppliedPcCopingLay = pcCopingLay * marginMultiplier;
    const marginAppliedPcSaltBags = pcSaltBags * marginMultiplier;
    const marginAppliedPcTruckedWater = pcTruckedWater * marginMultiplier;
    const marginAppliedPcMisc = pcMisc * marginMultiplier;
    const marginAppliedPcPeaGravel = pcPeaGravel * marginMultiplier;
    const marginAppliedPcInstallFee = pcInstallFee * marginMultiplier;


    // Bobcat cost
    const bobcatCost = snapshot.bobcat_cost || 0;

    // Custom site requirements cost (no margin applied)
    const customSiteRequirementsCost = snapshot.site_requirements_data 
      ? (typeof snapshot.site_requirements_data === 'string'
         ? JSON.parse(snapshot.site_requirements_data)
         : snapshot.site_requirements_data).reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0)
      : 0;

    // ────────────────────────────────────────────────────────────────
    // Crane pricing: margin on $700 allowance, pass-through on excess
    // ────────────────────────────────────────────────────────────────
    const ALLOWANCE_COST      = 700;
    const rawCraneCost        = snapshot.crane_cost || 0;
    const craneAllowanceSell  = ALLOWANCE_COST * marginMultiplier;        // earns margin
    const craneExcessCost     = Math.max(rawCraneCost - ALLOWANCE_COST, 0); // no margin
    const craneForInstallation = craneAllowanceSell + craneExcessCost;    // final sell price

    // Traffic control cost
    const trafficControlCost = snapshot.traffic_control_cost || 0;

    // ==================================================================================
    // 1. DEPOSIT COMPONENTS (Calculated Later)
    // ==================================================================================
    // HWI cost will be calculated after discount is applied

    // ==================================================================================
    // 2. POOL SHELL SUPPLY CALCULATION
    // ==================================================================================
    // Build the "hidden" shell value on a post–margin basis
    const shellValueInContract =
      marginAppliedPoolShellCost
    + marginAppliedFreightCost
    + marginAppliedMiscFixedCost;

    // Equipment kit: margin-applied filtration package + specific extras (only other general extras and blanket rollers)
    const equipmentOnly = marginAppliedFiltrationPackage + otherGeneralExtrasCost + blanketRollerCost;

    // Final Pool Shell Supply total
    const poolShellSupplyEquipmentTotal = equipmentOnly + shellValueInContract;

    // ==================================================================================
    // 3. EXCAVATION CALCULATION
    // ==================================================================================
    // Calculate excavation only (standard excavation without custom site requirements)
    const excavationOnly = marginAppliedDigCost + bobcatCost + marginAppliedAgLineCost;
    
    // Calculate total Excavation cost including custom site requirements
    const excavationContractTotal = excavationOnly + customSiteRequirementsCost;


    // ==================================================================================
    // 4. POOL SHELL INSTALLATION CALCULATION
    // ==================================================================================
    // craneForInstallation already calculated above with new allowance logic
    
    // Calculate Pool Shell Installation total
    const poolShellInstallationTotal =
        craneForInstallation
      + trafficControlCost
      + marginAppliedPcInstallFee
      + marginAppliedPcPeaGravel
      + marginAppliedPipeFittingCost
      + marginAppliedFilterSlabCost
      + marginAppliedPcSaltBags
      + marginAppliedPcTruckedWater
      + marginAppliedPcMisc
      + marginAppliedEarthbondCost;
    
    // Shell Installation breakdown for PC contract
    const pcShellInstallCraneHire = craneForInstallation + trafficControlCost;
    const pcShellInstallBackfill = marginAppliedPcPeaGravel; // Pea gravel is used for backfill
    const pcShellInstallRemainder = poolShellInstallationTotal - pcShellInstallCraneHire - pcShellInstallBackfill;
    

    // ==================================================================================
    // 6. EXTRA CONCRETING CALCULATION
    // ==================================================================================
    // Structural concrete pours only (no margin applied here)
    const extraConcretingTotal = (snapshot.extra_concreting_cost || 0) + (snapshot.extra_concrete_pump_total_cost || 0);

    // ==================================================================================
    // 7. PAVING / COPING CALCULATION
    // ==================================================================================
    // Included Paving & Coping (with margin)
    const includedPavingCoping =
        marginAppliedPcCopingSupply
      + marginAppliedPcCopingLay;

    // Extra Paving (without margin)
    const retainingWallsCost = totals.retainingWallsTotal;
    
    // Sub-items for extra paving
    const beamCost = marginAppliedPcBeam;
    const concretingCosts = 
        (snapshot.concrete_pump_total_cost || 0)
      + (snapshot.uf_strips_cost           || 0)
      + (snapshot.concrete_cuts_cost       || 0);
    const extraPavingSubtotal = 
        (snapshot.extra_paving_cost    || 0)
      + (snapshot.existing_paving_cost || 0);
    
    const extraPaving = extraPavingSubtotal + concretingCosts + beamCost + retainingWallsCost;

    // Final Paving total
    const pavingTotal = includedPavingCoping + extraPaving;

    // ==================================================================================
    // 8. RETAINING WALLS / WATER FEATURE CALCULATION
    // ==================================================================================
    // Get Water Feature totals from use-calculator-totals.ts
    const waterFeatureCost = totals.waterFeatureTotal;

    // Calculate total Retaining Walls / Water Feature cost
    const retainingWallsWaterFeatureTotal = waterFeatureCost;

    // ==================================================================================
    // 9. SPECIAL INCLUSIONS CALCULATION
    // ==================================================================================
    // Post-Installation Upgrades combines heating, hand grab rails, and cleaner
    const postInstallationUpgrades = heatPumpCost + handGrabRailsCost + cleanerCost;
    
    // Special inclusions include post-installation upgrades and custom add-ons (custom site requirements moved to excavation)
    const specialInclusions = postInstallationUpgrades + customAddOnsCost;

    // ==================================================================================
    // 10. HANDOVER CALCULATION
    // ==================================================================================
    // Handover cost from fixed costs with margin applied
    const handoverTotal = marginAppliedHandoverCost;

    // ==================================================================================
    // CONTRACT SUMMARY GRAND TOTAL CALCULATION
    // ==================================================================================
    // Calculate Contract Summary Grand Total WITHOUT HWI first (sum of all contract line item subtotals except HWI)
    const contractSummaryGrandTotalWithoutHWI = 
      marginAppliedFireAntCost +
      marginAppliedForm15Cost +
      poolShellSupplyEquipmentTotal + 
      excavationContractTotal + 
      poolShellInstallationTotal + 
      extraConcretingTotal + 
      pavingTotal + 
      retainingWallsWaterFeatureTotal + 
      specialInclusions + 
      handoverTotal;

    // ==================================================================================
    // DISCOUNT CALCULATION
    // ==================================================================================
    let totalDiscountAmount = 0;
    
    // Get discounts from snapshot
    const appliedDiscounts = snapshot.applied_discounts_json;
    
    if (appliedDiscounts && appliedDiscounts.length > 0) {
      appliedDiscounts.forEach(discount => {
        if (discount && discount.discount_type) {
          if (discount.discount_type === 'dollar' && discount.dollar_value) {
            totalDiscountAmount += discount.dollar_value;
          } else if (discount.discount_type === 'percentage' && discount.percentage_value) {
            // Calculate percentage discount based on contractSummaryGrandTotalWithoutHWI
            const percentageAmount = (contractSummaryGrandTotalWithoutHWI * discount.percentage_value) / 100;
            totalDiscountAmount += percentageAmount;
          }
        }
      });
    }

    // Calculate total after discount (without HWI)
    const contractTotalWithoutHWIAfterDiscount = contractSummaryGrandTotalWithoutHWI - totalDiscountAmount;
    
    // Now calculate HWI based on the discounted total
    const hwiCost = getHWIInsuranceCost(contractTotalWithoutHWIAfterDiscount);
    
    // Calculate final totals including HWI
    const contractSummaryGrandTotal = contractSummaryGrandTotalWithoutHWI + hwiCost;
    const contractSummaryGrandTotalAfterDiscount = contractTotalWithoutHWIAfterDiscount + hwiCost;
    
    // Apply discount to pool shell supply line item
    const poolShellSupplyAfterDiscount = poolShellSupplyEquipmentTotal - totalDiscountAmount;
    
    // Calculate Contract Total Excluding HWI
    const contractTotalExcludingHWI = contractSummaryGrandTotalAfterDiscount - hwiCost;

    // ==================================================================================
    // 11. DEPOSIT CALCULATION
    // ==================================================================================
    
    // Calculate deposit as 10% of the grand total after discounts
    const totalDeposit = contractSummaryGrandTotalAfterDiscount * 0.1;
    const deposit: DepositBreakdown = {
      fireAntCost: marginAppliedFireAntCost,
      hwiCost,
      form15Cost: marginAppliedForm15Cost,
      depositRemainder: totalDeposit - marginAppliedFireAntCost - hwiCost - marginAppliedForm15Cost,
      totalDeposit
    };

    // PC Contract BOD: Total deposit minus only HWI and Form 15 (fire ant stays in BOD)
    const pcContractBOD = totalDeposit - hwiCost - marginAppliedForm15Cost;

    const result: ContractSummaryLineItems = {
      deposit,
      // Section totals
      totalDeposit,
      pcContractBOD,
      poolShellSupplyEquipmentTotal,
      poolShellSupplyAfterDiscount,
      poolShellInstallationTotal,
      pcShellInstallCraneHire,
      pcShellInstallBackfill,
      pcShellInstallRemainder,
      excavationContractTotal,
      beamCost,
      extraConcretingTotal,
      pavingTotal,
      retainingWallsWaterFeatureTotal,
      specialInclusions,
      handoverTotal,
      contractSummaryGrandTotal,
      contractSummaryGrandTotalAfterDiscount,
      contractTotalExcludingHWI,
      totalDiscountAmount,
      // Breakdown values
      equipmentOnly,
      shellValueInContract,
      marginAppliedCraneCost: craneForInstallation,
      marginAppliedTrafficControlCost: trafficControlCost,
      marginAppliedPcInstallFee,
      marginAppliedPcPeaGravel,
      marginAppliedPipeFittingCost,
      marginAppliedFilterSlabCost,
      marginAppliedDigCost,
      marginAppliedBobcatCost: bobcatCost,
      marginAppliedCustomSiteRequirementsCost: customSiteRequirementsCost,
      marginAppliedAgLineCost,
      excavationOnly,
      marginAppliedTempSafetyBarrierCost,
      extraPavingCost: (snapshot.extra_paving_cost || 0),
      existingPavingCost: (snapshot.existing_paving_cost || 0),
      concretePumpCost: (snapshot.concrete_pump_total_cost || 0),
      underFenceConcreteStripsCost: (snapshot.uf_strips_cost || 0),
      marginAppliedPcCopingSupply,
      marginAppliedPcCopingLay,
      concreteCutsCost: (snapshot.concrete_cuts_cost || 0),
      retainingWallsCost,
      waterFeatureCost,
      includedPavingCoping,
      extraPaving,
      concretingCosts,
      extraPavingSubtotal,
      // Equipment upgrades breakdown
      cleanerCost,
      heatPumpCost,
      blanketRollerCost,
      handGrabRailsCost,
      otherGeneralExtrasCost,
      postInstallationUpgrades,
      customSiteRequirementsCost,
      customAddOnsCost,
    };
    
    console.log('✅ useContractSummaryLineItems result:', {
      ...result,
      discountDetails: {
        totalDiscountAmount,
        poolShellSupplyOriginal: poolShellSupplyEquipmentTotal,
        poolShellSupplyAfterDiscount,
        contractGrandTotalOriginal: contractSummaryGrandTotal,
        contractGrandTotalAfterDiscount: contractSummaryGrandTotalAfterDiscount
      }
    });
    
    return result;
  }, [snapshot, contractGrandTotal, customAddOnsCost]);
}