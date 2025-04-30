
-- This script creates the heat pump pool compatibility table
-- Run this in your Supabase SQL editor if the table doesn't exist

CREATE TABLE IF NOT EXISTS public.heat_pump_pool_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_range TEXT NOT NULL,
  pool_model TEXT NOT NULL,
  heat_pump_id UUID NOT NULL REFERENCES public.heat_pump_products(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (pool_range, pool_model)
);

-- Add RLS policies (adjust based on your security requirements)
ALTER TABLE public.heat_pump_pool_compatibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access" ON public.heat_pump_pool_compatibility 
  FOR ALL USING (true);
