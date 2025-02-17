
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import type { Pool } from "@/types/pool";

interface PoolInsert {
  name: string;
  dig_level: string | null;
  pool_type_id: string | null;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  waterline_l_m: number | null;
  volume_liters: number | null;
  salt_volume_bags: number | null;
  salt_volume_bags_fixed: number | null;
  weight_kg: number | null;
  minerals_kg_initial: number | null;
  minerals_kg_topup: number | null;
  buy_price_ex_gst: number | null;
  buy_price_inc_gst: number | null;
}

const PoolSpecifications = () => {
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (pools: PoolInsert[]) => {
      const { error } = await supabase
        .from("pool_specifications")
        .insert(pools);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specifications imported successfully");
    },
    onError: (error) => {
      toast.error("Failed to import pool specifications");
      console.error(error);
    },
  });

  const handleImport = (data: any[][]) => {
    try {
      // Skip header row and map Excel data to pool specifications
      const pools: PoolInsert[] = data.slice(1).map((row, index) => {
        const length = Number(row[3]);
        const width = Number(row[4]);
        const depth_shallow = Number(row[5]);
        const depth_deep = Number(row[6]);

        if (isNaN(length) || isNaN(width) || isNaN(depth_shallow) || isNaN(depth_deep)) {
          throw new Error(`Row ${index + 2}: Length, width, and depths must be valid numbers`);
        }

        return {
          name: row[0] || 'Unnamed Pool',
          dig_level: row[1] || null,
          pool_type_id: row[2] || null,
          length,
          width,
          depth_shallow,
          depth_deep,
          waterline_l_m: row[7] ? Number(row[7]) : null,
          volume_liters: row[8] ? Number(row[8]) : null,
          salt_volume_bags: row[9] ? Number(row[9]) : null,
          salt_volume_bags_fixed: row[10] ? Number(row[10]) : null,
          weight_kg: row[11] ? Number(row[11]) : null,
          minerals_kg_initial: row[12] ? Number(row[12]) : null,
          minerals_kg_topup: row[13] ? Number(row[13]) : null,
          buy_price_ex_gst: row[14] ? Number(row[14]) : null,
          buy_price_inc_gst: row[15] ? Number(row[15]) : null,
        };
      });

      importMutation.mutate(pools);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process data");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Pool Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onSheetData={handleImport} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
