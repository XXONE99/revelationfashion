-- Create color_catalogs table for color catalog and size chart management
CREATE TABLE color_catalogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('color', 'size_chart')),
    cover_image_url TEXT,
    images TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE color_catalogs ENABLE ROW LEVEL SECURITY;

-- Create policy for color_catalogs (only authenticated users can manage)
CREATE POLICY "Authenticated users can manage color_catalogs" ON color_catalogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_color_catalogs_updated_at
    BEFORE UPDATE ON color_catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_color_catalogs_type ON color_catalogs(type);
CREATE INDEX idx_color_catalogs_published ON color_catalogs(is_published);
CREATE INDEX idx_color_catalogs_created_at ON color_catalogs(created_at);
