
-- Create table for pool heating options
CREATE TABLE IF NOT EXISTS public.pool_heating_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  pool_id UUID NOT NULL,
  include_heat_pump BOOLEAN NOT NULL DEFAULT FALSE,
  include_blanket_roller BOOLEAN NOT NULL DEFAULT FALSE,
  heat_pump_id UUID,
  blanket_roller_id UUID,
  heat_pump_cost NUMERIC NOT NULL DEFAULT 0,
  blanket_roller_cost NUMERIC NOT NULL DEFAULT 0,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  total_margin NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS pool_heating_options_customer_id_idx ON public.pool_heating_options (customer_id);
CREATE INDEX IF NOT EXISTS pool_heating_options_pool_id_idx ON public.pool_heating_options (pool_id);

-- Create trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_pool_heating_options_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at timestamp
DROP TRIGGER IF EXISTS update_pool_heating_options_timestamp ON public.pool_heating_options;
CREATE TRIGGER update_pool_heating_options_timestamp
BEFORE UPDATE ON public.pool_heating_options
FOR EACH ROW
EXECUTE FUNCTION public.update_pool_heating_options_timestamp();
