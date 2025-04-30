
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Thermometer } from "lucide-react";
import { useHeatPumpMatrix } from "@/hooks/useHeatPumpMatrix";
import { useToast } from "@/hooks/use-toast";

import { HeatPumpMatrixHeader } from "./components/HeatPumpMatrixHeader";
import { HeatPumpMatrixRow } from "./components/HeatPumpMatrixRow";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";

export const HeatPumpMatrix = () => {
  const { 
    matches, 
    isLoading, 
    updateMatch, 
    deleteMatch, 
    createMissingPoolMatches,
    heatPumpProducts,
    fetchMatches
  } = useHeatPumpMatrix();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingMissing, setIsCreatingMissing] = useState(false);
  const { toast } = useToast();

  // Ensure data is fetched on initial load
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const filteredMatches = matches.filter((match) => {
    const search = searchTerm.toLowerCase();
    return (
      match.pool_range.toLowerCase().includes(search) ||
      match.pool_model.toLowerCase().includes(search) ||
      match.hp_sku.toLowerCase().includes(search) ||
      match.hp_description.toLowerCase().includes(search)
    );
  });

  const handleCreateMissing = async () => {
    setIsCreatingMissing(true);
    try {
      await createMissingPoolMatches();
      toast({
        title: "Success",
        description: "Heat pump assignments created for all pools",
      });
    } catch (error) {
      toast({
        title: "Error creating assignments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingMissing(false);
    }
  };

  // Determine if we have pools and heat pumps data
  const hasPoolData = matches.length > 0 || (heatPumpProducts.length > 0 && !isLoading);
  const hasHeatPumpData = heatPumpProducts.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <CardTitle>Heat Pump Matrix</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {hasPoolData && hasHeatPumpData && (
              <Button
                variant="default"
                onClick={handleCreateMissing}
                disabled={isCreatingMissing || isLoading}
              >
                {isCreatingMissing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add Missing Pool Matches</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <HeatPumpMatrixHeader />
            <TableBody>
              {isLoading ? (
                <LoadingState />
              ) : filteredMatches.length === 0 ? (
                <EmptyState 
                  onCreateMissingMatches={handleCreateMissing} 
                  hasPoolData={hasPoolData}
                  hasHeatPumpData={hasHeatPumpData}
                />
              ) : (
                filteredMatches.map((match) => (
                  <HeatPumpMatrixRow
                    key={match.id}
                    match={match}
                    heatPumps={heatPumpProducts}
                    onUpdate={updateMatch}
                    onDelete={deleteMatch}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
