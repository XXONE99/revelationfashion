-- Create contact_info table for contact information
CREATE TABLE contact_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('phone', 'email', 'address', 'hours')),
    value TEXT NOT NULL,
    subtitle TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage contact_info" ON contact_info;
CREATE POLICY contact_info_all ON contact_info FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_info_updated_at
    BEFORE UPDATE ON contact_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_contact_info_type ON contact_info(type);
CREATE INDEX idx_contact_info_published ON contact_info(is_published);
CREATE INDEX idx_contact_info_sort_order ON contact_info(sort_order);

-- Insert default contact information
INSERT INTO contact_info (type, value, subtitle, is_published, sort_order) VALUES
('phone', '021-1234-5678', 'Senin-Jumat 09.00-17.00', true, 1),
('email', 'cs@revelation.co.id', 'Respon < 1x24 jam', true, 2),
('address', 'Jl. Mawar No. 123, Jakarta', 'Gudang & Workshop', true, 3),
('hours', 'Senin - Sabtu', '09.00 - 17.00 WIB', true, 4);
