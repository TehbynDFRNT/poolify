
import { z } from "zod";

export const customerInfoSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(1, "Phone number is required"),
  owner2_name: z.string().optional(),
  owner2_email: z.string().email("Invalid email address").optional().or(z.literal('')),
  owner2_phone: z.string().optional(),
  home_address: z.string().min(1, "Home address is required"),
  site_address: z.string().min(1, "Site address is required"),
  resident_homeowner: z.boolean().optional(),
});

export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

// Define a more specific error type that matches FieldErrors from react-hook-form
export type CustomerInfoFormErrors = {
  [K in keyof CustomerInfoFormData]?: string;
};
