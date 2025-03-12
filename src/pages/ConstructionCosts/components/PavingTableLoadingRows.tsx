
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const PavingTableLoadingRows: React.FC = () => {
  return (
    <>
      {Array(3).fill(0).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-6" /></TableCell>
        </TableRow>
      ))}
      <TableRow className="font-semibold bg-muted/50">
        <TableCell>Cat Total</TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </>
  );
};
