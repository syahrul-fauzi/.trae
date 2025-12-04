Rencana Migrasi Dokumen — Legacy → Documents

Langkah
- Siapkan struktur `documents/legacy-import/` mempertahankan hirarki sumber
- Salin seluruh konten dari `documents-legacy/` ke `documents/legacy-import/`
- Perbarui metadata: versi, tanggal, status, penanggung jawab
- Verifikasi jumlah file dan direktori sumber vs target
- Sesuaikan format sesuai standar: heading, penomoran, footer, A11y
- Perbarui link internal dari `documents-legacy/` ke `documents/legacy-import/`
- Catat semua perubahan di `MIGRATION_CHANGELOG.md`

