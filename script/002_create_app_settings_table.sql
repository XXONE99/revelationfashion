-- Create app_settings table for application configuration
CREATE TABLE app_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Open RLS for admin panel without Supabase Auth (allow anon role)
DROP POLICY IF EXISTS "Authenticated users can manage app_settings" ON app_settings;
CREATE POLICY app_settings_all ON app_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default app settings
INSERT INTO app_settings (key, value, description) VALUES
('app_name', 'REVELATION', 'Nama aplikasi'),
('app_subtitle', 'Konveksi Bandung', 'Subtitle aplikasi'),
('logo_url', '/placeholder-logo.png', 'URL logo aplikasi'),
('company_phone', '+62 813-1260-0281', 'Nomor telepon perusahaan'),
('company_email', 'revelation.fash@gmail.com', 'Email perusahaan'),
('company_address', 'Jl. Mawar No. 123, Jakarta', 'Alamat perusahaan'),
('whatsapp_number', '6281234567890', 'Nomor WhatsApp'),
('google_maps_embed_url', '', 'URL embed Google Maps'),
('instagram_url', 'https://instagram.com/revelation_konveksi', 'URL Instagram'),
('tiktok_url', 'https://tiktok.com/@revelation_konveksi', 'URL TikTok'),
('facebook_url', 'https://facebook.com/revelation.konveksi', 'URL Facebook');
