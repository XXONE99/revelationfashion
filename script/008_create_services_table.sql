-- Create services table for service offerings
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon TEXT,
    icon_url TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY services_all ON services FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_services_published ON services(is_published);
CREATE INDEX idx_services_sort_order ON services(sort_order);
CREATE INDEX idx_services_created_at ON services(created_at);
