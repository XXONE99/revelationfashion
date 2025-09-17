-- Create project_posts table for client projects and case studies
CREATE TABLE project_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('jacket', 'shirt', 'uniform', 'dress', 'pants', 'other')),
    images TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE project_posts ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage project_posts" ON project_posts;
CREATE POLICY project_posts_all ON project_posts FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_project_posts_updated_at
    BEFORE UPDATE ON project_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_project_posts_category ON project_posts(category);
CREATE INDEX idx_project_posts_published ON project_posts(is_published);
CREATE INDEX idx_project_posts_created_at ON project_posts(created_at);
