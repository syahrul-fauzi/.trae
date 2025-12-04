# RANCANGAN LENGKAP & MENDALAM — `apps/admin` (Admin Console)

## Tujuan & Fungsi
- Manajemen tenant, RBAC, konfigurasi integrasi, billing & metering, audit & observability dashboard.

## Penjelasan Lengkap
- Tujuan: menyediakan konsol administrasi terpadu untuk mengelola akses, konfigurasi, dan operasi tenant secara aman dan efisien.
- Manfaat: meningkatkan kontrol dan visibilitas, mempercepat onboarding, memastikan kepatuhan (audit, RBAC), dan mendukung pengambilan keputusan melalui reporting.
- Fitur Utama:
  - Manajemen Tenant: buat/ubah/hapus, konfigurasi khusus, policy per-tenant.
  - RBAC Granular: roles, permissions, scopes; assignment pengguna; audit perubahan.
  - Integrasi & Billing: kelola kredensial provider, metering penggunaan, invoice.
  - Monitoring & Reporting: dashboard SLA, penggunaan resources, error rate, changelog.
- Persyaratan Teknis:
  - Node.js 20+, PNPM 9+; akses API backend; identitas SSO/MFA; Postgres untuk metadata.
  - Env: `ADMIN_API_URL`, `AUTH_PROVIDER_KEYS`, `STRIPE_SECRET_KEY`.

## Fitur Utama
- RBAC granular (roles, permissions, scopes), management panel, monitoring & reporting, changelog dan approvals.

## Prasyarat Sistem
- Node.js 20+, PNPM 9+, akses API, kredensial identitas (SSO/MFA).

## Instalasi & Konfigurasi
- Instal: `pnpm install`, jalankan: `pnpm dev`.
- Env: `ADMIN_API_URL`, `AUTH_PROVIDER_KEYS`, `STRIPE_SECRET_KEY`.

## Penggunaan Dasar
- Kelola tenant, atur roles & permissions, pantau metrik dan audit trail.

## Struktur Direktori
```
apps/admin/
├─ src/features/{rbac,tenants,billing,observability}
├─ src/entities/{tenant,role,permission}
├─ src/shared/{ui,utils,hooks}
└─ app.tsx
```

## Keamanan
- MFA, RBAC ketat, audit untuk aksi sensitif.

## Observability
- Dashboards (runs, errors, usage), logs terstruktur, tracing dari UI ke API.

## Pengujian
- Unit untuk komponen; integration untuk panel; E2E untuk alur manajemen.

## Spesifikasi Teknis
- Arsitektur Sistem Direkomendasikan:
  - UI FSD: `features/{rbac,tenants,billing,observability}`; `entities/{tenant,role,permission}`; `shared/{ui,utils,hooks}`.
  - Backend API: DDD bounded contexts `Identity`, `Tenant`, `Billing`, `Observability`; autentikasi via bearer token; RLS di Postgres.
- Teknologi:
  - Frontend: TypeScript, Vite, design system AG‑UI, SSE untuk live metrics (opsional).
  - Backend: TypeScript/Node, Prisma, OpenAPI 3.1, OTel untuk tracing.
- Standar Koding:
  - TypeScript strict; pedoman komponen (a11y, performance, error taxonomy); lint & format; test ≥80% coverage modul inti.

## Langkah-langkah Implementasi
- Fase Pengembangan:
  - Fase 1: Fondasi UI (FSD), halaman Tenants & RBAC, autentikasi.
  - Fase 2: Integrasi & Billing, metering, invoice.
  - Fase 3: Observability dashboard (runs, errors, usage), changelog & approvals.
- Timeline Estimasi:
  - Fase 1: 2–3 minggu; Fase 2: 2–3 minggu; Fase 3: 2 minggu.
- Kriteria Penerimaan:
  - Fase 1: CRUD tenant & RBAC berfungsi, autentikasi aman, test hijau.
  - Fase 2: integrasi terkonfigurasi, metering berjalan, invoice dibuat.
  - Fase 3: dashboard menampilkan metrik p95/p99, audit & changelog tersedia.

## Persyaratan Kualitas
- Standar Pengujian: unit (komponen & util), integration (panel & API), E2E (alur admin); coverage ≥80%.
- Metrik Kinerja: TTI p95 ≤ 2.5s; navigasi panel p95 ≤ 250ms; error rate ≤ 1%.
- Prosedur Validasi & Verifikasi: review kode, lint & type-check, tes berlapis, verifikasi akses RBAC & audit.

## Dokumen Pendukung
- Diagram alur kerja: `documents/apps/admin/architecture.mmd` → render PNG `architecture.png`.
- Dokumentasi API: rujuk `documents/api/openapi.yaml` untuk endpoint admin terkait.
- Panduan Pengguna: halaman bantuan di `apps/docs` (guides: admin/tenants/rbac/billing).

## Kontribusi & Lisensi
- PR dengan lint/test hijau; lisensi MIT.
