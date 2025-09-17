-- Portfolio masonry sample items
-- Jalankan file ini di Supabase SQL editor untuk menambahkan contoh produk

INSERT INTO products (name, notes, category, description, materials_detail, price, images, is_published)
VALUES
('Alpine Jacket', 'Lookbook Winter 2025', 'jacket', 'Jaket outdoor hangat dengan lining halus.', 'Taslan, furing polar', 480000,
  ARRAY['/modern-warehouse-with-yellow-boxes-and-industrial-.jpg','/premium-black-bomber-jacket-with-company-logo.jpg'], true),
('Sunset Polo', 'Campaign Colorway', 'shirt', 'Polo warna gradient untuk kasual kantoran.', 'Lacoste CVC', 160000,
  ARRAY['/corporate-polo-shirts-various-colors-with-embroide.jpg'], true),
('Varsity Elite', 'Promo Kampus', 'jacket', 'Varsity dengan rib two-tone premium.', 'Fleece, kulit sintetis', 520000,
  ARRAY['/premium-black-bomber-jacket-detailed-view.jpg'], true),
('Office Set Navy', 'Bundle kantor', 'uniform-set', 'Set atasan bawahan navy elegan.', 'Drill high-twist', 620000,
  ARRAY['/formal-office-uniform-shirts-white-and-blue.jpg'], true),
('Mount Tee', 'Outdoor series', 'shirt', 'Kaos katun nyaman untuk aktivitas luar ruang.', 'Combed 24s', 95000,
  ARRAY['/modern-packaging-and-shipping-process.jpg'], true),
('Bomber Black', 'Best Seller', 'jacket', 'Bomber hitam bordir logo perusahaan.', 'Parasut premium', 350000,
  ARRAY['/premium-black-bomber-jacket-with-company-logo.jpg','/bomber-jacket-thumbnail.jpg'], true);


