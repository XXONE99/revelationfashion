-- Insert dummy data for testing and development

-- Insert sample products
INSERT INTO products (name, notes, category, description, materials_detail, price, images, is_published) VALUES
('Premium Black Bomber Jacket', 'Gathering PT Maju Jaya', 'jacket', 'Bomber premium dengan bordir logo perusahaan.', 'Bahan parasut premium, furing, zipper YKK.', 350000, ARRAY['/premium-black-bomber-jacket.jpg'], true),
('Corporate Polo Shirt', 'Seragam kantor warna solid', 'shirt', 'Polo shirt nyaman untuk kebutuhan seragam kantor.', 'Lacoste CVC, bordir logo.', 120000, ARRAY['/corporate-polo-shirts.jpg'], true),
('Uniform Set Pabrik', 'Setelan lengkap atasan & celana', 'uniform-set', 'Setelan seragam lengkap untuk kebutuhan industri.', 'Drill premium, jahitan rantai, saku fungsional.', 450000, ARRAY['/uniform-set-pabrik.jpg'], false);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, company_name, position, avatar_url, rating, testimonial_text, is_published) VALUES
('Andi Pratama', 'PT Maju Jaya', 'CEO', '/avatar-andi.jpg', 5, 'Kualitas jahitan rapi dan pengiriman tepat waktu. Sangat rekomendasi!', true),
('Siti Lestari', 'CV Prima', 'Manager', '/avatar-siti.jpg', 5, 'Seragam nyaman dipakai dan sesuai brief. Komunikasi responsif.', true),
('Budi Santoso', 'Astra', 'Direktur', '/avatar-budi.jpg', 4, 'Material berkualitas dan harga kompetitif.', false);

-- Insert sample color catalogs
INSERT INTO color_catalogs (title, description, type, cover_image_url, images, is_published) VALUES
('Katalog Warna Polo Shirt', 'Berbagai pilihan warna untuk polo shirt', 'color', '/polo-color-catalog.jpg', ARRAY['/polo-red.jpg', '/polo-blue.jpg', '/polo-green.jpg'], true),
('Size Chart Varsity Jacket', 'Panduan ukuran untuk jaket varsity', 'size_chart', '/varsity-size-chart.jpg', ARRAY['/size-chart-front.jpg', '/size-chart-back.jpg'], true),
('Size Chart Bomber Jacket', 'Panduan ukuran untuk jaket bomber', 'size_chart', '/bomber-size-chart.jpg', ARRAY['/bomber-size-chart.jpg'], false);

-- Insert sample project posts
INSERT INTO project_posts (title, excerpt, content, category, images, is_published) VALUES
('Produksi Jaket Bomber PT XYZ', 'Proyek pembuatan jaket bomber untuk perusahaan XYZ', 'Detail lengkap proyek pembuatan jaket bomber dengan spesifikasi khusus...', 'jacket', ARRAY['/bomber-project-1.jpg', '/bomber-project-2.jpg'], true),
('Seragam Polo Bank ABC', 'Proyek seragam polo untuk bank ABC', 'Pembuatan seragam polo dengan logo bank yang elegan...', 'shirt', ARRAY['/polo-bank-1.jpg', '/polo-bank-2.jpg'], true),
('Seragam Pabrik Setelan', 'Proyek seragam lengkap untuk pabrik', 'Pembuatan setelan seragam pabrik dengan standar keamanan tinggi...', 'uniform', ARRAY['/uniform-factory-1.jpg'], false);

-- Insert sample our clients
INSERT INTO our_clients (name, logo_url, website_url, description, is_published, sort_order) VALUES
('PT Maju Jaya', '/client-maju-jaya.jpg', 'https://majujaya.com', 'Perusahaan teknologi terkemuka', true, 1),
('CV Prima', '/client-prima.jpg', 'https://prima.co.id', 'Perusahaan manufaktur', true, 2),
('Astra Group', '/client-astra.jpg', 'https://astra.co.id', 'Konglomerat terbesar di Indonesia', true, 3);

