-- Add icon column to services table if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing records to copy icon_url to icon if icon is null
UPDATE services SET icon = icon_url WHERE icon IS NULL AND icon_url IS NOT NULL;
