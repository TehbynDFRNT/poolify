
import { formatCurrency } from "@/utils/format";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
  // Safely calculate material costs
  const paverCost = selectedCategory ? selectedCategory.paver_cost : 0;
  const wastageCost = selectedCategory ? selectedCategory.wastage_cost : 0;
  const materialMarginCost = selectedCategory ? selectedCategory.margin_cost : 0;
  
  // Calculate based on meters
  const totalPaverCost = parseFloat((paverCost * meters).toFixed(2));
  const totalWastageCost = parseFloat((wastageCost * meters).toFixed(2));
  const totalMaterialMargin = parseFloat((materialMarginCost * meters).toFixed(2));
  const totalLabourCost = parseFloat((labourCostValue * meters).toFixed(2));
  const totalLabourMargin = parseFloat((labourMarginValue * meters).toFixed(2));
  
  return (
    <div className="bg-slate-50 p-4 rounded-md text-sm">
      <h4 className="font-medium mb-3">Cost Breakdown</h4>
      
      <div className="mb-4">
        <h5 className="font-medium mb-2">Per Meter Costs:</h5>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Paver cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(paverCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Wastage cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(wastageCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Material margin:</TableCell>
              <TableCell className="text-right">{formatCurrency(materialMarginCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labour cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(labourCostValue)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labour margin:</TableCell>
              <TableCell className="text-right">{formatCurrency(labourMarginValue)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total per meter:</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(costPerMeter)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h5 className="font-medium mb-2">Total Costs ({meters} meters):</h5>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Paver cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(totalPaverCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Wastage cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(totalWastageCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Material margin:</TableCell>
              <TableCell className="text-right">{formatCurrency(totalMaterialMargin)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labour cost:</TableCell>
              <TableCell className="text-right">{formatCurrency(totalLabourCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labour margin:</TableCell>
              <TableCell className="text-right">{formatCurrency(totalLabourMargin)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total margin:</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(totalMargin)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium border-t">Total cost:</TableCell>
              <TableCell className="text-right font-medium border-t">{formatCurrency(totalCost)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
