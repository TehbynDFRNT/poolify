
import { Pool } from "@/types/pool";
import { PoolUpdates, NullableNumericFields, RequiredNumericFields } from "../types/poolTableTypes";
import { toast } from "sonner";

export const validatePoolUpdates = (updates: Partial<Pool>): PoolUpdates | null => {
  const validatedUpdates: PoolUpdates = {};

  for (const [key, value] of Object.entries(updates)) {
    const field = key as keyof Pool;
    
    if (field === "name" || field === "range") {
      validatedUpdates[field] = value as string;
      continue;
    }

    if (value === "" || value === null) {
      if (["waterline_l_m", "volume_liters", "salt_volume_bags", 
          "salt_volume_bags_fixed", "weight_kg", "minerals_kg_initial", 
          "minerals_kg_topup", "buy_price_ex_gst", "buy_price_inc_gst"].includes(field)) {
        validatedUpdates[field as NullableNumericFields] = null;
      }
      continue;
    }

    if (["length", "width", "depth_shallow", "depth_deep"].includes(field)) {
      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) {
        toast.error(`Invalid number for ${field}`);
        return null;
      }
      validatedUpdates[field as RequiredNumericFields] = numValue;
    } else if (["waterline_l_m", "volume_liters", "salt_volume_bags", 
               "salt_volume_bags_fixed", "weight_kg", "minerals_kg_initial", 
               "minerals_kg_topup", "buy_price_ex_gst", "buy_price_inc_gst"].includes(field)) {
      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) {
        toast.error(`Invalid number for ${field}`);
        return null;
      }
      validatedUpdates[field as NullableNumericFields] = numValue;
    }
  }

  return validatedUpdates;
};
