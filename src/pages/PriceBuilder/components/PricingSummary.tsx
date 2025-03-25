
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";
import { PricingSummaryLoadingState } from './PricingSummary/LoadingState';
import { CostBreakdown } from './PricingSummary/CostBreakdown';
import { TotalCostDisplay } from './PricingSummary/TotalCostDisplay';
import { MarginDisplay } from './PricingSummary/MarginDisplay';
import { 
  useFixedCosts, 
  useIndividualCosts, 
  useExcavationDetails, 
  useSelectedCrane, 
  useMarginData, 
  calculateExcavationTotal 
} from '../hooks/usePricingSummaryData';

interface PricingSummaryProps {
  poolId: string;
  poolBasePrice: number;
  filtrationPackage: PackageWithComponents | null;
}

export const PricingSummary = ({ poolId, poolBasePrice, filtrationPackage }: PricingSummaryProps) => {
  // Use our hooks to fetch the necessary data
  const { data: fixedCosts, isLoading: isLoadingFixed } = useFixedCosts();
  const { data: individualCosts, isLoading: isLoadingIndividual } = useIndividualCosts(poolId);
  const { data: excavationDetails, isLoading: isLoadingExcavation } = useExcavationDetails(poolId);
  const { data: selectedCraneData, isLoading: isLoadingCrane } = useSelectedCrane(poolId);
  const { data: marginData, isLoading: isLoadingMargin } = useMarginData(poolId);

  const isLoading = isLoadingFixed || isLoadingIndividual || isLoadingExcavation || isLoadingMargin || isLoadingCrane;

  if (isLoading) {
    return <PricingSummaryLoadingState />;
  }

  // Calculate totals
  const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
  
  const individualCostsTotal = individualCosts ? Object.entries(individualCosts).reduce((sum, [key, value]) => {
    // Skip the id and pool_id fields and only add numeric values
    if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
      return sum + value;
    }
    return sum;
  }, 0) : 0;
  
  const excavationTotal = calculateExcavationTotal(excavationDetails);
  
  const filtrationTotal = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;

  // Ensure crane cost is properly handled
  const craneCost = selectedCraneData?.price ? Number(selectedCraneData.price) : 0;

  const costBreakdownItems = [
    { name: "Pool Base Price", value: poolBasePrice },
    { name: "Filtration Package", value: filtrationTotal },
    { name: "Fixed Costs", value: fixedCostsTotal },
    { name: "Individual Costs", value: individualCostsTotal },
    { name: "Excavation Costs", value: excavationTotal },
    { name: "Crane Costs", value: craneCost },
  ];

  const grandTotal = costBreakdownItems.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate margin, RRP and actual margin
  const marginPercentage = marginData || 0;
  const rrp = marginPercentage >= 100 ? 0 : grandTotal / (1 - marginPercentage / 100);
  const actualMargin = rrp - grandTotal;

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Cost Price Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CostBreakdown costItems={costBreakdownItems} />
          <TotalCostDisplay grandTotal={grandTotal} />
          <MarginDisplay 
            marginPercentage={marginPercentage} 
            rrp={rrp} 
            actualMargin={actualMargin} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
