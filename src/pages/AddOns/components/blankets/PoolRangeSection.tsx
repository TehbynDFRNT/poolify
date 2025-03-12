
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PoolBlanket } from "@/types/pool-blanket";
import { PoolBlanketCard } from "./PoolBlanketCard";

interface PoolRangeSectionProps {
  range: string;
  blankets: PoolBlanket[];
  onEditBlanket: (blanket: PoolBlanket) => void;
  onDeleteBlanket: (id: string) => void;
}

export const PoolRangeSection = ({
  range,
  blankets,
  onEditBlanket,
  onDeleteBlanket,
}: PoolRangeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between bg-white p-4 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium flex items-center">
          <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
          {range} Range
          <span className="ml-2 text-sm text-muted-foreground">({blankets.length} items)</span>
        </h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blankets.map((blanket) => (
              <PoolBlanketCard
                key={blanket.id}
                blanket={blanket}
                onEdit={onEditBlanket}
                onDelete={onDeleteBlanket}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
