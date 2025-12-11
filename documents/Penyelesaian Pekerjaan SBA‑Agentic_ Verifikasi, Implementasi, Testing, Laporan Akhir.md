## Baseline Status
- Metadata helper selesai di `apps/app/src/shared/lib/metadata.ts`; sudah dipakai oleh `/(authenticated)/dashboard|analytics|hub|insights`.
- Beberapa halaman masih metadata manual (`apps/app/src/app/layout.tsx`, `/(authenticated)/knowledge`, `/(dashboard)/posts`, `/(authenticated)/run-controls`).
- Konfigurasi unit test & coverage ada di `apps/app/vitest.config.ts` (V8, thresholds 80%).
- Playwright E2E siap di `apps/app/playwright.config.ts` (webServer dev, `NEXT_PUBLIC_PREVIEW_ALLOW_GUEST=true`).
- Halaman stub untuk `/observability` dan `/api-docs` belum ada di `apps/app/src/app/**`.
- Duplikasi alias terdeteksi: `apps/app/tsconfig.json` ("@/lib/*" muncul dua kali) dan `apps/app/vitest.config.ts` (alias `@sba/ui/label` ganda).
- AuthLayout dengan overlay & ARIA sudah lengkap (`packages/ui/src/templates/AuthLayout/AuthLayout.tsx` + tes).
- Meta Events Feedback API & tes lengkap di `apps/web/src/app/api/meta-events/`.
- HeatmapTracker aktif (`packages/ui/src/ui/analytics/HeatmapTracker.tsx`) dan dipakai di app; endpoint `apps/app/src/app/api/analytics/heatmap/route.ts` tersedia.

## Pekerjaan Tertunda
- Tambah stub page: `/observability` dan `/api-docs` sesuai ekspektasi smoke E2E.
- Rapikan alias yang duplikat di `apps/app/tsconfig.json` dan `apps/app/vitest.config.ts`.
- Siapkan mock login untuk E2E (route sederhana + util login di specs).
- Harmonisasi metadata pada halaman yang belum memakai helper (minimal: pastikan canonical dan OG/Twitter konsisten).
- Jalankan dan stabilkan E2E (smoke lalu full), hasilkan laporan HTML, JUnit, dan coverage.

## Rencana Implementasi
- Tambah `apps/app/src/app/observability/page.tsx`:
  - `main[aria-label="Observability Dashboard"]`, `<h1>Observability Dashboard</h1>`, `region[aria-label="Raw metrics text"]` berisi placeholder metrics.
- Tambah `apps/app/src/app/api-docs/page.tsx`:
  - `main[aria-label="API Documentation"]`, `<h1>API Documentation</h1>`, container `#swagger-ui` dengan placeholder.
- Rapikan alias:
  - Hapus salah satu entri duplikat `"@/lib/*"` di `apps/app/tsconfig.json`.
  - Gabungkan alias `@sba/ui/label` menjadi satu entri di `apps/app/vitest.config.ts`.
- Mock login E2E:
  - Buat route `apps/app/src/app/api/test-login/route.ts` (set cookie/session untuk role user) + `api/test-logout` untuk cleanup.
  - Tambah util `apps/app/e2e/utils/auth.ts` agar specs bisa login via `requestContext`.
- Metadata konsisten (incremental):
  - Terapkan `generateBaseMetadata(...)` ke halaman manual yang kritis (tanpa mengubah perilaku UI), pastikan `alternates.canonical` benar.

## Pengujian & Verifikasi
- Unit test & coverage: `pnpm -C apps/app test -- --coverage` (target thresholds 80%).
- API meta-events (apps/web): jalankan semua tes unit; verifikasi mocking & rate limit.
- E2E:
  - Mulai dev server (`pnpm -C apps/app dev`) agar webServer Playwright tidak time-out.
  - Jalankan smoke (`pnpm -C apps/app run test:e2e e2e/smoke.spec.ts`), lalu full suite dengan reporter `html`, `list`, `junit` dan artifacts.
  - Jika tes auth gagal, aktifkan mock login di awal suite; bersihkan sesi di `afterAll`.

## Quality Control & Konsistensi
- Validasi metadata via util `validateMetadataConsistency` pada halaman yang diubah.
- Aksesibilitas: pastikan hanya satu landmark `main` per page (layout menyuplai `main`), cek region labels konsisten.
- Regressions: jalankan a11y E2E, dashboard/meta E2E, dan lint/typecheck; pastikan tidak ada error baru.

## Dokumentasi & Deliverables
- Update `apps/app/README.md` (Testing & CI):
  - Perintah unit/E2E, reporter yang dihasilkan, lokasi coverage (`coverage/lcov.info`, `coverage/index.html`) dan Playwright report (`playwright-report`).
- Buat ringkasan perubahan (CHANGELOG atau `docs/release-notes.md`).
- Laporan akhir berisi:
  - Daftar tugas yang diselesaikan.
  - Delta perubahan dari versi sebelumnya.
  - Instruksi penggunaan/maintenance (run tests, start server, mock login opsi, env yang perlu disetel).

## Prioritas & Antisipasi Hambatan
- Prioritas 1: stub pages + alias cleanup (blokir smoke E2E dan kestabilan build).
- Prioritas 2: mock login untuk E2E (menstabilkan auth-required flows).
- Prioritas 3: metadata konsisten pada halaman manual (mengurangi perbedaan canonical/OG/Twitter).
- Antisipasi: Playwright webServer timeout jika dev server belum jalan; mitigasi dengan menjalankan `dev` sebelum E2E.

## Permintaan Konfirmasi
- Setelah Anda menyetujui rencana ini, saya akan langsung menerapkan perubahan, menjalankan seluruh tes (unit & E2E), memperbaiki bila ada kegagalan, lalu menyerahkan laporan akhir beserta semua deliverables dan instruksi maintenance.