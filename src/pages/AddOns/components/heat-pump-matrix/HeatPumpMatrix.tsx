
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Thermometer, RefreshCw } from "lucide-react";
import { useHeatPumpMatrix } from "@/hooks/useHeatPumpMatrix";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

import { HeatPumpMatrixHeader } from "./components/HeatPumpMatrixHeader";
import { HeatPumpMatrixRow } from "./components/HeatPumpMatrixRow";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";

export const HeatPumpMatrix = () => {
  const { 
    matches, 
    isLoading, 
    hasErrored,
    updateMatch, 
    deleteMatch, 
    createDefaultMatches,
    heatPumpProducts,
    fetchMatches
  } = useHeatPumpMatrix();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreatingDefault, setIsCreatingDefault] = React.useState(false);
  const { toast } = useToast();

  const filteredMatches = matches.filter((match) => {
    const search = searchTerm.toLowerCase();
    return (
      match.pool_range.toLowerCase().includes(search) ||
      match.pool_model.toLowerCase().includes(search) ||
      match.hp_sku.toLowerCase().includes(search) ||
      match.hp_description.toLowerCase().includes(search)
    );
  });

  const handleCreateDefault = async () => {
    setIsCreatingDefault(true);
    try {
      await createDefaultMatches();
      toast({
        title: "Success",
        description: "Default heat pump assignments created",
      });
    } catch (error) {
      toast({
        title: "Error creating assignments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDefault(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchMatches();
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

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
            
            {hasErrored && (
              <Button
                variant="outline"
                onClick={handleRefresh}
                title="Try to refresh data from database"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Refresh</span>
              </Button>
            )}
            
            {(matches.length === 0 || hasErrored) && (
              <Button
                variant="default"
                onClick={handleCreateDefault}
                disabled={isCreatingDefault}
              >
                {isCreatingDefault ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add Default Heat Pump Matches</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {hasErrored && (
          <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
            Using fallback data. Database connection is unavailable. Changes won't persist.
          </div>
        )}
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
                  onCreateMissingMatches={handleCreateDefault} 
                  hasPoolData={true}
                  hasHeatPumpData={heatPumpProducts.length > 0}
                />
              ) : (
                filteredMatches.map((match) => (
                  <HeatPumpMatrixRow
                    key={match.id}
                    match={match}
                    heatPumps={heatPumpProducts}
                    onUpdate={updateMatch}
                    onDelete={deleteMatch}
                    isOffline={hasErrored}
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
