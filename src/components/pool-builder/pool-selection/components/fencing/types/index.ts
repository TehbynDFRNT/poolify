
import { z } from "zod";
import { Pool } from "@/types/pool";

export const fencingSchema = z.object({
  linearMeters: z.coerce.number().min(0, "Must be a positive number"),
  gates: z.coerce.number().min(0, "Must be 0 or more"),
  simplePanels: z.coerce.number().min(0, "Must be 0 or more"),
  complexPanels: z.coerce.number().min(0, "Must be 0 or more"),
  earthingRequired: z.boolean().default(false),
});

export type FencingFormValues = z.infer<typeof fencingSchema>;

// Use the same schema for flat top metal fencing to ensure consistency
export const ftmFencingSchema = fencingSchema;
export type FTMFencingFormValues = z.infer<typeof ftmFencingSchema>;

export interface FramelessGlassFencingProps {
  pool: Pool;
  customerId: string;
}

export interface FlatTopMetalFencingProps {
  pool: Pool;
  customerId: string;
}

export interface CostCalculation {
  linearCost: number;
  gatesCost: number;
  freeGateDiscount: number;
  simplePanelsCost: number;
  complexPanelsCost: number;
  earthingCost: number;
  totalCost: number;
}
