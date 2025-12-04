# RANCANGAN LENGKAP & MENDALAM — `apps/web` (SBA Agentic Web)

## Gambaran Umum
- Surface web umum: landing/marketing, status, dan dokumentasi singkat.

## Arsitektur
- FSD/Atomic components; shared design system; progressive enhancement; SEO & a11y.

## Keamanan
- CSP ketat, Permissions-Policy, Subresource Integrity, sanitasi input.

## Observability
- Web vitals; error reporting; release notes & changelog.

## Pengujian
- Vitest/Playwright; snapshots untuk komponen; a11y linting.

## Deployment
- Edge/CDN; cache; versi rilis; rollback cepat.

## Roadmap
- Marketing experiments, komponen interaktif, integrasi analytics yang patuh privasi.

## Gambar Arsitektur
- Tambahkan PNG diagram di `documents/apps/web/architecture.png` untuk keperluan presentasi.
### Catatan Stakeholder
- Diagram menyorot arus data antara static site, CDN, dan API status. Gunakan label komponen yang konsisten dan resolusi tinggi.
### Instruksi Referensi PNG
- Tautkan menggunakan markdown: `![Web Architecture](./architecture.png)`

## Prasyarat Sistem
- Node.js 20+, PNPM 9+.

## Instalasi & Konfigurasi
- Instal: `pnpm install`
- Jalankan dev: `pnpm dev`
- Konfigurasi: SEO, a11y, CSP, analytics patuh privasi.

## Penggunaan Dasar
- Jalankan situs marketing/landing dan halaman status; pantau web vitals.

## Struktur Direktori
```
apps/web/
├─ src/pages/{index,status}
├─ src/components/{Hero,StatusCard}
└─ src/shared/seo.ts
```

## Kontribusi
- Ikuti pedoman UI/UX, CSP strict, dan a11y.

## Lisensi
- MIT
