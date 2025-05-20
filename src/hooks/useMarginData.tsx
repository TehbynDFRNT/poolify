import { useMemo } from 'react';

export interface PoolFencingMarginData {
    railing: {
        cost: number;
        marginPercent: number;
        marginAmount: number;
        retailPrice: number;
    };
    gate: {
        cost: number;
        marginPercent: number;
        marginAmount: number;
        retailPrice: number;
    };
    earthing: {
        cost: number;
        marginPercent: number;
        marginAmount: number;
        retailPrice: number;
    };
    totalMargin: number;
}

export const useMarginData = (snapshot: any) => {
    return useMemo(() => {
        if (!snapshot) {
            return {
                basePriceMargin: 0,
                basePriceRetail: 0,
                siteRequirementsMargin: 0,
                siteRequirementsRetail: 0,
                fencingMarginData: null,
                waterFeaturesMargin: 0,
                upgradesExtrasMargin: 0,
                concretePavingMarginData: null,
            };
        }

        // Base price margin calculation
        const basePriceMargin = snapshot.pool_margin_pct ?
            (snapshot.spec_buy_inc_gst || 0) * (snapshot.pool_margin_pct / 100) : 0;

        const basePriceRetail = (snapshot.spec_buy_inc_gst || 0) + basePriceMargin;

        // Site requirements margin (default to 25% if not specified)
        const siteRequirementsMargin = snapshot.site_requirements_margin_pct || 25;
        const siteRequirementsRetail = (snapshot.site_requirements_total || 0) *
            (1 + siteRequirementsMargin / 100);

        // Fencing margin data
        const fencingMarginData: PoolFencingMarginData = {
            railing: {
                cost: snapshot.fencing_railing_cost || 0,
                marginPercent: 30, // Default margins (update as needed)
                marginAmount: (snapshot.fencing_railing_cost || 0) * 0.3,
                retailPrice: (snapshot.fencing_railing_cost || 0) * 1.3,
            },
            gate: {
                cost: snapshot.fencing_gate_cost || 0,
                marginPercent: 30,
                marginAmount: (snapshot.fencing_gate_cost || 0) * 0.3,
                retailPrice: (snapshot.fencing_gate_cost || 0) * 1.3,
            },
            earthing: {
                cost: snapshot.fencing_earthing_cost || 0,
                marginPercent: 30,
                marginAmount: (snapshot.fencing_earthing_cost || 0) * 0.3,
                retailPrice: (snapshot.fencing_earthing_cost || 0) * 1.3,
            },
            totalMargin: ((snapshot.fencing_railing_cost || 0) +
                (snapshot.fencing_gate_cost || 0) +
                (snapshot.fencing_earthing_cost || 0)) * 0.3,
        };

        // Water features margin (default 30%)
        const waterFeaturesMargin = (snapshot.water_feature_total_cost || 0) * 0.3;

        // Upgrades and extras margin (default 25%)
        const upgradesExtrasMargin = snapshot.upgrades_extras_total
            ? Math.round((snapshot.upgrades_extras_total * 0.25))
            : 0;

        // Concrete and paving margin data
        const concretePavingMarginData = {
            totalMargin: (
                (snapshot.concrete_cuts_cost || 0) +
                (snapshot.extra_paving_cost || 0) +
                (snapshot.existing_paving_cost || 0) +
                (snapshot.extra_concreting_cost || 0)
            ) * 0.25, // Assuming 25% margin
        };

        return {
            basePriceMargin,
            basePriceRetail,
            siteRequirementsMargin,
            siteRequirementsRetail,
            fencingMarginData,
            waterFeaturesMargin,
            upgradesExtrasMargin,
            concretePavingMarginData,
        };
    }, [snapshot]);
}; 