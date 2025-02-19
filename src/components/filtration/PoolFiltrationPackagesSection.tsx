
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { FiltrationPackageDetails } from "../pools/components/FiltrationPackageDetails";
import { calculateFiltrationTotal } from "../pools/utils/filtrationCalculations";

interface PoolFiltrationPackagesSectionProps {
  packages: PackageWithComponents[] | undefined;
}

const DEFAULT_PACKAGE_MAPPING: Record<string, number> = {
  "Latina": 1,
  "Sovereign": 1,
  "Empire": 1,
  "Oxford": 1,
  "Sheffield": 1,
  "Avellino": 1,
  "Palazzo": 1,
  "Valentina": 2,
  "Westminster": 2,
  "Kensington": 3,
  "Bedarra": 1,
  "Hayman": 1,
  "Verona": 1,
  "Portofino": 1,
  "Florentina": 1,
  "Bellagio": 1,
  "Bellino": 1,
  "Imperial": 1,
  "Castello": 1,
  "Grandeur": 1,
  "Amalfi": 1,
  "Serenity": 1,
  "Allure": 1,
  "Harmony": 1,
  "Istana": 1,
  "Terazza": 1,
  "Elysian": 1,
  "Infinity 3": 1,
  "Infinity 4": 1,
  "Terrace 3": 1,
};

export function PoolFiltrationPackagesSection({ packages }: PoolFiltrationPackagesSectionProps) {
  const [selectedPackages, setSelectedPackages] = React.useState<Record<string, string>>({});
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  const { data: pools } = useQuery({
    queryKey: ["pool-specifications"],
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

  React.useEffect(() => {
    if (packages && pools) {
      const initialSelections: Record<string, string> = {};
      
      pools.forEach((pool) => {
        const targetOption = DEFAULT_PACKAGE_MAPPING[pool.name];
        if (targetOption) {
          const matchingPackage = packages.find(p => p.display_order === targetOption);
          if (matchingPackage) {
            initialSelections[pool.id] = matchingPackage.id;
          }
        }
      });

      setSelectedPackages(initialSelections);
    }
  }, [packages, pools]);

  const handlePackageChange = (poolId: string, packageId: string) => {
    setSelectedPackages(prev => ({
      ...prev,
      [poolId]: packageId
    }));
    setExpandedRow(poolId); // Expand the row when package is selected
  };

  const getSelectedPackageDetails = (poolId: string) => {
    const selectedPackageId = selectedPackages[poolId];
    return packages?.find(p => p.id === selectedPackageId);
  };

  const toggleExpandedRow = (poolId: string) => {
    setExpandedRow(expandedRow === poolId ? null : poolId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Filtration Package Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool Name</TableHead>
              <TableHead>Filtration Package</TableHead>
              <TableHead className="text-right">Package Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.map((pool) => (
              <React.Fragment key={pool.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpandedRow(pool.id)}
                >
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>
                    <Select
                      value={selectedPackages[pool.id] || ""}
                      onValueChange={(value) => handlePackageChange(pool.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages?.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            Option {pkg.display_order}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calculateFiltrationTotal(getSelectedPackageDetails(pool.id)))}
                  </TableCell>
                </TableRow>
                {expandedRow === pool.id && getSelectedPackageDetails(pool.id) && (
                  <FiltrationPackageDetails
                    package={getSelectedPackageDetails(pool.id)!}
                    colSpan={3}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
