-- Create stats table for statistics and achievements
CREATE TABLE stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    suffix VARCHAR(20),
    icon VARCHAR(50),
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage stats" ON stats;
CREATE POLICY stats_all ON stats FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stats_updated_at
    BEFORE UPDATE ON stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_stats_published ON stats(is_published);
CREATE INDEX idx_stats_sort_order ON stats(sort_order);
CREATE INDEX idx_stats_created_at ON stats(created_at);
