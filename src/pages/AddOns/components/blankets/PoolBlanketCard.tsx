
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PoolBlanket, calculateMarginPercentage } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";

interface PoolBlanketCardProps {
  blanket: PoolBlanket;
  onEdit: (blanket: PoolBlanket) => void;
  onDelete: (id: string) => void;
}

export const PoolBlanketCard = ({ blanket, onEdit, onDelete }: PoolBlanketCardProps) => {
  const blanketMarginPercent = calculateMarginPercentage(
    blanket.blanket_rrp,
    blanket.blanket_trade
  );
  
  const heatpumpMarginPercent = calculateMarginPercentage(
    blanket.heatpump_rrp,
    blanket.heatpump_trade
  );

  // Calculate percentage for progress bars
  const maxMargin = 50; // 50% as a sensible ceiling for visual display
  const blanketBarWidth = Math.min(blanketMarginPercent, maxMargin) * 2;
  const heatpumpBarWidth = Math.min(heatpumpMarginPercent, maxMargin) * 2;

  return (
    <Card className="border overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Header/Model section */}
        <div className="flex justify-between items-center p-4 bg-muted/30 border-b md:border-b-0 md:border-r md:w-64 md:flex-shrink-0">
          <div>
            <h3 className="font-medium text-lg">{blanket.pool_model}</h3>
            <p className="text-sm text-muted-foreground">Model specifications</p>
          </div>
          <div className="flex md:hidden space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(blanket)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
              onClick={() => onDelete(blanket.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blanket Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                <h4 className="font-medium">Pool Blanket</h4>
              </div>
              
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">{blanket.blanket_description}</div>
                  <div className="text-xs text-muted-foreground">SKU: {blanket.blanket_sku}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">RRP</div>
                    <div className="font-medium">{formatCurrency(blanket.blanket_rrp)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Trade</div>
                    <div className="font-medium">{formatCurrency(blanket.blanket_trade)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Margin</div>
                    <div className="font-medium">{formatCurrency(blanket.blanket_margin)}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Profit Margin</span>
                    <span className="font-medium">{blanketMarginPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${blanketBarWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Heat Pump Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <h4 className="font-medium">Heat Pump</h4>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">{blanket.heatpump_description}</div>
                  <div className="text-xs text-muted-foreground">SKU: {blanket.heatpump_sku}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">RRP</div>
                    <div className="font-medium">{formatCurrency(blanket.heatpump_rrp)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Trade</div>
                    <div className="font-medium">{formatCurrency(blanket.heatpump_trade)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Margin</div>
                    <div className="font-medium">{formatCurrency(blanket.heatpump_margin)}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Profit Margin</span>
                    <span className="font-medium">{heatpumpMarginPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${heatpumpBarWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons for desktop */}
        <div className="hidden md:flex flex-col justify-center items-center space-y-2 p-4 border-l">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => onEdit(blanket)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive/90"
            onClick={() => onDelete(blanket.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
