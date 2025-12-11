## Tujuan & Luaran
- Menyelesaikan seluruh pekerjaan yang sedang berjalan hingga hijau (unit, integrasi, e2e) dengan coverage ≥ 80%.
- Menstabilkan komponen/store (Responsive, Metadata, Analytics Heatmap) dan memperkuat dokumentasi (spec, user manual, API).
- Menghasilkan laporan akhir: status tugas, changelog, prosedur deployment/rollback, monitoring, troubleshooting.

## Titik Awal (Progres Terakhir)
- Test runner: Vitest config di `apps/app/vitest.config.ts` (threads=1, setupFiles, alias UI). Storybook aktif di `packages/ui/.storybook/*`.
- Store: Responsive store dan helpers di `apps/app/src/stores/responsive.ts` dan `helpers/base-responsive-store.ts`.
- Metadata: Normalisasi di `apps/app/src/shared/lib/metadata.ts`.
- Mocks: Supabase & Sentry via `apps/app/src/test/vitest.setup.ts`. Shim `next/dynamic`.
- Analytics Heatmap: Komponen `packages/ui/src/ui/analytics/HeatmapTracker.tsx` + stories di `HeatmapTracker.stories.tsx`. PRD di `workspace/01_PRD/analytics_heatmap.md`.

## Checklist Verifikasi Status
- Konfigurasi pengujian: environment, setupFiles, alias (@/ @sba/ui, next/dynamic shim) terpasang.
- Mocks: Supabase, Sentry, performance APIs tersedia dan aktif pada suite terkait.
- Responsive Store: ekspor API vanilla (`responsiveStoreApi`) dan hook `useResponsiveStore` konsisten.
- Metadata generator: canonical, alternates, openGraph sejalan; trailing slash terstandarisasi.
- Storybook: addons `a11y`, `interactions` aktif; stories Heatmap berfungsi.
- Health endpoints: dev/test liveness/readiness OK.

## Dependency Mapping
- Framework: Next.js (apps), React (UI), NestJS (API).
- Testing: Vitest (unit/integrasi), Playwright + Axe (e2e/a11y), Storybook Testing Library.
- State: Zustand (vanilla + hook). UI: `@sba/ui` dist exports.
- Observability: Sentry (mocks), OpenTelemetry (API), metrics provider.
- Data: Supabase client (mock). WebSockets: provider untuk analytics/insight widgets.
- Security: RBAC tenant header, rate-limiting, CSP dev/test.

## Penyelesaian Pekerjaan yang Sedang Berjalan
- Responsive tests: refactor assertions ke `useResponsiveStore.getState()` pasca `act(...)`; gunakan reset berbasis actions; hilangkan ketergantungan helper yang dimock.
- Metadata tests: samakan ekspektasi terhadap `URL` (gunakan `.origin` atau strip trailing slash) untuk konsistensi spesifikasi.
- Heatmap Tracker: finalisasi props (enabled, overlay, togglePosition, intensity, radius, endpoint, meta); tambahkan negative tests (invalid payload, disabled mode).
- WebSocketMetricsPanel: lengkapi pattern (stories & tests) untuk live metrics; validasi a11y.
- AGNotificationsPanel: implementasi dasar (list, read/unread, keyboard nav) + tests.
- A11y pada atoms terpilih: tambahkan tests (role/aria, keyboard, contrast) dan perbaiki token bila perlu.

## Dokumentasi
- Technical Specification: arsitektur Responsive Store & heatmap pipeline (komponen → API → overlay).
- User Manual: cara mengaktifkan heatmap, toggle overlay, filter admin.
- API Documentation: `POST/GET /api/analytics/heatmap` skema payload, filter, status kode.

## Review Konsistensi
- Code Review: konvensi impor `@sba/ui` root, penggunaan helpers, tanpa komentar berlebih, keamanan.
- Design Review: konsistensi desain atoms/molecules, posisi toggle overlay heatmap vs layout.

## Verifikasi Spesifikasi (Traceability)
- Mapping requirement ↔ implementasi ↔ test untuk: Responsive Store, Metadata, Heatmap API/UI, WebSocket metrics, Notifications.
- Lengkapi traceability matrix di docs.

## Regression Testing
- Unit: target ≥80% lines/functions; fokus store, metadata, analytics.
- Integration E2E: jalankan subset apps/app + api; validasi health, tools, analytics endpoints.
- Performance: critical path heatmap `POST` p95 ≤ 500ms; overlay render tidak blocking; memori/CPU aman.
- Security: header `x-tenant-id`, rate-limit, CSP dev/test; tidak ada PII pada heatmap.
- UAT: skenario pengguna untuk toggle heatmap, filter admin overlay, dan navigasi.

## Timeline & Prioritas
- Prioritaskan: perbaikan tests Responsive & Metadata → Heatmap Tracker → WebSocketMetricsPanel → Notifications → A11y atoms.
- Critical path: konsistensi test runner + analytics pipeline; resource leveling antara UI, API, dan tests.

## Risk Assessment Matrix
- Performa tulis heatmap: mitigasi batch/rate-limit, sampling.
- Privasi: hanya koordinat & path; audit payload.
- Alias/Mocks rapuh: gunakan resolusi ke dist, passtrough mock bila perlu.

## Update Status Berkala
- Laporan harian/mingguan: % completion, velocity, pass/fail count, coverage, p95 latensi.
- Kendala: catat root cause, mitigasi, ETA.
- Rencana tindak lanjut: langkah selanjutnya, assignee jelas.

## Quality Gates
- Coverage unit ≥80% (lines, funcs, branches, stmts).
- Integrasi/E2E pass rate ≥95%; tidak ada error console/a11y blocker.
- Perf: p95 heatmap ≤500ms; error rate ≤0.5%.

## Deliverables
- Laporan akhir: status tugas dengan verifikasi, changelog terstruktur.
- Dokumen operasi: deployment, rollback, monitoring checklist, troubleshooting guide.
- Traceability matrix dan technical debt log + known issues.

## Eksekusi (Urutan Tindakan)
1) Audit test env & alias; pastikan mocks/fixtures aktif.
2) Perbaiki Responsive tests (assertions reset & getState).
3) Selaraskan ekspektasi Metadata tests (origin/trailing slash).
4) Lengkapi Heatmap Tracker stories/tests (positive/negative, a11y).
5) Implementasi & uji WebSocketMetricsPanel (stories/tests).
6) Implementasi & uji AGNotificationsPanel.
7) Tambah a11y tests pada atoms terpilih.
8) Jalankan regression (unit, integrasi, e2e, perf, security) dan rekap metrik.
9) Lakukan code/design review, update docs (spec, manual, API).
10) Susun laporan akhir dengan changelog & prosedur operasional.