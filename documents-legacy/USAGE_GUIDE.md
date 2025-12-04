# Panduan Penggunaan SBA

## Prasyarat
- Node LTS (≥ 18)
- pnpm
- Konfigurasi `.env` berdasarkan `.env.example`

## Instalasi & Setup
- Instal dependensi: `pnpm install`
- Konfigurasi env:
  - Server: `DATABASE_URL`, `SUPABASE_*`, `JWT_SECRET`
  - Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Observability: `SENTRY_DSN`, `POSTHOG_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`
  - Turbo cache (opsional CI): `TURBO_TEAM`, `TURBO_TOKEN`

## Menjalankan
- Dev semua aplikasi: `pnpm dev`
- Dev per aplikasi: `pnpm --filter <app> dev`
- Build: `pnpm build`
- Test:
  - UI: `pnpm --filter @sba/ui test`
  - API (coverage): `pnpm --filter @sba/api test:cov`

## Struktur Monorepo (ringkas)
- `apps/` — aplikasi (web, api, worker)
- `packages/` — paket bersama (ui, db, tools, dsb.)
- `tooling/` — konfigurasi Typescript/Linting
- `/.trae/documents/` — dokumentasi

## Integrasi Komponen UI
- Impor dari `@sba/ui` (atoms/molecules/organisms/templates)
- Ikuti pedoman a11y (roles/ARIA, focus, keyboard)

## Observability
- Aktifkan Sentry/PostHog sesuai env
- Gunakan dashboard metrik dan alert untuk pemantauan

