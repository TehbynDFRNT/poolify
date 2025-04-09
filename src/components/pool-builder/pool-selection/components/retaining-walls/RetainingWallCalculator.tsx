
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall, WALL_TYPES } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";

export const RetainingWallCalculator = () => {
  const [selectedWallType, setSelectedWallType] = useState<string>("");
  const [height1, setHeight1] = useState<number>(0);
  const [height2, setHeight2] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedWall, setSelectedWall] = useState<RetainingWall | null>(null);
  const [marginAmount, setMarginAmount] = useState<number>(0);

  const { data: retainingWalls, isLoading } = useQuery({
    queryKey: ["retainingWalls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retaining_walls")
        .select("*")
        .order('type', { ascending: true });

      if (error) {
        console.error("Error fetching retaining walls:", error);
        throw error;
      }

      return data as RetainingWall[];
    },
  });

  // Calculate square meters when dimensions change
  useEffect(() => {
    if (height1 && height2 && length) {
      // Formula: ((Height 1 + Height 2) ÷ 2) × Length
      const calculatedSquareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);
      setSquareMeters(parseFloat(calculatedSquareMeters.toFixed(2)));
    } else {
      setSquareMeters(0);
    }
  }, [height1, height2, length]);

  // Calculate total cost when square meters or wall type changes
  useEffect(() => {
    if (squareMeters && selectedWall) {
      // Formula: Square Meters × Total Rate
      const calculatedTotalCost = squareMeters * selectedWall.total;
      setTotalCost(parseFloat(calculatedTotalCost.toFixed(2)));
      
      // Calculate margin amount based on the margin percentage in the selected wall
      const calculatedMarginAmount = squareMeters * selectedWall.margin;
      setMarginAmount(parseFloat(calculatedMarginAmount.toFixed(2)));
    } else {
      setTotalCost(0);
      setMarginAmount(0);
    }
  }, [squareMeters, selectedWall]);

  // Update selected wall when wall type changes
  useEffect(() => {
    if (retainingWalls && selectedWallType) {
      const wall = retainingWalls.find(w => w.type === selectedWallType);
      setSelectedWall(wall || null);
    } else {
      setSelectedWall(null);
    }
  }, [selectedWallType, retainingWalls]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    setter(value);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold">Retaining Wall Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="wallType">Wall Type</Label>
              <Select
                value={selectedWallType}
                onValueChange={setSelectedWallType}
              >
                <SelectTrigger id="wallType" className="w-full">
                  <SelectValue placeholder="Select a wall type" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading">Loading wall types...</SelectItem>
                  ) : (
                    retainingWalls?.map((wall) => (
                      <SelectItem key={wall.id} value={wall.type}>
                        {wall.type} ({formatCurrency(wall.total)}/m²)
                      </SelectItem>
                    )) || []
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height1">Height 1 (m)</Label>
                <Input
                  id="height1"
                  type="number"
                  min="0"
                  step="0.1"
                  value={height1 || ""}
                  onChange={handleInputChange(setHeight1)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="height2">Height 2 (m)</Label>
                <Input
                  id="height2"
                  type="number"
                  min="0"
                  step="0.1"
                  value={height2 || ""}
                  onChange={handleInputChange(setHeight2)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="length">Length (m)</Label>
                <Input
                  id="length"
                  type="number"
                  min="0"
                  step="0.1"
                  value={length || ""}
                  onChange={handleInputChange(setLength)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {selectedWall && (
            <div className="bg-slate-50 rounded-md p-3 border mt-2">
              <h4 className="font-medium text-sm mb-2">Wall Type Details:</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Base Rate:</p>
                  <p>{formatCurrency(selectedWall.rate)}/m²</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Extra Rate:</p>
                  <p>{formatCurrency(selectedWall.extra_rate)}/m²</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Margin:</p>
                  <p>{formatCurrency(selectedWall.margin)}/m²</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Results section */}
          <div className="mt-6 bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Calculation Results:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Square Meters:</p>
                <p className="text-lg font-medium">{squareMeters} m²</p>
                <p className="text-xs text-muted-foreground mt-1">((Height 1 + Height 2) ÷ 2) × Length</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin Amount:</p>
                <p className="text-lg font-medium text-green-600">{formatCurrency(marginAmount)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {squareMeters} m² × {selectedWall ? formatCurrency(selectedWall.margin) : '$0.00'}/m²
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost:</p>
                <p className="text-lg font-medium">{formatCurrency(totalCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {squareMeters} m² × {selectedWall ? formatCurrency(selectedWall.total) : '$0.00'}/m²
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
