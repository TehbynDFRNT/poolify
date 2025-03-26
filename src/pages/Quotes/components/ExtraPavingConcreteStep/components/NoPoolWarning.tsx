
import React from "react";
import { AlertCircle } from "lucide-react";

export const NoPoolWarning = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start">
      <AlertCircle className="text-amber-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
      <p className="text-amber-800 text-sm">
        No pool has been selected for this quote. Some features may be limited.
      </p>
    </div>
  );
};
