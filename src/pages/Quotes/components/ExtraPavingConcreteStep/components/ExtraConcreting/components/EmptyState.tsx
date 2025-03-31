
import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-md border border-dashed border-gray-300">
      <p className="text-muted-foreground text-center">
        No extra concreting types available.
      </p>
      <p className="text-muted-foreground text-center text-sm mt-2">
        Add them in the Construction Costs section first.
      </p>
    </div>
  );
};
