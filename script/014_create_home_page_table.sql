-- Create home_page table for homepage content sections
CREATE TABLE home_page (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE home_page ENABLE ROW LEVEL SECURITY;

-- Create policy for home_page (only authenticated users can manage)
CREATE POLICY "Authenticated users can manage home_page" ON home_page
    FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_home_page_updated_at
    BEFORE UPDATE ON home_page
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_home_page_section ON home_page(section_name);
CREATE INDEX idx_home_page_published ON home_page(is_published);
CREATE INDEX idx_home_page_sort_order ON home_page(sort_order);
