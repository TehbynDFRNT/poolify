
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryLoading: React.FC = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-40 ml-auto" />
    </div>
  );
};
