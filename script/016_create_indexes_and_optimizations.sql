-- Create additional indexes for better performance

-- Products table indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);

-- Testimonials table indexes
CREATE INDEX idx_testimonials_client_name ON testimonials(client_name);
CREATE INDEX idx_testimonials_company_name ON testimonials(company_name);

-- Project posts table indexes
CREATE INDEX idx_project_posts_title ON project_posts(title);

-- Our clients table indexes
CREATE INDEX idx_our_clients_name ON our_clients(name);

-- Services table indexes
CREATE INDEX idx_services_title ON services(title);

-- Stats table indexes
CREATE INDEX idx_stats_title ON stats(title);

-- Hero slides table indexes
CREATE INDEX idx_hero_slides_title ON hero_slides(title);

-- About page table indexes
CREATE INDEX idx_about_page_title ON about_page(title);

-- About values table indexes
CREATE INDEX idx_about_values_title ON about_values(title);

-- Home page table indexes
CREATE INDEX idx_home_page_title ON home_page(title);

-- Contact info table indexes
CREATE INDEX idx_contact_info_value ON contact_info(value);

-- Create views for easier data access
CREATE VIEW published_products AS
SELECT * FROM products WHERE is_published = true
ORDER BY created_at DESC;

CREATE VIEW published_testimonials AS
SELECT * FROM testimonials WHERE is_published = true
ORDER BY created_at DESC;

CREATE VIEW published_project_posts AS
SELECT * FROM project_posts WHERE is_published = true
ORDER BY created_at DESC;

CREATE VIEW published_color_catalogs AS
SELECT * FROM color_catalogs WHERE is_published = true
ORDER BY created_at DESC;

CREATE VIEW published_our_clients AS
SELECT * FROM our_clients WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;

CREATE VIEW published_services AS
SELECT * FROM services WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;

CREATE VIEW published_stats AS
SELECT * FROM stats WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;

CREATE VIEW published_hero_slides AS
SELECT * FROM hero_slides WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;

CREATE VIEW published_about_values AS
SELECT * FROM about_values WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;

-- Create function to get published content by type
CREATE OR REPLACE FUNCTION get_published_content(table_name TEXT, limit_count INTEGER DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    CASE table_name
        WHEN 'products' THEN
            RETURN QUERY
            SELECT p.id, p.name::TEXT, p.description, p.created_at
            FROM products p
            WHERE p.is_published = true
            ORDER BY p.created_at DESC
            LIMIT limit_count;
        WHEN 'testimonials' THEN
            RETURN QUERY
            SELECT t.id, t.client_name::TEXT, t.testimonial_text, t.created_at
            FROM testimonials t
            WHERE t.is_published = true
            ORDER BY t.created_at DESC
            LIMIT limit_count;
        WHEN 'project_posts' THEN
            RETURN QUERY
            SELECT pp.id, pp.title, pp.excerpt, pp.created_at
            FROM project_posts pp
            WHERE pp.is_published = true
            ORDER BY pp.created_at DESC
            LIMIT limit_count;
        ELSE
            RETURN;
    END CASE;
END;
$$ LANGUAGE plpgsql;
