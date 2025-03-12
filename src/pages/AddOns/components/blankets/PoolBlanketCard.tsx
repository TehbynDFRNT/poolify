
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
      <div className="bg-muted py-2 px-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-base">{blanket.pool_model}</h3>
        <div className="flex space-x-1">
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
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Blanket Section */}
          <div className="space-y-3">
            <div className="bg-primary/5 rounded p-3 border border-primary/10">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <h4 className="font-medium text-sm text-primary">Blanket</h4>
              </div>
              <div className="text-sm">{blanket.blanket_description}</div>
              <div className="text-xs text-muted-foreground mt-1">SKU: {blanket.blanket_sku}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">RRP</div>
                <div className="font-medium">{formatCurrency(blanket.blanket_rrp)}</div>
              </div>
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">Trade</div>
                <div className="font-medium">{formatCurrency(blanket.blanket_trade)}</div>
              </div>
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">Margin</div>
                <div className="font-medium flex items-center gap-1">
                  <span>{formatCurrency(blanket.blanket_margin)}</span>
                  <span className="text-xs text-muted-foreground">({blanketMarginPercent.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Heat Pump Section */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded p-3 border border-blue-100">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <h4 className="font-medium text-sm text-blue-600">Heat Pump</h4>
              </div>
              <div className="text-sm">{blanket.heatpump_description}</div>
              <div className="text-xs text-muted-foreground mt-1">SKU: {blanket.heatpump_sku}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">RRP</div>
                <div className="font-medium">{formatCurrency(blanket.heatpump_rrp)}</div>
              </div>
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">Trade</div>
                <div className="font-medium">{formatCurrency(blanket.heatpump_trade)}</div>
              </div>
              <div className="px-2 py-1 bg-gray-50 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-1">Margin</div>
                <div className="font-medium flex items-center gap-1">
                  <span>{formatCurrency(blanket.heatpump_margin)}</span>
                  <span className="text-xs text-muted-foreground">({heatpumpMarginPercent.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
