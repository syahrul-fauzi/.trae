## Tujuan
- Menyelesaikan migrasi impor UI ke `@sba/ui/*` dan menghapus sisa `@/shared/ui/*`.
- Menambahkan alias `@sba/supabase/*` dan menyelaraskan tipe API (handler, model, util).
- Mempersiapkan pengalihan alias `@sba/ui/*` ke distribusi `packages/ui/dist` pada branch `alias-redirect`.
- Menjalankan pengujian menyeluruh (unit, integration, e2e, performa) hingga bersih.

## Ruang Lingkup
- Aplikasi `apps/app` (semua fitur UI): AGUI, dashboard, analytics, run-controls, task, widgets.
- Paket `packages/ui` (subpath ekspor, komponen, utils) dan alias dist.
- Alias Supabase di `apps/app` untuk `client`, `queries`, `types`.
- Tipe API: wrapper `withMetrics`, handler route, event/agent metrics.

## Inventaris & Audit
- Inventaris file yang masih memakai `@/shared/ui/*` (contoh: `apps/app/src/features/agui/ui/EnhancedAGUIDashboard.tsx`, `apps/app/src/app/layout.tsx`, `apps/app/src/widgets/ui/*`).
- Inventaris impor Supabase (`@sba/supabase/*`) di komponen: sitemap, posts.server, sign-out, google-signin.
- Tipe yang perlu diselaraskan: `Metrics.avgResponseTime`, `AGUIAgent.taskCount`, `AGUIEvent.userId`, handler `withMetrics`.

## Implementasi Alias Supabase
1. Tambah alias TS di `apps/app/tsconfig.json`:
   - `@sba/supabase/client`, `@sba/supabase/queries`, `@sba/supabase/types` → `../../packages/supabase/src/*`.
2. Jika perlu untuk bundler/dev server, tambah dukungan di konfigurasi build (Next/Vite/webpack) via `resolve.alias`.
3. Tambahkan tipe atau re-export tipe Supabase yang dipakai (mis. `Tables`).

## Penyelarasan Tipe API
1. Refactor pemanggilan `withMetrics` menjadi dua tahap agar sesuai tipe:
   - `const wrap = await withMetrics(...); const res = await wrap(req);`
2. Normalisasi handler Tabs/Select ke `(value: string)` dan lakukan cast internal bila perlu.
3. Sesuaikan pemakaian model:
   - Hindari properti yang tidak ada (atau perluasan tipe model jika memang dibutuhkan) untuk `Metrics`, `AGUIAgent`, `AGUIEvent`.
4. Tangani `date-fns`:
   - Tambah dependensi `date-fns` atau `declare module 'date-fns'` sementara jika hanya untuk type-check.
5. Pastikan ikon dari `@sba/ui/icons` menerima props (`className`)—sudah disiapkan, periksa konsumsi.

## Migrasi Komponen UI
1. Ganti semua impor `@/shared/ui/*` ke `@sba/ui/*` sesuai subpath:
   - `card`, `badge`, `input`, `label`, `select`, `tabs`, `switch`, `separator`, `dialog`, `scroll-area`, `checkbox`, `textarea`, `icons`, `cn`.
2. Pastikan setiap komponen yang dimigrasikan:
   - Fungsionalitas identik, props kompatibel, tidak ada side-effect.
   - Dokumentasi singkat di komentar module level atau README fitur (tanpa mengubah style komentar proyek).
3. Hapus impor tak terpakai dan konsolidasikan impor duplikat.

## Persiapan Branch alias-redirect
1. Buat branch dari `develop` bernama `alias-redirect`.
2. Ubah `apps/app/tsconfig.json` agar `@sba/ui/*` menunjuk ke `../../packages/ui/dist/*`.
3. Pastikan `packages/ui/package.json` mengekspor subpath yang dibutuhkan (sudah disiapkan; verifikasi `card`, `button`, `badge`, `input`, `label`, `progress`, `avatar`, `tabs`, `select`, `scroll-area`, `dialog`, `icons`, `utils`, `monitoring`, `analytics/HeatmapTracker`).
4. Verifikasi dev (HMR) dan prod build berjalan, tidak ada path putus.

## Pengujian Menyeluruh
- Unit:
  - Jalankan paket UI dan apps/app; fokus pada komponen yang diubah (Button, Checkbox, Textarea, Icons, Dialog, HeatmapTracker).
  - Target coverage ≥ 80% untuk kode baru.
- Integration:
  - Alur AG-UI (Dialog, WebSocketProvider), halaman yang memakai `@sba/ui/*` subpath.
  - Supabase alias di halaman auth/posts/sitemap.
- E2E:
  - Jalankan suite Playwright yang sudah ada (a11y, smoke, agui, runs, analytics).
- Performa:
  - Bandingkan ukuran bundle dan waktu interaksi sebelum/sesudah alias dist.
- Lint & type-check:
  - Pastikan bersih (tanpa error), termasuk TS strict.

## Dokumentasi & Changelog
- Tambah entri di `CHANGELOG.md`:
  - Ringkasan migrasi alias UI & Supabase, alasan, dampak, dan langkah verifikasi.
- Update `apps/app/README.md` kebijakan impor UI (konsumsi `@sba/ui/*`), dan catatan alias dist.
- Commit atomic per langkah signifikan (alias TS, migrasi impor, tipe API, branch alias-redirect, pengujian).

## Kriteria Penerimaan
- Semua test pass tanpa error; lint & type-check bersih.
- Tidak ada regresi fungsional; UI/UX konsisten.
- Performa dalam batas yang dapat diterima.
- Dokumentasi teknis diperbarui dan commit jelas.

## Risiko & Rollback
- Risiko: subpath dist tidak sinkron → mitigasi dengan ekspor lengkap di paket UI dan fallback ke `src`.
- Rollback: kembalikan `tsconfig` alias ke `src`, revert commit alias-redirect.

## Eksekusi
- Urutan implementasi: alias Supabase & tipe API → migrasi impor sisa → branch alias-redirect + alias dist → pengujian menyeluruh → dokumentasi & changelog → finalisasi.
