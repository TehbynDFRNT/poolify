
import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceBuilderData } from "./hooks/usePriceBuilderData";
import { useMarginCalculator } from "./hooks/useMarginCalculator";
import { calculateCosts } from "./utils/costCalculations";
import { MarginEditorCell } from "./components/MarginEditorCell";

const PriceBuilder = () => {
  const navigate = useNavigate();
  const { pools, fixedCosts, poolCosts, excavationDetails, craneSelections, isLoading } = usePriceBuilderData();
  const {
    margins,
    editingId,
    tempMargin,
    setTempMargin,
    handleStartEdit,
    handleSave,
    handleCancel
  } = useMarginCalculator();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Price Builder</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>Price Builder</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Range</TableHead>
                      <TableHead>Pool Name</TableHead>
                      <TableHead className="text-right">Base Price</TableHead>
                      <TableHead className="text-right">Filtration</TableHead>
                      <TableHead className="text-right">Fixed Costs</TableHead>
                      <TableHead className="text-right">Individual Costs</TableHead>
                      <TableHead className="text-right">Excavation</TableHead>
                      <TableHead className="text-right">Crane</TableHead>
                      <TableHead className="text-right">True Cost</TableHead>
                      <TableHead className="text-right">Margin %</TableHead>
                      <TableHead className="text-right">RRP</TableHead>
                      <TableHead className="text-right">Actual Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools?.map((pool) => {
                      const costs = calculateCosts(pool, margins[pool.id] || 0, fixedCosts, poolCosts, excavationDetails, craneSelections);
                      const actualMargin = costs.rrp - costs.total;
                      return (
                        <TableRow 
                          key={pool.id}
                          className={cn(
                            "cursor-pointer hover:bg-muted/50",
                            "transition-colors"
                          )}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('.margin-cell')) {
                              e.stopPropagation();
                              return;
                            }
                            // Fix the navigation path to match the route defined in App.tsx
                            navigate(`/price-builder/pool/${pool.id}`);
                          }}
                        >
                          <TableCell className="font-medium">{pool.range}</TableCell>
                          <TableCell>{pool.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.basePrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.filtrationCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.fixedCostsTotal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.individualCostsTotal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.excavationCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.craneCost)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(costs.total)}</TableCell>
                          <TableCell className="margin-cell" onClick={e => e.stopPropagation()}>
                            <MarginEditorCell
                              poolId={pool.id}
                              margin={margins[pool.id] || 0}
                              isEditing={editingId === pool.id}
                              tempMargin={tempMargin}
                              onStartEdit={handleStartEdit}
                              onSave={handleSave}
                              onCancel={handleCancel}
                              onTempMarginChange={setTempMargin}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {formatCurrency(costs.rrp)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {formatCurrency(actualMargin)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PriceBuilder;
