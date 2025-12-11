## Tujuan & Ruang Lingkup
- Menyelesaikan seluruh pekerjaan berjalan pada `apps/app` (Next.js App Router) beserta integrasi E2E/CI, dengan verifikasi kualitas menyeluruh dan dokumentasi operasional.
- Menjaga konsistensi terhadap keputusan sebelumnya: helper metadata terpusat, AuthLayout aksesibel, mock login untuk E2E, reporter Playwright (list/html/junit/json), coverage minimal 80%.

## Audit Progres & Mapping Dependensi
- Telaah progres terakhir: metadata helper (`apps/app/src/shared/lib/metadata.ts`), halaman terautentikasi yang telah memakai `generateBaseMetadata()`/`validateMetadataConsistency()`, stub `observability` dan `api-docs`, Playwright config (`apps/app/playwright.config.ts`) dengan `PLAYWRIGHT_SKIP_WEBSERVER` dan global setup/teardown, mock responsive store (`apps/app/vitest.setup.ts`), alias tsconfig (`apps/app/tsconfig.json`).
- Petakan dependensi utama: Next.js, Playwright, Vitest (coverage v8), Supabase SDK/SSR, Zod, @axe-core/playwright, next-themes, paket internal `@sba/ui` (termasuk `@sba/ui/theme`).
- Verifikasi integrasi endpoint inti: tools (`/api/tools/*`), runtime runs (`/api/runtime/runs`), SSE agent (`/api/agent`), tenants (`/api/tenants`).
- Sorot area yang sedang dibuka: upload konfigurasi (`apps/app/src/features/upload/config.ts`) untuk konsistensi storage/Supabase.

## Checklist Verifikasi Awal
- Metadata konsisten: semua halaman `(authenticated)` memanggil helper; canonical, alternates, OG/Twitter, `metadataBase` berakhiran `/`.
- AuthLayout: landmark tunggal, `aria-labelledby`/`aria-describedby`, props overlay sesuai desain.
- Stub pages: `apps/app/src/app/observability/page.tsx`, `apps/app/src/app/api-docs/page.tsx` tersedia dan berfungsi.
- Tsconfig alias: tidak ada duplikasi; resolusi `@sba/ui/theme` benar.
- Playwright: global login/logout aktif; `reuseExistingServer` saat non-CI; env `PLAYWRIGHT_BASE_URL` digunakan.
- Responsive store mock: ekspor API lengkap sehingga unit test lulus.
- Upload config: memverifikasi target bucket, batas ukuran, tipe MIME, dan sanitasi nama file.

## Penyelesaian Tugas Tertunda
- Luaskan inisialisasi login ke semua suite E2E yang menyentuh `(authenticated)` rute (tambahkan `beforeAll/afterAll` atau manfaatkan global setup).
- Lengkapi helper metadata pada halaman yang belum direfaktor (dashboard/analytics/workspaces/knowledge/run-controls, dst.).
- Lengkapi dokumentasi: technical spec, user manual, dan API doc konsisten dengan implementasi.
- Finalisasi konfigurasi upload: parameter size limit, tipe aman, penanganan error, dan dokumentasi.
- Pastikan reporter Playwright menghasilkan artefak JSON/HTML/JUnit; wiring CI artifacts (workflow sudah ada, validasi output paths).

## Review & Konsistensi
- Code review: periksa idiom App Router, pola RBAC via `withRBAC`, tracing via `withMetrics`, dan headers SSE yang aman.
- Design review: konsistensi UI `@sba/ui`, tema `@sba/ui/theme`, aksesibilitas formulir/login.
- Requirement-by-requirement verification: cocokkan implementasi dengan spesifikasi yang telah diputuskan (metadata, auth gating, tools-flow deterministik, runflow SSE & cancel, storage/upload).

## Pengujian Menyeluruh
- Unit: jalankan Vitest dengan coverage v8 minimal 80%; tambahkan test untuk bagian yang lemah (upload config, helper metadata untuk halaman baru).
- Integration/E2E: jalankan Playwright pada baseURL eksternal; validasi alur auth, runflow (start/list/detail/cancel), tools-flow deterministik, halaman settings/accessibility/meta.
- Performance: uji critical path (render halaman `(authenticated)` utama, SSE stream, list runs) dengan metrik waktu muat dan throughput dasar.
- Security: verifikasi RBAC di API (403/401), rate limiting di `/api/agent`, sanitasi input (Zod), CORS/headers SSE.
- UAT: skenario stakeholder pada dashboard/admin heatmap, tools-flow, settings, upload.

## Quality Gates & Traceability
- Coverage gate 80% dengan reporter text/html/json/lcov.
- A11y gate: gunakan `@axe-core/playwright` pada halaman utama untuk mendeteksi isu dasar.
- Traceability matrix: mapping requirement → implementasi (file/rute) → test ID → status.
- Technical debt log: catat item yang ditunda namun non-blocker.

## Timeline & Prioritas
- Prioritas 1: stabilisasi E2E auth init, metadata konsistensi, upload config.
- Prioritas 2: dokumentasi lengkap (API/User/Technical), traceability, quality gates.
- Prioritas 3: performance & security hardening tambahan.

## Risk Assessment & Mitigasi
- Port konflik dev server: pakai `PLAYWRIGHT_SKIP_WEBSERVER` dan `PLAYWRIGHT_BASE_URL` jelas.
- Flakiness SSE: tambahkan timeout & retry kecil pada request E2E; pastikan header SSE disetel.
- Alias/tema gagal muat: lint paths dan resolusi `@sba/ui/theme` sebelum test.
- Upload risiko keamanan: batasi MIME, size, sanitize; siapkan fallback error robust.

## Update Status Berkala
- Laporkan metrik: % completion, jumlah test lulus/gagal, coverage, flakiness indeks.
- Catat kendala, RCA singkat, dan mitigation plan; revisi timeline jika diperlukan.
- Assign tindakan lanjutan pada artefak dokumen dengan pemilik yang jelas.

## Deliverables & Laporan Akhir
- Kode stabil dengan test lulus dan coverage ≥80%.
- Artefak CI: HTML report, JUnit XML, JSON results, screenshots/videos.
- Dokumen:
  - `docs/TECHNICAL_SPEC.md`, `docs/API_DOCS.md`, `apps/app/README.md` (E2E/CI setup)
  - `docs/TRACEABILITY_MATRIX.md`, `docs/KNOWN_ISSUES.md`, `docs/TECH_DEBT.md`
  - Operasional: `docs/DEPLOYMENT.md`, `docs/ROLLBACK.md`, `docs/MONITORING_CHECKLIST.md`, `docs/TROUBLESHOOTING.md`

## Rencana Eksekusi Teknis (Commits Mendatang)
- Refactor metadata di halaman sisa; tambah unit tests baru.
- Tambah/rapikan hooks login di semua suite; verifikasi baseURL/skip webServer.
- Lengkapi `features/upload/config.ts` (limit, MIME, bucket) dan tests.
- Perbarui README dan dokumen operasional; tambahkan traceability matrix; jalankan full regression suite.
