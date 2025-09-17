-- Create products table for portfolio management
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    notes TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('jacket', 'shirt', 'uniform-set', 'pants', 'dress')),
    description TEXT,
    materials_detail TEXT,
    price DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY products_all ON products FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_published ON products(is_published);
CREATE INDEX idx_products_created_at ON products(created_at);
