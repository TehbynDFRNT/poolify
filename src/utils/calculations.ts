
import { type DigType } from "@/types/excavation-dig-type";

export const calculateDigCost = (digType: DigType | null) => {
  if (!digType) return 0;
  return digType.cost;
};
