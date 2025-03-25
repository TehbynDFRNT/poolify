
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { formatCurrency } from "@/utils/format";

interface CostBreakdownDetailsProps {
  selectedCategory: ExtraPavingCost | undefined;
  labourCostValue: number;
  labourMarginValue: number;
  costPerMeter: number;
  meters: number;
  totalCost: number;
  totalMargin: number;
}

export const CostBreakdownDetails = ({
  selectedCategory,
  labourCostValue,
  labourMarginValue,
  costPerMeter,
  meters,
  totalCost,
  totalMargin
}: CostBreakdownDetailsProps) => {
  if (!selectedCategory) {
    return <div className="text-muted-foreground">No category selected</div>;
  }

  return (
    <div className="pt-2 space-y-4">
      <h4 className="text-md font-medium mb-2">Cost Breakdown</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Materials Breakdown */}
        <div className="bg-slate-50 p-4 rounded-md">
          <h5 className="font-medium text-sm mb-2">Materials (per meter)</h5>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1">Paver Cost:</td>
                <td className="text-right">{formatCurrency(selectedCategory.paver_cost)}</td>
              </tr>
              <tr>
                <td className="py-1">Wastage Cost:</td>
                <td className="text-right">{formatCurrency(selectedCategory.wastage_cost)}</td>
              </tr>
              <tr>
                <td className="py-1">Material Margin:</td>
                <td className="text-right text-green-600">{formatCurrency(selectedCategory.margin_cost)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-1 font-medium">Total Material Cost (per m):</td>
                <td className="text-right font-medium">
                  {formatCurrency(selectedCategory.paver_cost + selectedCategory.wastage_cost + selectedCategory.margin_cost)}
                </td>
              </tr>
              <tr>
                <td className="py-1">Total Materials Cost:</td>
                <td className="text-right">
                  {formatCurrency((selectedCategory.paver_cost + selectedCategory.wastage_cost + selectedCategory.margin_cost) * meters)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Labour Breakdown */}
        <div className="bg-slate-50 p-4 rounded-md">
          <h5 className="font-medium text-sm mb-2">Labour (per meter)</h5>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1">Labour Cost:</td>
                <td className="text-right">{formatCurrency(labourCostValue)}</td>
              </tr>
              <tr>
                <td className="py-1">Labour Margin:</td>
                <td className="text-right text-green-600">{formatCurrency(labourMarginValue)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-1 font-medium">Total Labour Cost (per m):</td>
                <td className="text-right font-medium">
                  {formatCurrency(labourCostValue + labourMarginValue)}
                </td>
              </tr>
              <tr>
                <td className="py-1">Total Labour Cost:</td>
                <td className="text-right">
                  {formatCurrency((labourCostValue + labourMarginValue) * meters)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Total Summary */}
      <div className="bg-slate-100 p-4 rounded-md">
        <h5 className="font-medium mb-2">Total Summary</h5>
        <table className="w-full">
          <tbody>
            <tr>
              <td>Cost Per Meter:</td>
              <td className="text-right">{formatCurrency(costPerMeter)}</td>
            </tr>
            <tr>
              <td>Total Meters:</td>
              <td className="text-right">{meters}</td>
            </tr>
            <tr>
              <td>Total Margin:</td>
              <td className="text-right text-green-600">{formatCurrency(totalMargin)}</td>
            </tr>
            <tr className="border-t">
              <td className="font-medium">Total Cost:</td>
              <td className="text-right font-medium">{formatCurrency(totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
