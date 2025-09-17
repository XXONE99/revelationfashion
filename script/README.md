# Database Scripts untuk REVELATION Konveksi

Script SQL ini dibuat untuk database Supabase dengan semua tabel yang diperlukan untuk sistem admin konveksi.

## Cara Menjalankan Script

1. Buka Supabase Dashboard
2. Pergi ke SQL Editor
3. Jalankan script secara berurutan dari 001 sampai 016

## Urutan Eksekusi Script

### 1. Setup Dasar
- `001_create_user_table.sql` - Tabel user untuk autentikasi admin
- `002_create_app_settings_table.sql` - Pengaturan aplikasi (termasuk sosial media)

### 2. Tabel Konten Utama
- `003_create_products_table.sql` - Produk/portofolio
- `004_create_testimonials_table.sql` - Testimoni klien
- `005_create_color_catalogs_table.sql` - Katalog warna & size chart
- `006_create_project_posts_table.sql` - Client & proyek
- `007_create_our_clients_table.sql` - Logo klien
- `008_create_services_table.sql` - Layanan
- `009_create_stats_table.sql` - Statistik
- `010_create_hero_slides_table.sql` - Hero slider homepage

### 3. Tabel Halaman
- `011_create_about_page_table.sql` - Konten halaman tentang kami
- `012_create_about_values_table.sql` - Nilai-nilai perusahaan
- `013_create_contact_info_table.sql` - Informasi kontak
- `014_create_home_page_table.sql` - Konten homepage

### 4. Data & Optimasi
- `015_create_dummy_data.sql` - Data dummy untuk testing
- `016_create_indexes_and_optimizations.sql` - Index dan optimasi

## Fitur yang Disertakan

### Row Level Security (RLS)
- Semua tabel memiliki RLS yang diaktifkan
- Hanya user yang terautentikasi yang bisa mengakses data

### Auto Update Timestamp
- Function `update_updated_at_column()` untuk update otomatis
- Trigger pada setiap tabel untuk update `updated_at`

### Indexes
- Index untuk performa query yang lebih baik
- Index pada kolom yang sering digunakan untuk filter dan sorting

### Views
- View untuk data yang sudah dipublish
- Function untuk mengambil konten berdasarkan tipe

## Struktur Tabel

### Tabel Utama
- **users** - Autentikasi admin
- **app_settings** - Konfigurasi aplikasi
- **products** - Produk/portofolio
- **testimonials** - Testimoni klien
- **color_catalogs** - Katalog warna & size chart
- **project_posts** - Client & proyek
- **our_clients** - Logo klien
- **services** - Layanan
- **stats** - Statistik
- **hero_slides** - Hero slider

### Tabel Halaman
- **about_page** - Konten halaman tentang kami
- **about_values** - Nilai-nilai perusahaan
- **contact_info** - Informasi kontak
- **home_page** - Konten homepage

## Data Dummy

Script `015_create_dummy_data.sql` berisi data dummy untuk:
- 3 produk sample
- 3 testimoni sample
- 3 katalog warna/size chart
- 3 project posts
- 3 client logos
- 3 layanan
- 4 statistik
- 2 hero slides
- Konten halaman about dan home
- URL sosial media (Instagram, TikTok, Facebook)

## Fitur Sosial Media

### Database
- Field `instagram_url`, `tiktok_url`, `facebook_url` di tabel `app_settings`
- Data dummy sudah include URL sosial media

### Frontend
- Footer menampilkan ikon sosial media dengan link
- Ikon Instagram, TikTok, dan Facebook
- Hover effect dengan warna emerald
- Link terbuka di tab baru

### Admin Panel
- **Pengaturan Aplikasi**: Kelola URL sosial media
- **Informasi Kontak**: Kelola URL sosial media
- Simpan otomatis ke localStorage
- Update real-time di footer

## Catatan Penting

1. Pastikan menjalankan script secara berurutan
2. Script sudah include data dummy untuk testing
3. Semua tabel sudah memiliki RLS dan trigger
4. Index sudah dioptimasi untuk performa
5. Views tersedia untuk data yang sudah dipublish
6. Sosial media terintegrasi di footer dan admin panel

## Troubleshooting

Jika ada error saat menjalankan script:
1. Pastikan sudah login ke Supabase
2. Pastikan menjalankan script secara berurutan
3. Cek apakah ada tabel yang sudah ada sebelumnya
4. Pastikan RLS sudah diaktifkan di project settings
