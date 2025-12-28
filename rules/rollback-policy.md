# Rollback Policy

Prosedur pemulihan sistem jika terjadi kegagalan setelah deployment.

## 1. Kriteria Rollback Otomatis
- Error rate meningkat > 5% dalam 5 menit pertama rilis.
- Latensi sistem meningkat > 200% dari baseline.
- Kegagalan fatal pada database migrations.

## 2. Prosedur Manual
1. Identifikasi versi stabil terakhir (git tag).
2. Jalankan perintah `pnpm deploy:rollback`.
3. Verifikasi status sistem melalui dashboard monitoring.

## 3. Penanganan Data
- Rollback kode **tidak selalu** melakukan rollback database.
- Perubahan skema database yang bersifat destruktif harus dihindari.
- Gunakan *feature flags* untuk menonaktifkan fitur bermasalah tanpa redeploy.

---
*Setiap release wajib memiliki skrip rollback yang teruji.*
