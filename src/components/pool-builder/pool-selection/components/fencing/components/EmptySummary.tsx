
import React from "react";
import { Fence } from "lucide-react";

export const EmptySummary: React.FC = () => {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <Fence className="h-10 w-10 mx-auto mb-3 opacity-50" />
      <h3 className="text-lg font-medium mb-1">No Fencing Data</h3>
      <p>Add fencing options above to see the summary</p>
    </div>
  );
};
