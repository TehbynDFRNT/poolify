import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface SiteConditionsSelectorProps {
  accessGrade: string | undefined;
  onAccessGradeChange: (value: string) => void;
  distanceFromTruck: string | undefined;
  onDistanceFromTruckChange: (value: string) => void;
  poolShellDelivery: string | undefined;
  onPoolShellDeliveryChange: (value: string) => void;
  sewerDiversion: string | undefined;
  onSewerDiversionChange: (value: string) => void;
  stormwaterDiversion: string | undefined;
  onStormwaterDiversionChange: (value: string) => void;
  onAutoAddRequirement?: (requirement: {
    description: string;
    cost: number;
    margin: number;
  }) => void;
}

export const SiteConditionsSelector: React.FC<SiteConditionsSelectorProps> = ({
  accessGrade,
  onAccessGradeChange,
  distanceFromTruck,
  onDistanceFromTruckChange,
  poolShellDelivery,
  onPoolShellDeliveryChange,
  sewerDiversion,
  onSewerDiversionChange,
  stormwaterDiversion,
  onStormwaterDiversionChange,
  onAutoAddRequirement,
}) => {
  // Handle stormwater diversion auto-calculation
  useEffect(() => {
    if (stormwaterDiversion === "Yes" && onAutoAddRequirement) {
      onAutoAddRequirement({
        description: "Stormwater Diversion",
        cost: 600,
        margin: 0
      });
    }
  }, [stormwaterDiversion]); // Remove onAutoAddRequirement from deps to prevent loops
  return (
    <div>
      <div className="pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Site Conditions</h3>
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-4">
          {/* Access Grade */}
          <div>
            <Label htmlFor="access-grade">Site Access Grade</Label>
            <Select value={accessGrade || "none"} onValueChange={onAccessGradeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select access grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                <SelectItem value="1.5m+">1.5m+</SelectItem>
                <SelectItem value="1.3m-1.5m">1.3m-1.5m</SelectItem>
                <SelectItem value="1.2m-1.3m">1.2m-1.3m</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              The grade/slope of access to the pool site
            </p>
          </div>

          {/* Distance from Truck */}
          <div>
            <Label htmlFor="distance-from-truck">Distance from Truck to Pool Location</Label>
            <Select value={distanceFromTruck || "none"} onValueChange={onDistanceFromTruckChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                <SelectItem value="20-25m">20-25m</SelectItem>
                <SelectItem value="25-35m">25-35m</SelectItem>
                <SelectItem value="35-60m">35-60m</SelectItem>
                <SelectItem value="60m+">60m+</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              How far equipment needs to travel from truck access point
            </p>
          </div>

          {/* Pool Shell Delivery */}
          <div>
            <Label htmlFor="pool-shell-delivery">Pool Shell Delivery Location</Label>
            <Select value={poolShellDelivery || "none"} onValueChange={onPoolShellDeliveryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                <SelectItem value="Site">Site</SelectItem>
                <SelectItem value="Off-Truck">Off-Truck</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Where the pool shell will be delivered
            </p>
          </div>

          {/* Sewer Diversion */}
          <div>
            <Label htmlFor="sewer-diversion">Sewer Line Diversion Required</Label>
            <Select value={sewerDiversion || "none"} onValueChange={onSewerDiversionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Whether existing sewer lines need to be diverted by a plumber
            </p>
          </div>

          {/* Stormwater Diversion */}
          <div>
            <Label htmlFor="stormwater-diversion">Stormwater Diversion Required</Label>
            <Select value={stormwaterDiversion || "none"} onValueChange={onStormwaterDiversionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Whether stormwater lines need to be diverted by a plumber
            </p>
          </div>
      </div>
    </div>
  );
};