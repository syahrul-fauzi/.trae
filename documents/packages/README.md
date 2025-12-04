# Dokumentasi Packages — SBA-Agentic

Daftar paket modular yang mendukung monorepo SBA-Agentic. Setiap paket memiliki README terperinci dan mengikuti standar konsistensi kode, pengujian, serta integrasi CI/CD.

- `documents/packages/ui/README.md` — Design System & UI components
- `documents/packages/core/README.md` — Domain logic (DDD services, validators, errors)
- `documents/packages/utils/README.md` — Utilities (logger, formatters, helpers)
- `documents/packages/api-clients/README.md` — SDK dari OpenAPI 3.1
- `documents/packages/configs/README.md` — Shared configs (TS, ESLint, Prettier, Tailwind)
- `documents/packages/types/README.md` — Global types & contracts
- `documents/packages/context/README.md` — Global state & actions (React Context)
- `documents/packages/files/README.md` — File management & storage

## Scope & Konvensi
- TypeScript strict; linting dan formatting konsisten; error taxonomy jelas.
- Struktur paket mengikuti prinsip FSD/DDD hibrid sesuai domainnya.
- Kontrak dipusatkan di `types` dan `api-clients` untuk menghindari duplikasi.

## CI/CD & QA
- Lint/type-check/tests otomatis untuk paket: lihat `.github/workflows/packages.yml`.
- Target coverage minimal 85% untuk paket inti; hasil tes harus hijau sebelum merge.

## Diagram Relasi Packages
```mermaid
flowchart LR
  UI --> Context
  Context --> Files
  Context --> APIClients
  Core --> APIClients
  Core --> Types
  UI --> Types
  Files --> Utils
  APIClients --> Utils
  Configs --> {UI,Core,Utils,Context,Files,APIClients,Types}
```

## Kontribusi
- Buat PR dengan deskripsi jelas, dampak, dan pembaruan dokumentasi.
- Jaga kompatibilitas antar paket dan patuhi standar keamanan.

## Lisensi
- MIT
