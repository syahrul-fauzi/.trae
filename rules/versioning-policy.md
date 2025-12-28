# Versioning & Deprecation Policy

SBA-Agentic menggunakan sistem versi yang ketat untuk menjamin stabilitas sistem otomatisasi dan integrasi.

## 1. Semantic Versioning (SemVer)
Semua rule dan komponen sistem wajib mengikuti format `MAJOR.MINOR.PATCH`.

- **MAJOR (vX.0.0)**:
  - Perubahan besar pada arsitektur agen.
  - Perubahan skema YAML yang tidak kompatibel ke belakang.
  - Penghapusan tool atau kapabilitas inti.
- **MINOR (v1.X.0)**:
  - Penambahan rule baru dalam sebuah domain.
  - Penambahan parameter opsional pada trigger atau action.
  - Peningkatan kemampuan penalaran agen.
- **PATCH (v1.0.X)**:
  - Perbaikan typo atau dokumentasi.
  - Optimasi performa tanpa merubah input/output.
  - Update dependensi minor.

## 2. Kebijakan Deprecation
Sebelum menghapus fitur atau rule, langkah berikut wajib dilakukan:
1. **Announce**: Tandai sebagai `deprecated` di metadata dan log.
2. **Grace Period**: Berikan waktu minimal 30 hari sebelum penghapusan.
3. **Migration Path**: Sediakan panduan migrasi ke alternatif baru.

## 3. Dokumentasi Perubahan
Setiap perubahan versi wajib dicatat dalam [CHANGELOG.md](file:///home/inbox/smart-ai/sba-agentic/.trae/rules/CHANGELOG.md).

---
*Terakhir diperbarui: 2025-12-28*
