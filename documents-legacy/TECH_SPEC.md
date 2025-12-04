# Spesifikasi Teknis Monorepo SBA

## Workspaces & Package Manager
- Root `package.json` menggunakan workspaces (`apps/*`, `packages/*`, `tooling/*`).
- Konsistensi versi Node dan package manager dijaga melalui `engines` dan lockfile.

## Build Pipeline (Turbo)
- Task standar: `build` (outputs `dist/**`, `.next/**`), `dev` (non-cache), `lint`, `test` (outputs `coverage/**`), `typecheck`.
- Outputs dideklarasikan agar cache dapat dipulihkan lintas paket.

## TypeScript & Linting
- `tsconfig.json` strict, `moduleResolution: bundler`, JSX preserve.
- Semua packages/app extend base config, menjaga konsistensi strictness dan path alias.

## UI Package (`@sba/ui`)
- `main/types/exports` menunjuk ke `./dist/index.js` dan `./dist/index.d.ts`.
- Build via `tsup` menghasilkan `esm,cjs` + deklarasi dts ke `dist/**`.
- Vitest (jsdom) untuk tests; Testing Library untuk assert interaksi.

## DB Package (`@sba/db`)
- `main/types/exports` menunjuk ke `./dist/*` untuk konsumsi konsisten.
- `tsup` menghasilkan artefak build dan deklarasi dts ke `dist/**`.

## API (`apps/api`)
- Vitest (node) dengan coverage provider Istanbul; laporan tersimpan ke `coverage/**`.
- Scripts sinkron dengan Turbo dan lint/typecheck.

## Environment Variables
- Server: `DATABASE_URL`, `SUPABASE_*`, `JWT_SECRET`, `ENCRYPTION_KEY`, dsb.
- Frontend (public): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Observability: `SENTRY_DSN`, `POSTHOG_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
- Turbo Remote Cache (CI): `TURBO_TEAM`, `TURBO_TOKEN`.

## Observability & Security
- Logging terstruktur, metric & tracing (OpenTelemetry) pada service.
- RLS (Row Level Security) untuk tabel multi-tenant; secrets tidak disimpan di repo.

## Kontrak & Integrasi
- OpenAPI (REST) + schema event WS; zod untuk validasi di boundary.
- BaseHub CMS, Storage S3, Redis, dan LLM providers melalui adapter terkontrol.

