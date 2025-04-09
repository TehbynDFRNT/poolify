
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall } from "@/types/retaining-wall";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetainingWallSection } from "./RetainingWallSection";

interface RetainingWallCalculatorProps {
  customerId?: string | null;
}

export const RetainingWallCalculator: React.FC<RetainingWallCalculatorProps> = ({ 
  customerId 
}) => {
  // Load retaining wall types
  const { data: retainingWalls, isLoading: isLoadingWalls } = useQuery({
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

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Retaining Wall Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <Tabs defaultValue="wall1" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="wall1">Wall 1</TabsTrigger>
            <TabsTrigger value="wall2">Wall 2</TabsTrigger>
            <TabsTrigger value="wall3">Wall 3</TabsTrigger>
            <TabsTrigger value="wall4">Wall 4</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wall1">
            <RetainingWallSection 
              customerId={customerId || null} 
              wallNumber={1} 
              retainingWalls={retainingWalls} 
              isLoadingWalls={isLoadingWalls} 
            />
          </TabsContent>
          
          <TabsContent value="wall2">
            <RetainingWallSection 
              customerId={customerId || null} 
              wallNumber={2} 
              retainingWalls={retainingWalls} 
              isLoadingWalls={isLoadingWalls} 
            />
          </TabsContent>
          
          <TabsContent value="wall3">
            <RetainingWallSection 
              customerId={customerId || null} 
              wallNumber={3} 
              retainingWalls={retainingWalls} 
              isLoadingWalls={isLoadingWalls} 
            />
          </TabsContent>
          
          <TabsContent value="wall4">
            <RetainingWallSection 
              customerId={customerId || null} 
              wallNumber={4} 
              retainingWalls={retainingWalls} 
              isLoadingWalls={isLoadingWalls} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
