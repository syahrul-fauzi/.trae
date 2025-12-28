# Deprecation Policy

Kebijakan penghentian dukungan untuk rule, API, dan kapabilitas lama.

## 1. Siklus Hidup Deprecation
1. **Identifikasi**: Rule/fitur dianggap usang (outdated).
2. **Warning (vX.Y.Z)**: Tambahkan flag `deprecated: true` pada metadata. Log peringatan muncul di console pengembang.
3. **Sunset (30 Hari)**: Fitur tetap berjalan namun tidak direkomendasikan untuk implementasi baru.
4. **Removal (Major Version)**: Penghapusan total dari codebase.

## 2. Kriteria Deprecation
- Rule yang tidak lagi mematuhi standar keamanan terbaru.
- API eksternal yang sudah tidak didukung (End of Life).
- Peningkatan arsitektur yang menggantikan logika lama secara total.

## 3. Panduan Migrasi
Setiap fitur yang dideprecated **WAJIB** menyertakan instruksi migrasi ke fitur pengganti dalam dokumentasi rilis.

---
*Referensi: [versioning-policy.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/versioning-policy.md)*