-- Insert sample services
INSERT INTO services (title, description, icon_url, is_published, sort_order) VALUES
('Konveksi Seragam Kantor', 'Pembuatan seragam kantor berkualitas tinggi dengan desain profesional', '/icon-office.svg', true, 1),
('Konveksi Seragam Sekolah', 'Seragam sekolah dengan desain modern dan nyaman untuk aktivitas belajar', '/icon-school.svg', true, 2),
('Konveksi Pakaian Kerja', 'Pakaian kerja dan seragam industri dengan standar keamanan tinggi', '/icon-work.svg', true, 3);

-- Insert sample stats
INSERT INTO stats (title, value, suffix, icon, is_published, sort_order) VALUES
('Klien Puas', '500', '+', 'users', true, 1),
('Produk Terjual', '100000', '+', 'shirt', true, 2),
('Tahun Pengalaman', '10', '+', 'award', true, 3),
('Total Items', '50', '+', 'package', true, 4);

-- Insert sample hero slides
INSERT INTO hero_slides (title, subtitle, button_text, button_url, image_url, is_published, sort_order) VALUES
('Konveksi Seragam Profesional', 'Kualitas terbaik untuk kebutuhan seragam kantor, sekolah, dan industri', 'Lihat Produk', '/portofolio', '/hero-slide-1.jpg', true, 1),
('Desain Custom Sesuai Kebutuhan', 'Tim desainer berpengalaman siap membantu mewujudkan konsep seragam Anda', 'Konsultasi Gratis', '/kontak', '/hero-slide-2.jpg', true, 2);

-- Insert sample about page content
INSERT INTO about_page (section_name, title, content, image_url, is_published, sort_order) VALUES
('company-history', 'Perjalanan Kami', 'Revelation Konveksi didirikan pada tahun 2013 dengan visi menjadi penyedia seragam berkualitas tinggi...', '/company-history.jpg', true, 1),
('mission', 'Misi Kami', 'Menyediakan produk konveksi berkualitas tinggi dengan harga terjangkau...', '/mission.jpg', true, 2),
('vision', 'Visi Kami', 'Menjadi konveksi terdepan di Indonesia yang dikenal dengan kualitas dan inovasi...', '/vision.jpg', true, 3);

-- Insert sample about values
INSERT INTO about_values (title, description, icon_url, is_published, sort_order) VALUES
('Integritas', 'Kami selalu berkomitmen pada kejujuran dan transparansi dalam setiap aspek bisnis kami', '/icon-integrity.svg', true, 1),
('Kualitas', 'Standar kualitas tinggi adalah prioritas utama dalam setiap produk yang kami hasilkan', '/icon-quality.svg', true, 2),
('Inovasi', 'Kami terus berinovasi untuk memberikan solusi terbaik dan mengikuti perkembangan zaman', '/icon-innovation.svg', true, 3),
('Kepuasan Pelanggan', 'Kepuasan pelanggan adalah tujuan utama yang selalu kami prioritaskan dalam melayani', '/icon-satisfaction.svg', true, 4);

-- Insert sample home page content
INSERT INTO home_page (section_name, title, content, image_url, is_published, sort_order) VALUES
('hero', 'Selamat Datang di REVELATION', 'Konveksi seragam profesional dengan kualitas terbaik', '/hero-image.jpg', true, 1),
('about', 'Tentang Kami', 'Perusahaan konveksi berpengalaman lebih dari 10 tahun', '/about-image.jpg', true, 2),
('services', 'Layanan Kami', 'Berbagai layanan konveksi untuk kebutuhan seragam', '/services-image.jpg', true, 3);

-- Update app settings with social media URLs
UPDATE app_settings SET value = 'https://instagram.com/revelation_konveksi' WHERE key = 'instagram_url';
UPDATE app_settings SET value = 'https://tiktok.com/@revelation_konveksi' WHERE key = 'tiktok_url';
UPDATE app_settings SET value = 'https://facebook.com/revelation.konveksi' WHERE key = 'facebook_url';
