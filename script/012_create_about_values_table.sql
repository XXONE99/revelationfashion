-- Create about_values table for company values
CREATE TABLE about_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage about_values" ON about_values;
CREATE POLICY about_values_all ON about_values FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_about_values_updated_at
    BEFORE UPDATE ON about_values
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_about_values_published ON about_values(is_published);
CREATE INDEX idx_about_values_sort_order ON about_values(sort_order);
CREATE INDEX idx_about_values_created_at ON about_values(created_at);
