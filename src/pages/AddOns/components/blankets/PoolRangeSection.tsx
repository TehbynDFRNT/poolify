
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PoolBlanket } from "@/types/pool-blanket";
import { PoolBlanketCard } from "./PoolBlanketCard";
import { HeatPumpRow } from "./HeatPumpRow";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
  
  // Take the first blanket to get the blanket description (since they're all the same)
  const blanketDescription = blankets.length > 0 ? blankets[0].blanket_description : "";

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
        <div className="p-4 bg-card space-y-6">
          {/* Blankets & Rollers Section */}
          <div>
            <div className="flex items-center mb-3">
              <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
              <h3 className="font-medium">Pool Blankets & Rollers</h3>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              <p>{blanketDescription}</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool Model</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">RRP</TableHead>
                  <TableHead className="text-right">Trade</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead>Profit %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blankets.map((blanket) => (
                  <PoolBlanketCard
                    key={`blanket-${blanket.id}`}
                    blanket={blanket}
                    onEdit={onEditBlanket}
                    onDelete={onDeleteBlanket}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Heat Pumps Section */}
          <div>
            <div className="flex items-center mb-3">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              <h3 className="font-medium">Heat Pumps</h3>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool Model</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">RRP</TableHead>
                  <TableHead className="text-right">Trade</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead>Profit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blankets.map((blanket) => (
                  <HeatPumpRow 
                    key={`heatpump-${blanket.id}`} 
                    blanket={blanket} 
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
