
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { useState, useEffect } from "react";

const poolDigTypeMap: Record<string, string> = {
  "Latina": "Dig 2",
  "Sovereign": "Dig 3",
  "Empire": "Dig 3",
  "Oxford": "Dig 4",
  "Sheffield": "Dig 4",
  "Avellino": "Dig 4",
  "Palazzo": "Dig 4",
  "Valentina": "Dig 5",
  "Westminster": "Dig 6",
  "Kensington": "Dig 6",
  "Bedarra": "Dig 4",
  "Hayman": "Dig 4",
  "Verona": "Dig 2",
  "Portofino": "Dig 3",
  "Florentina": "Dig 3",
  "Bellagio": "Dig 3",
  "Bellino": "Dig 3",
  "Imperial": "Dig 4",
  "Castello": "Dig 4",
  "Grandeur": "Dig 4",
  "Amalfi": "Dig 5",
  "Serenity": "Dig 2",
  "Allure": "Dig 3",
  "Harmony": "Dig 3",
  "Istana": "Dig 4",
  "Terazza": "Dig 4",
  "Elysian": "Dig 5",
  "Infinity 3": "Dig 1",
  "Infinity 4": "Dig 1",
  "Terrace 3": "Dig 1"
};

const PoolSpecificCosts = () => {
  const [selectedDigTypes, setSelectedDigTypes] = useState<Record<string, string>>({});

  const { data: pools, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
  });

  const { data: digTypes, isLoading: isLoadingDigTypes } = useQuery({
    queryKey: ["digTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*");
      
      if (error) throw error;
      return data as ExcavationDigType[];
    },
  });

  // Set initial dig types when data is loaded
  useEffect(() => {
    if (pools && digTypes) {
      const initialDigTypes: Record<string, string> = {};
      pools.forEach(pool => {
        const mappedDigType = poolDigTypeMap[pool.name];
        if (mappedDigType) {
          const digType = digTypes.find(dt => dt.name === mappedDigType);
          if (digType) {
            initialDigTypes[pool.id] = digType.id;
          }
        }
      });
      setSelectedDigTypes(initialDigTypes);
    }
  }, [pools, digTypes]);

  const calculateExcavationCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  const getExcavationCost = (poolId: string) => {
    const selectedDigTypeId = selectedDigTypes[poolId];
    if (!selectedDigTypeId || !digTypes) return null;
    
    const digType = digTypes.find(dt => dt.id === selectedDigTypeId);
    if (!digType) return null;

    return calculateExcavationCost(digType);
  };

  if (isLoadingPools || isLoadingDigTypes) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/construction-costs">Construction Costs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Pool Specific Costs</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pool Specific Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap sticky left-0 z-20 bg-background">Range</TableHead>
                    <TableHead className="whitespace-nowrap sticky left-[80px] z-20 bg-background">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Length</TableHead>
                    <TableHead className="whitespace-nowrap">Width</TableHead>
                    <TableHead className="whitespace-nowrap">Shallow End</TableHead>
                    <TableHead className="whitespace-nowrap">Deep End</TableHead>
                    <TableHead className="whitespace-nowrap">Pea Gravel/Backfill</TableHead>
                    <TableHead className="whitespace-nowrap">Install Fee</TableHead>
                    <TableHead className="whitespace-nowrap">Trucked Water</TableHead>
                    <TableHead className="whitespace-nowrap">Salt Bags</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Supply</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Lay</TableHead>
                    <TableHead className="whitespace-nowrap">Beam</TableHead>
                    <TableHead className="whitespace-nowrap">Dig Type</TableHead>
                    <TableHead className="whitespace-nowrap">Excavation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools?.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell className="sticky left-0 z-20 bg-background">{pool.range}</TableCell>
                      <TableCell className="sticky left-[80px] z-20 bg-background">{pool.name}</TableCell>
                      <TableCell>{pool.length}m</TableCell>
                      <TableCell>{pool.width}m</TableCell>
                      <TableCell>{pool.depth_shallow}m</TableCell>
                      <TableCell>{pool.depth_deep}m</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={selectedDigTypes[pool.id]}
                          onValueChange={(value) => {
                            setSelectedDigTypes(prev => ({
                              ...prev,
                              [pool.id]: value
                            }));
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {digTypes?.map((digType) => (
                              <SelectItem key={digType.id} value={digType.id}>
                                {digType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {getExcavationCost(pool.id) ? 
                          formatCurrency(getExcavationCost(pool.id)!) :
                          "-"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecificCosts;
