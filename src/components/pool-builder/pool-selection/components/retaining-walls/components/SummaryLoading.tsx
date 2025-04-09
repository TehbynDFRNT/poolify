
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryLoading: React.FC = () => {
  return (
    <div className="py-6 space-y-4">
      <Skeleton className="h-8 w-2/3 mb-6" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/6" />
      </div>
      <div className="mt-6 pt-4 border-t">
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
};
