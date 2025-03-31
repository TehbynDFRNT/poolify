
-- Add a 'type' column to the quote_extra_pavings table
ALTER TABLE quote_extra_pavings
ADD COLUMN IF NOT EXISTS type text;

-- Update existing rows to a default value if needed
UPDATE quote_extra_pavings
SET type = 'standard_paving'
WHERE type IS NULL;
