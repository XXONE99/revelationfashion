# Supabase Storage Bucket Mapping

## Bucket yang Digunakan di Admin Panel

### 1. **`uploads`** - Bucket Utama untuk File Umum
- **Pengaturan Aplikasi (Logo):** `uploads/logos/`
  - File: `components/admin/content/AppSettingsManager.tsx`
  - Path: `logos/`
  - Usage: Logo aplikasi yang ditampilkan di navbar dan footer

- **About Page (Story Images):** `uploads/about/story/`
  - File: `components/admin/content/AboutPageManager.tsx`
  - Path: `about/story/`
  - Usage: Gambar cerita perusahaan

### 2. **`services`** - Bucket untuk Layanan dan Konten
- **Stats Icons:** `services/stats/icons/`
  - File: `components/admin/forms/StatsForm.tsx`
  - Path: `stats/icons/`
  - Usage: Icon untuk statistik

- **About Values Icons:** `services/about/values/`
  - File: `components/admin/content/AboutPageManager.tsx`
  - Path: `about/values/`
  - Usage: Icon untuk nilai-nilai perusahaan

### 3. **`testimonials`** - Bucket untuk Testimoni
- **Testimonial Images:** `testimonials/`
  - File: `components/admin/forms/TestimonialForm.tsx`
  - Path: `''` (root)
  - Usage: Foto klien untuk testimoni

### 4. **`products`** - Bucket untuk Produk
- **Product Images:** `products/`
  - File: `components/admin/forms/ProductForm.tsx`
  - Path: `''` (root)
  - Usage: Gambar produk

### 5. **`projects`** - Bucket untuk Proyek
- **Project Images:** `projects/`
  - File: `components/admin/forms/ProjectPostForm.tsx`
  - Path: `''` (root)
  - Usage: Gambar proyek

### 6. **`hero`** - Bucket untuk Hero Slider
- **Hero Slide Images:** `hero/`
  - File: `components/admin/forms/HeroSlideForm.tsx`
  - Path: `''` (root)
  - Usage: Gambar slider hero

### 7. **`catalogs`** - Bucket untuk Katalog
- **Color Catalog:** `catalogs/colors/`
- **Size Chart:** `catalogs/size-charts/`
  - File: `components/admin/forms/ColorCatalogForm.tsx`
  - Path: `colors/` atau `size-charts/`
  - Usage: Gambar katalog warna dan size chart

### 8. **`clients`** - Bucket untuk Klien
- **Client Logos:** `clients/`
  - File: `components/admin/forms/OurClientForm.tsx`
  - Path: `''` (root)
  - Usage: Logo klien

## Ringkasan Bucket

| Bucket | Komponen | Path | Usage |
|--------|----------|------|-------|
| `uploads` | AppSettingsManager | `logos/` | Logo aplikasi |
| `uploads` | AboutPageManager | `about/story/` | Gambar cerita |
| `services` | StatsForm | `stats/icons/` | Icon statistik |
| `services` | AboutPageManager | `about/values/` | Icon nilai |
| `testimonials` | TestimonialForm | `''` | Foto testimoni |
| `products` | ProductForm | `''` | Gambar produk |
| `projects` | ProjectPostForm | `''` | Gambar proyek |
| `hero` | HeroSlideForm | `''` | Gambar hero |
| `catalogs` | ColorCatalogForm | `colors/` atau `size-charts/` | Katalog |
| `clients` | OurClientForm | `''` | Logo klien |

## Jawaban untuk Pertanyaan User

**Bucket yang digunakan di Pengaturan Aplikasi:**
- **Nama Bucket:** `uploads`
- **Path:** `logos/`
- **File Path Lengkap:** `uploads/logos/[timestamp]-[filename]`
- **Usage:** Logo aplikasi yang ditampilkan di navbar dan footer user interface
