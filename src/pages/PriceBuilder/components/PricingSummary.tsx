
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";
import { Skeleton } from "@/components/ui/skeleton";
import { CraneCost } from "@/types/crane-cost";

interface PricingSummaryProps {
  poolId: string;
  poolBasePrice: number;
  filtrationPackage: PackageWithComponents | null;
}

export const PricingSummary = ({ poolId, poolBasePrice, filtrationPackage }: PricingSummaryProps) => {
  // Fetch fixed costs
  const { data: fixedCosts, isLoading: isLoadingFixed } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch individual costs
  const { data: individualCosts, isLoading: isLoadingIndividual } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data: poolCosts } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

      return poolCosts;
    },
  });

  // Fetch excavation costs
  const { data: excavationDetails, isLoading: isLoadingExcavation } = useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      const { data: match } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type_id,
          dig_type:dig_types (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();

      return match;
    },
  });

  // Fetch selected crane for this pool
  const { data: selectedCraneData, isLoading: isLoadingCrane } = useQuery({
    queryKey: ["selected-crane", poolId],
    queryFn: async () => {
      try {
        // Use a stored procedure call to get the crane selection
        const { data: craneSelection, error: rpcError } = await supabase
          .rpc('get_crane_with_details_for_pool', { pool_id_param: poolId });

        // If RPC function doesn't exist yet, use alternative approach
        if (rpcError && rpcError.code === 'PGRST116') {
          // First try to get the crane_id from pool_crane_selections
          const { data: selectionData } = await supabase
            .from('pool_crane_selections' as never)
            .select('crane_id')
            .eq('pool_id', poolId)
            .maybeSingle();

          // If a selection exists, get that crane's details
          if (selectionData && typeof selectionData === 'object' && 'crane_id' in selectionData) {
            const { data: crane } = await supabase
              .from("crane_costs")
              .select("*")
              .eq("id", selectionData.crane_id)
              .single();
            return crane as CraneCost;
          }

          // Otherwise get the default Franna crane
          const { data: defaultCrane } = await supabase
            .from("crane_costs")
            .select("*")
            .eq("name", "Franna Crane-S20T-L1")
            .maybeSingle();
          
          return defaultCrane as CraneCost;
        }

        if (rpcError) throw rpcError;
        return craneSelection as CraneCost;
      } catch (error) {
        console.error("Error fetching crane data:", error);
        
        // Fall back to default crane
        const { data: defaultCrane } = await supabase
          .from("crane_costs")
          .select("*")
          .eq("name", "Franna Crane-S20T-L1")
          .maybeSingle();
        
        return defaultCrane as CraneCost;
      }
    },
  });

  // Fetch margin data
  const { data: marginData, isLoading: isLoadingMargin } = useQuery({
    queryKey: ["pool-margin", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
  });

  const isLoading = isLoadingFixed || isLoadingIndividual || isLoadingExcavation || isLoadingMargin || isLoadingCrane;

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Cost Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
  
  const individualCostsTotal = individualCosts ? Object.entries(individualCosts).reduce((sum, [key, value]) => {
    // Skip the id field and only add numeric values
    if (key !== 'id' && typeof value === 'number') {
      return sum + value;
    }
    return sum;
  }, 0) : 0;
  
  const excavationTotal = excavationDetails?.dig_type ? calculateGrandTotal(excavationDetails.dig_type) : 0;
  
  const filtrationTotal = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;

  const craneCost = selectedCraneData?.price || 0;

  const costBreakdown = [
    { name: "Pool Base Price", value: poolBasePrice },
    { name: "Filtration Package", value: filtrationTotal },
    { name: "Fixed Costs", value: fixedCostsTotal },
    { name: "Individual Costs", value: individualCostsTotal },
    { name: "Excavation Costs", value: excavationTotal },
    { name: "Crane Costs", value: craneCost },
  ];

  const grandTotal = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {costBreakdown.map((item, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-4 space-y-2"
              >
                <div className="text-sm text-muted-foreground">
                  {item.name}
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(item.value)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-6 bg-primary/10 rounded-lg mt-6">
            <span className="text-base font-semibold text-primary">True Cost</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          
          {/* Margin Information */}
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Margin %
                </div>
                <div className="text-sm font-medium">
                  {marginPercentage.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  RRP
                </div>
                <div className="text-sm font-medium text-primary">
                  {formatCurrency(rrp)}
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Actual Margin
                </div>
                <div className="text-sm font-medium text-primary">
                  {formatCurrency(actualMargin)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
