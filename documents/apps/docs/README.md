# RANCANGAN LENGKAP & MENDALAM — `apps/docs` (SBA · BaseHub Docs Site)

## Gambaran Umum
- Situs dokumentasi interaktif berbasis BaseHub yang menyajikan referensi API, panduan, dan SOP.
- Mendukung "coba endpoint" dari kontrak OpenAPI dan analitik halaman.

## Fitur
- Sinkronisasi OpenAPI → referensi otomatis; editor panduan; blok kode & media.
- Try It playground; domain khusus & branding; versi API ganda.

## Analitik & Feedback
- Pantau halaman populer dan titik kebingungan developer; gunakan data untuk iterasi dokumen.

## Keamanan & Akses
- SSO opsional; kontrol akses per tenant untuk konten privat; audit perubahan.

## Deployment
- Static/SSR site; CDN & cache; integrasi dengan BaseHub untuk konten.

## Roadmap
- Linting dokumen bertenaga AI, audit kualitas, dan integrasi tanya-jawab AI.

## Gambar Arsitektur
- Tambahkan PNG diagram di `documents/apps/docs/architecture.png` untuk presentasi stakeholder.
### Catatan Stakeholder
- Diagram arsitektur membantu memahami alur konten (BaseHub, OpenAPI, CDN). Pastikan file PNG beresolusi tinggi dan diberi label komponen dengan jelas.
### Instruksi Referensi PNG
- Tautkan menggunakan markdown: `![Docs Architecture](./architecture.png)`

## Prasyarat Sistem
- Node.js 20+, PNPM 9+, akses ke BaseHub.

## Instalasi & Konfigurasi
- Instal: `pnpm install`
- Sinkronisasi OpenAPI: tempatkan kontrak di `openapi/openapi.yaml`.
- Konfigurasi domain/docs base path.

## Penggunaan Dasar
- Akses halaman panduan dan referensi API; gunakan Try It untuk uji endpoint.

## Struktur Direktori
```
apps/docs/
├─ content/{guides,tutorials}
├─ openapi/openapi.yaml
└─ src/{pages,components}
```

## Kontribusi
- Review konten, cek lint, tambahkan contoh berkualitas, perbarui changelog.

## Lisensi
- MIT
