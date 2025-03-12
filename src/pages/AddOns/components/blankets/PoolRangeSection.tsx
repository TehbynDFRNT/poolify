
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
    <div className="mb-6">
      <div
        className="flex items-center justify-between bg-muted p-3 rounded-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold">{range} Range</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {blankets.map((blanket) => (
            <PoolBlanketCard
              key={blanket.id}
              blanket={blanket}
              onEdit={onEditBlanket}
              onDelete={onDeleteBlanket}
            />
          ))}
        </div>
      )}
    </div>
  );
};
