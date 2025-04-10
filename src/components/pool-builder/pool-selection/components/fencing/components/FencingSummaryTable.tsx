
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { FencingSummary } from "../hooks/useFencingSummary";

interface FencingSummaryTableProps {
  fencings: FencingSummary[];
  totalCost: number;
}

export const FencingSummaryTable: React.FC<FencingSummaryTableProps> = ({ 
  fencings, 
  totalCost 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Linear Meters</TableHead>
          <TableHead>Gates</TableHead>
          <TableHead>Panels</TableHead>
          <TableHead>Earthing</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fencings.map((fencing, index) => (
          <TableRow key={`fencing-${index}`}>
            <TableCell className="font-medium">{fencing.fencingType}</TableCell>
            <TableCell>{fencing.linearMeters}m (${fencing.linearCost.toFixed(2)})</TableCell>
            <TableCell>
              {fencing.gatesCount} (${fencing.gatesCost.toFixed(2)})
              {fencing.freeGateDiscount ? (
                <span className="text-green-600 ml-1">
                  ${fencing.freeGateDiscount.toFixed(2)} discount
                </span>
              ) : null}
            </TableCell>
            <TableCell>
              {fencing.simplePanels + fencing.complexPanels > 0 ? (
                <>
                  {fencing.simplePanels > 0 && `${fencing.simplePanels} simple`}
                  {fencing.simplePanels > 0 && fencing.complexPanels > 0 && ', '}
                  {fencing.complexPanels > 0 && `${fencing.complexPanels} complex`}
                  {` ($${(fencing.simplePanelsCost + fencing.complexPanelsCost).toFixed(2)})`}
                </>
              ) : 'None'}
            </TableCell>
            <TableCell>
              {fencing.hasEarthing 
                ? `Yes ($${fencing.earthingCost.toFixed(2)})` 
                : 'No'}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(fencing.totalCost)}
            </TableCell>
          </TableRow>
        ))}
        
        <TableRow className="border-t-2">
          <TableCell colSpan={5} className="text-right font-semibold">Total:</TableCell>
          <TableCell className="text-right font-semibold">{formatCurrency(totalCost)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
