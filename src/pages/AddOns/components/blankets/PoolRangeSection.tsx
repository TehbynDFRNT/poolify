
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
    <div className="mb-6 rounded-xl overflow-hidden border shadow">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-primary/10 to-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
          {range} Range
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({blankets.length} model{blankets.length !== 1 ? 's' : ''})
          </span>
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 bg-card">
          <div className="grid grid-cols-1 gap-4">
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
