
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Pool } from "@/types/pool";
import AddPoolForm from "@/components/pools/AddPoolForm";
import PoolTable from "@/components/pools/PoolTable";

const PoolSpecifications = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: pools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .order("range")
        .order("name");
      if (error) throw error;
      return (data || []) as Pool[];
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pool Specifications</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pool
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && <AddPoolForm onClose={() => setShowForm(false)} />}
          {pools && <PoolTable pools={pools} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
