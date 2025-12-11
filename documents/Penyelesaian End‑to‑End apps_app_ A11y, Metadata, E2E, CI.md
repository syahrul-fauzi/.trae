## Baseline & Audit
- Tinjau changelog, skrip, dan halaman yang sudah dimigrasi ke `generateBaseMetadata` (Settings/Integrations/Knowledge/AGUI/Dashboard/Hub/Insights/Analytics/Run Controls) untuk konsistensi.
- Konfirmasi konfigurasi Playwright, reporter, dan runner sudah tersedia di `apps/app/package.json:5–55` serta helper metadata di `apps/app/src/shared/lib/metadata.ts:17–77`.
- Audit halaman target yang belum diselaraskan metadata/a11y:
  - Monitoring: `apps/app/src/app/(authenticated)/monitoring/page.tsx:5–14` (masih `export const metadata`).
  - Workspaces: `apps/app/src/app/(authenticated)/workspaces/page.tsx:3–13` (static metadata, landmark minimal).
  - Runs: `apps/app/src/app/(authenticated)/runs/page.tsx:3–15` (static metadata, landmark minimal).
  - Discovery: `apps/app/src/app/(authenticated)/discovery/page.tsx:5–11` (static metadata, landmark belum lengkap).
  - Observability: `apps/app/src/app/observability/page.tsx:4–16` (static metadata, landmark sebagian). 

## Dependency Mapping
- Framework & runtime: `next@15`, `react@18`, monorepo workspace `@sba/*`.
- Testing: `vitest`, `@playwright/test`, `@axe-core/playwright`, `@testing-library/*`, coverage via `@vitest/coverage-v8`.
- A11y & lint: `eslint` + `eslint-plugin-jsx-a11y`, `jest-axe`.
- Validasi & reporting: `ajv`, `ajv-formats`, Playwright reporters (list/html/junit/json), staging runner.
- Observability/security: `lighthouse`, `npm audit`, `@sentry/nextjs`.

## Implementasi: Metadata & A11y (Halaman yang Belum Konsisten)
- Ganti `export const metadata` dengan `export async function generateMetadata()` memanggil `generateBaseMetadata(...)` + `validateMetadataConsistency(...)`:
  - Monitoring: path `'/monitoring'` di `apps/app/src/app/(authenticated)/monitoring/page.tsx:5–14`.
  - Workspaces: path `'/workspaces'` di `apps/app/src/app/(authenticated)/workspaces/page.tsx:3–13`.
  - Runs: path `'/runs'` di `apps/app/src/app/(authenticated)/runs/page.tsx:3–15`.
  - Discovery: path `'/discovery'` di `apps/app/src/app/(authenticated)/discovery/page.tsx:5–11`.
  - Observability: path `'/observability'` di `apps/app/src/app/observability/page.tsx:4–16`.
- Standarisasi landmark:
  - Gunakan `PageHeader` (`banner`), `PageContainer` (`role="main"`), breadcrumb `nav` dengan `aria-label`.
  - Kelompokkan konten dengan `<section aria-label="…">` dan beri `aria-label` untuk tombol aksi.

## E2E: Tambahkan Spesifikasi Meta & A11y (Modul Target)
- Buat spesifikasi berikut dengan pola yang sama seperti Settings/Integrations/Knowledge/AGUI:
  - `apps/app/e2e/monitoring-meta.spec.ts` dan `monitoring-a11y.spec.ts`.
  - `workspaces-meta.spec.ts` dan `workspaces-a11y.spec.ts`.
  - `runs-meta.spec.ts` dan `runs-a11y.spec.ts`.
  - `discovery-meta.spec.ts` dan `discovery-a11y.spec.ts`.
  - `observability-meta.spec.ts` dan `observability-a11y.spec.ts`.
- Meta checks: `link[rel="canonical"]` dan `meta[property="og:url"]` harus diawali `PLAYWRIGHT_BASE_URL` dan diakhiri path publik yang tepat.
- A11y checks: tags `wcag2a/wcag2aa`, 0 critical/serious, minor ≤ 2; landmark `main` dan breadcrumb hadir; tulis artefak Axe (JSON + screenshot + HTML konteks) ke report dir.

## Regression, Integration & Unit Testing
- Jalankan `test:all` setelah penambahan spesifikasi. Target coverage unit ≥ 80% untuk shared lib dan halaman yang dimodifikasi.
- Tambah unit test untuk metadata halaman baru (konsistensi canonical/OG) di `apps/app/src/shared/lib/__tests__/pages-metadata.test.ts` (mengikuti pola yang sudah ada).
- Gunakan existing E2E smoke (`apps/app/e2e/smoke.spec.ts`, `pageheader-*`, `auth*`) untuk mendeteksi regresi landmark/UX.

## Performance & Security Testing
- `performance:audit` dengan Lighthouse untuk halaman Dashboard/Observability/Discovery.
- `security:audit` dan `security:check` untuk audit dependency dan pemeriksaan konfigurasi.

## CI Gates & Artifacts
- Gunakan workflow E2E staging yang sudah ada untuk `PLAYWRIGHT_BASE_URL` dan upload reporter HTML/JUnit/JSON serta artefak Axe.
- Tambah validasi summary JSON via `test:e2e:validate` (Ajv) sebagai gate.

## Dokumentasi & Traceability
- Lengkapi:
  - Technical spec: arsitektur metadata helper, kebijakan a11y, pola E2E, reporter & artefak.
  - User manual: navigasi modul, fitur utama, persyaratan aksesibilitas.
  - API documentation: rute relevant (health, agent status/controls), dan referensi OpenAPI jika ada.
  - Deployment procedure, rollback plan, monitoring checklist, troubleshooting guide.
  - Traceability matrix: requirement ↔ implementasi ↔ test cases ↔ artifacts.
  - Changelog: catat migrasi metadata & penambahan spesifikasi E2E pada modul target.

## Risk Assessment & Mitigation
- Port/BASE URL bentrok: gunakan `PLAYWRIGHT_BASE_URL` dan `reuseExistingServer: false` sesuai konfigurasi.
- Header SSR (forwarded-proto/host/locale) tidak tersedia: fallback ke env `NEXT_PUBLIC_APP_URL` dan default `en` (sudah di helper).
- Coverage < 80%: tambahkan unit test untuk helper dan halaman baru hingga lewat ambang.
- A11y violasi: perbaiki landmark/tombol/label, kurangi kompleksitas interaksi sebelum retest.

## Prioritas & Urutan Eksekusi
- P1: Migrasi metadata + landmark untuk Monitoring/Workspaces/Runs/Discovery/Observability.
- P2: Tambahkan E2E meta/a11y untuk semua modul target dan validasi di staging.
- P3: Lengkapi unit/integration tests dan pastikan coverage.
- P4: Performance/security audit + CI gates (summary validator) dan dokumentasi akhir.

## Acceptance Criteria
- Metadata konsisten (canonical/OG/twit) pada semua halaman target; helper digunakan.
- A11y: 0 critical/serious, minor ≤ 2; landmark `main`/breadcrumb hadir.
- Testing: unit ≥ 80% coverage; `test:all` dan E2E staging lulus; reporter & artefak tersedia.
- CI: gates aktif, validator summary lulus; changelog diperbarui.
- Dokumen: lengkap (spec, manual, API, deployment/rollback/monitoring/troubleshooting, traceability).
