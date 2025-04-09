
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

export interface WallSummary {
  wallNumber: number;
  type: string;
  height1: number;
  height2: number;
  length: number;
  squareMeters: number;
  margin: number;
  totalCost: number;
}

interface SummaryTableProps {
  walls: WallSummary[];
  totalMargin: number;
  totalCost: number;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ 
  walls, 
  totalMargin, 
  totalCost 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wall</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Dimensions</TableHead>
          <TableHead className="text-right">Area</TableHead>
          <TableHead className="text-right">Margin</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {walls.map((wall) => (
          <TableRow key={`wall-${wall.wallNumber}`}>
            <TableCell className="font-medium">Wall {wall.wallNumber}</TableCell>
            <TableCell>{wall.type}</TableCell>
            <TableCell className="text-right">
              {wall.height1}m × {wall.height2}m × {wall.length}m
            </TableCell>
            <TableCell className="text-right">{wall.squareMeters} m²</TableCell>
            <TableCell className="text-right text-green-600">{formatCurrency(wall.margin)}</TableCell>
            <TableCell className="text-right">{formatCurrency(wall.totalCost)}</TableCell>
          </TableRow>
        ))}
        <TableRow className="border-t-2">
          <TableCell colSpan={4} className="text-right font-semibold">Total:</TableCell>
          <TableCell className="text-right font-semibold text-green-600">{formatCurrency(totalMargin)}</TableCell>
          <TableCell className="text-right font-semibold">{formatCurrency(totalCost)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
