-- Create about_page table for about us page content
CREATE TABLE about_page (
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
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage about_page" ON about_page;
CREATE POLICY about_page_all ON about_page FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_about_page_updated_at
    BEFORE UPDATE ON about_page
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_about_page_section ON about_page(section_name);
CREATE INDEX idx_about_page_published ON about_page(is_published);
CREATE INDEX idx_about_page_sort_order ON about_page(sort_order);
