
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PoolRangeSectionProps {
  range: string;
  blankets: PoolBlanket[];
  onEditBlanket: (blanket: PoolBlanket) => void;
  onDeleteBlanket: (id: string) => void;
  activeTab: "all" | "blankets" | "heatpumps";
}

export const PoolRangeSection = ({
  range,
  blankets,
  onEditBlanket,
  onDeleteBlanket,
  activeTab
}: PoolRangeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Take the first blanket to get descriptions (since they're all the same for a range)
  const blanketDescription = blankets.length > 0 ? blankets[0].blanket_description : "";
  const heatpumpDescription = blankets.length > 0 ? blankets[0].heatpump_description : "";

  const showBlankets = activeTab === "all" || activeTab === "blankets";
  const showHeatPumps = activeTab === "all" || activeTab === "heatpumps";

  return (
    <Card className="overflow-hidden border shadow animate-fadeIn">
      <CardHeader 
        className="flex flex-row items-center justify-between py-3 cursor-pointer bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg font-semibold flex items-center">
          <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
          {range} Range
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({blankets.length} model{blankets.length !== 1 ? 's' : ''})
          </span>
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 space-y-4">
          {/* Blankets & Rollers Section */}
          {showBlankets && (
            <div className="rounded-lg bg-card overflow-hidden border">
              <div className="bg-muted/30 px-4 py-2">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-primary mr-2"></span>
                  <h3 className="font-medium">Pool Blankets & Rollers</h3>
                </div>
                <div className="text-sm text-muted-foreground mt-1 ml-5">
                  <p>{blanketDescription}</p>
                </div>
              </div>
              
              <div className="p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pool Model</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">RRP</TableHead>
                      <TableHead className="text-right">Trade</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                      <TableHead className="text-right">Profit %</TableHead>
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
            </div>
          )}
          
          {/* Heat Pumps Section */}
          {showHeatPumps && (
            <div className="rounded-lg bg-card overflow-hidden border">
              <div className="bg-blue-50 px-4 py-2">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                  <h3 className="font-medium">Heat Pumps</h3>
                </div>
                <div className="text-sm text-muted-foreground mt-1 ml-5">
                  <p>{heatpumpDescription}</p>
                </div>
              </div>
              
              <div className="p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pool Model</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">RRP</TableHead>
                      <TableHead className="text-right">Trade</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                      <TableHead className="text-right">Profit %</TableHead>
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
        </CardContent>
      )}
    </Card>
  );
};
