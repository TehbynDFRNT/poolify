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

interface PoolCosts {
  truckedWater: number;
  saltBags: number;
  misc: number;
  copingSupply: number;
  beam: number;
  copingLay: number;
}

const initialPoolCosts: Record<string, PoolCosts> = {
  "Latina": { truckedWater: 231, saltBags: 38, misc: 2700, copingSupply: 1231, beam: 1160, copingLay: 1215 },
  "Sovereign": { truckedWater: 157, saltBags: 29, misc: 2700, copingSupply: 1165, beam: 1130, copingLay: 1138 },
  "Empire": { truckedWater: 234, saltBags: 38, misc: 2700, copingSupply: 1369, beam: 1141, copingLay: 1315 },
  "Oxford": { truckedWater: 328, saltBags: 48, misc: 2700, copingSupply: 1409, beam: 1241, copingLay: 1440 },
  "Sheffield": { truckedWater: 363, saltBags: 57, misc: 2700, copingSupply: 1550, beam: 1365, copingLay: 1584 },
  "Avellino": { truckedWater: 338, saltBags: 48, misc: 2700, copingSupply: 1451, beam: 1268, copingLay: 1490 },
  "Palazzo": { truckedWater: 344, saltBags: 48, misc: 2700, copingSupply: 1481, beam: 1315, copingLay: 1528 },
  "Valentina": { truckedWater: 484, saltBags: 67, misc: 2700, copingSupply: 1643, beam: 1499, copingLay: 1740 },
  "Westminster": { truckedWater: 494, saltBags: 67, misc: 2700, copingSupply: 1777, beam: 1598, copingLay: 1865 },
  "Kensington": { truckedWater: 646, saltBags: 95, misc: 2700, copingSupply: 1969, beam: 1818, copingLay: 2115 },
  "Bedarra": { truckedWater: 381, saltBags: 57, misc: 2700, copingSupply: 1610, beam: 1414, copingLay: 1645 },
  "Hayman": { truckedWater: 431, saltBags: 67, misc: 2700, copingSupply: 1706, beam: 1524, copingLay: 1768 },
  "Verona": { truckedWater: 129, saltBags: 19, misc: 2700, copingSupply: 1107, beam: 1123, copingLay: 1045 },
  "Portofino": { truckedWater: 165, saltBags: 29, misc: 2700, copingSupply: 1203, beam: 1123, copingLay: 1165 },
  "Florentina": { truckedWater: 203, saltBags: 29, misc: 2700, copingSupply: 1299, beam: 1123, copingLay: 1290 },
  "Bellagio": { truckedWater: 244, saltBags: 38, misc: 2700, copingSupply: 1395, beam: 1212, copingLay: 1415 },
  "Bellino": { truckedWater: 279, saltBags: 38, misc: 2700, copingSupply: 1619, beam: 1255, copingLay: 1584 },
  "Imperial": { truckedWater: 333, saltBags: 48, misc: 2700, copingSupply: 1710, beam: 1359, copingLay: 1725 },
  "Castello": { truckedWater: 320, saltBags: 48, misc: 2700, copingSupply: 1715, beam: 1370, copingLay: 1719 },
  "Grandeur": { truckedWater: 416, saltBags: 57, misc: 2700, copingSupply: 1825, beam: 1500, copingLay: 1894 },
  "Amalfi": { truckedWater: 383, saltBags: 57, misc: 2700, copingSupply: 1869, beam: 1535, copingLay: 1921 },
  "Serenity": { truckedWater: 119, saltBags: 19, misc: 2700, copingSupply: 1049, beam: 1123, copingLay: 1045 },
  "Allure": { truckedWater: 160, saltBags: 29, misc: 2700, copingSupply: 1145, beam: 1123, copingLay: 1103 },
  "Harmony": { truckedWater: 254, saltBags: 38, misc: 2700, copingSupply: 1357, beam: 1168, copingLay: 1353 },
  "Istana": { truckedWater: 269, saltBags: 38, misc: 2700, copingSupply: 1404, beam: 1187, copingLay: 1393 },
  "Terazza": { truckedWater: 320, saltBags: 48, misc: 2700, copingSupply: 1519, beam: 1297, copingLay: 1518 },
  "Elysian": { truckedWater: 372, saltBags: 57, misc: 2700, copingSupply: 1500, beam: 1407, copingLay: 1653 },
  "Infinity 3": { truckedWater: 119, saltBags: 19, misc: 2700, copingSupply: 900, beam: 1000, copingLay: 880 },
  "Infinity 4": { truckedWater: 157, saltBags: 29, misc: 2700, copingSupply: 1470, beam: 1335, copingLay: 950 },
  "Terrace 3": { truckedWater: 119, saltBags: 19, misc: 2700, copingSupply: 900, beam: 1000, copingLay: 880 }
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
                    <TableHead className="whitespace-nowrap">Misc.</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Supply</TableHead>
                    <TableHead className="whitespace-nowrap">Beam</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Lay</TableHead>
                    <TableHead className="whitespace-nowrap">Dig Type</TableHead>
                    <TableHead className="whitespace-nowrap">Excavation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools?.map((pool) => {
                    const costs = initialPoolCosts[pool.name] || {
                      truckedWater: 0,
                      saltBags: 0,
                      misc: 2700,
                      copingSupply: 0,
                      beam: 0,
                      copingLay: 0
                    };
                    
                    return (
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
                            defaultValue={costs.truckedWater}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-32"
                            defaultValue={costs.saltBags}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-32"
                            defaultValue={costs.misc}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-32"
                            defaultValue={costs.copingSupply}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-32"
                            defaultValue={costs.beam}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="w-32"
                            defaultValue={costs.copingLay}
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
                    );
                  })}
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
