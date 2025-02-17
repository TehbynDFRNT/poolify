
import { type ExcavationDigType } from "@/types/excavation-dig-type";

export const calculateDigTypeCost = (digType: ExcavationDigType) => {
  const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
  const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
  return truckCost + excavationCost;
};
