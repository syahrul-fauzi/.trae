# Keamanan & Aksesibilitas Dokumen

- Klasifikasi dokumen: `Public`, `Internal`, `Confidential`.
- Akses:
  - `Public`: bebas dibagikan, tanpa rahasia.
  - `Internal`: akses terbatas tim SBA.
  - `Confidential`: akses terbatas, audit akses diperlukan.
- Praktik:
  - Jangan menyimpan secrets/API keys.
  - Redaksi informasi sensitif sebelum publikasi.
  - Simpan metadata `owner` dan `status` pada setiap dokumen.
