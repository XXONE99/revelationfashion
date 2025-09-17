-- Create hero_slides table for homepage hero slider
CREATE TABLE hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    button_text VARCHAR(100),
    button_url TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage hero_slides" ON hero_slides;
CREATE POLICY hero_slides_all ON hero_slides FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hero_slides_updated_at
    BEFORE UPDATE ON hero_slides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_hero_slides_published ON hero_slides(is_published);
CREATE INDEX idx_hero_slides_sort_order ON hero_slides(sort_order);
CREATE INDEX idx_hero_slides_created_at ON hero_slides(created_at);
