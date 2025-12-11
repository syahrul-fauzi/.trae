# SBA-Agentic — Issue & Task Plan for Go-Live (Ready To Build)

## Tujuan

* Menjamin kesiapan produksi dan keberhasilan peluncuran canary → full rollout.

* Menetapkan tugas, pemilik, kriteria keberhasilan, dan langkah verifikasi.

## Lingkup

* apps/app dan apps/web (jika relevan), packages/ui, observability & alerting, CI guard, i18n & a11y.

## Prasyarat Teknis

* Env: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

* Supabase: gunakan factories `@sba/supabase` (client/server), tanpa hardcode URL/key di klien.

* CI Guard: `pnpm run ci:guard` hijau.

* Build: `pnpm -r --filter apps/* build` hijau.

* Type-check: `pnpm -r --filter apps/* type-check` hijau.

* Test: unit/integrasi hijau; coverage paket kritis ≥80% (target i18n ≥90%).

* Observability: `/api/metrics` aktif; alert p95 ≤500ms & error rate ≤0.5%.

## Tugas Utama

* Kerasionalisasi UI:

  * Migrasi komponen ke design system (`@sba/ui`): Tabs, Alert, DropdownMenu.

  * Konsolidasikan `data-testid` (nav-\*) di Header/Sidebar/AppLayout.

* Testing & QA:

  * Migrasi Jest → Vitest: konversi eksplisit `jest.*` → `vi.*`, shim global di `vitest.setup.ts`.

  * I18n: middleware explicit, mock `getTranslation()` untuk `en|fr|id|es`; tambah test fallback, pluralization, currency/date.

  * A11y: gunakan `jest-axe` matcher (`toHaveNoViolations`); perbaiki selector ambiguitas.

* ESLint & Typed-lint:

  * `tsconfig.eslint.json` mencakup test dan widgets; override untuk `src/test/**/*` mematikan typed-lint.

  * Rapikan lint widgets (import sort, a11y, Link/Image).

* Observasi Canary:

  * Sampling 5m, laporan 15m selama ≥4 jam; dokumentasi di `docs/deployment/*`.

  * Siapkan rollback terukur; verifikasi health & metrics.

## Rencana Eksekusi (Tahap)

* Tahap 1 (Dev/Staging):

  * Jalankan lint/test/coverage, pastikan hijau.

  * Canary 5% di staging; dokumentasi anomali.

* Tahap 2 (Prod Canary):

  * Rollout 5% traffic; aktifkan alert.

  * Observasi 4 jam; jika stabil → naikkan bertahap 10% → 25% → 50% → 100%.

* Tahap 3 (Post-Go-Live):

  * Postmortem ringkas; perbaikan minor; rencana feature berikutnya.

## Kriteria Keberhasilan

* Semua gates hijau: lint, type‑check, test, coverage target.

* Tidak ada kebocoran kunci di bundle klien (guard pass).

* Observability & alerting aktif; p95 dan error rate dalam batas.

* Dokumentasi go‑live lengkap, rollback tervalidasi.

## Verifikasi & Perintah

* Lint: `pnpm --filter @sba/app lint`

* Test: `pnpm --filter @sba/app test:unit`

* Coverage: `pnpm --filter @sba/app test:coverage`

* Build: `pnpm -r --filter apps/* build`

* Canary log: `docs/deployment/canary-WS-Edge-YYYY-MM-DD.md`

## Pemilik

* Tech Lead (overall), QA Lead (testing), Ops/SRE (observability & deployment), FE Lead (UI/design system), BE Lead (Supabase & API).

## Risiko & Mitigasi

* Lint widgets berat → lakukan autofix dan patch bertahap.

* Akses metrics butuh sesi admin → gunakan staging admin untuk verifikasi.

* Native deps bermasalah → `pnpm i --ignore-scripts` sebagai fallback dev.

## Lampiran

* Runbook: `docs/deployment/OPERATIONS_RUNBOOK.md`

* Checklist: `docs/deployment/GO_LIVE_CHECKLIST.md`

* Validasi Alerts: `docs/deployment/ALERTS_VALIDATION.md`

* Observasi: `docs/deployment/observations/*`

