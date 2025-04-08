
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFormulaCalculations } from "@/hooks/calculations/useFormulaCalculations";
import { formatCurrency } from "@/utils/format";

interface ExtraPavingConcretingProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcreting: React.FC<ExtraPavingConcretingProps> = ({ pool, customerId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const { pavingCategoryTotals, isLoading } = useFormulaCalculations();

  // Get selected category details
  const selectedCategoryDetails = pavingCategoryTotals.find(
    cat => cat.id === selectedCategory
  );

  // Calculate total cost
  const totalCost = selectedCategoryDetails && squareMeters > 0
    ? selectedCategoryDetails.totalRate * squareMeters
    : 0;

  // Format square meters with max 2 decimal places
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSquareMeters(isNaN(value) ? 0 : value);
  };

  return (
    <Card>
      <CardHeader className="bg-white pb-2">
        <h3 className="text-xl font-semibold">Extra Paving and Concreting</h3>
        <p className="text-muted-foreground">
          Add extra paving and concreting options to your pool project
        </p>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="paving-category">Paving Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={isLoading}
            >
              <SelectTrigger id="paving-category" className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {pavingCategoryTotals.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="square-meters">Square Meters</Label>
            <Input
              id="square-meters"
              type="number"
              step="0.1"
              min="0"
              value={squareMeters || ""}
              onChange={handleSquareMetersChange}
              placeholder="Enter area in square meters"
              className="mt-2"
              disabled={!selectedCategory}
            />
          </div>
        </div>
        
        {selectedCategoryDetails && squareMeters > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Cost Summary</h4>
            <div className="grid grid-cols-2 gap-y-2">
              <div>Rate per m²:</div>
              <div className="text-right">{formatCurrency(selectedCategoryDetails.totalRate)}</div>
              
              <div>Area:</div>
              <div className="text-right">{squareMeters} m²</div>
              
              <div className="font-medium border-t pt-2 mt-1">Total Cost:</div>
              <div className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(totalCost)}</div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Rate Breakdown (per m²)</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>Paver Cost:</div>
                <div className="text-right">{formatCurrency(selectedCategoryDetails.paverCost)}</div>
                
                <div>Wastage Cost:</div>
                <div className="text-right">{formatCurrency(selectedCategoryDetails.wastageCost)}</div>
                
                <div>Margin Cost:</div>
                <div className="text-right">{formatCurrency(selectedCategoryDetails.marginCost)}</div>
                
                <div className="font-medium">Materials Subtotal:</div>
                <div className="text-right font-medium">{formatCurrency(selectedCategoryDetails.categoryTotal)}</div>
                
                <div>Concrete Cost:</div>
                <div className="text-right">{formatCurrency(selectedCategoryDetails.totalRate - selectedCategoryDetails.categoryTotal)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
