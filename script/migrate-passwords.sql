-- Script untuk migrasi password yang sudah ada di database
-- Jalankan script ini untuk mengupdate password yang masih plain text menjadi hashed

-- Contoh: Update password untuk user 'Revelation' dengan password 'RVLT01'
-- Password 'RVLT01' akan di-hash menggunakan bcrypt dengan salt rounds 12
-- Hashed password: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J7K8Q8Q8Q

-- UPDATE users 
-- SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J7K8Q8Q8Q',
--     updated_at = NOW()
-- WHERE username = 'Revelation' AND password = 'RVLT01';

-- Catatan: 
-- 1. Ganti hashed password di atas dengan hasil hash yang sebenarnya
-- 2. Jalankan script ini hanya sekali untuk migrasi
-- 3. Setelah migrasi, semua password baru akan otomatis di-hash
-- 4. Password lama (plain text) akan otomatis di-migrate saat login pertama kali

-- Untuk mendapatkan hashed password, gunakan fungsi hashPassword() di aplikasi
-- atau gunakan online bcrypt generator dengan salt rounds 12
