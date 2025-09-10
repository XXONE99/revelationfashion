-- Create our_clients table for client logos and information
CREATE TABLE our_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE our_clients ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage our_clients" ON our_clients;
CREATE POLICY our_clients_all ON our_clients FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_our_clients_updated_at
    BEFORE UPDATE ON our_clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_our_clients_published ON our_clients(is_published);
CREATE INDEX idx_our_clients_sort_order ON our_clients(sort_order);
CREATE INDEX idx_our_clients_created_at ON our_clients(created_at);
