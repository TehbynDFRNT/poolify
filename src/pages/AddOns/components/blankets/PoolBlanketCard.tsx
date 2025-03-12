
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
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{blanket.pool_model}</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit(blanket)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
              onClick={() => onDelete(blanket.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Blanket Section */}
          <div className="space-y-3">
            <div className="bg-primary/10 rounded p-2">
              <h4 className="font-medium text-primary mb-1">Blanket</h4>
              <div className="text-sm">{blanket.blanket_description}</div>
              <div className="text-xs text-muted-foreground mt-1">SKU: {blanket.blanket_sku}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="font-medium">RRP</div>
                <div>{formatCurrency(blanket.blanket_rrp)}</div>
              </div>
              <div>
                <div className="font-medium">Trade</div>
                <div>{formatCurrency(blanket.blanket_trade)}</div>
              </div>
              <div>
                <div className="font-medium">Margin</div>
                <div className="flex items-center gap-1">
                  <span>{formatCurrency(blanket.blanket_margin)}</span>
                  <span className="text-xs text-muted-foreground">({blanketMarginPercent.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Heat Pump Section */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded p-2">
              <h4 className="font-medium text-blue-600 mb-1">Heat Pump</h4>
              <div className="text-sm">{blanket.heatpump_description}</div>
              <div className="text-xs text-muted-foreground mt-1">SKU: {blanket.heatpump_sku}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="font-medium">RRP</div>
                <div>{formatCurrency(blanket.heatpump_rrp)}</div>
              </div>
              <div>
                <div className="font-medium">Trade</div>
                <div>{formatCurrency(blanket.heatpump_trade)}</div>
              </div>
              <div>
                <div className="font-medium">Margin</div>
                <div className="flex items-center gap-1">
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
