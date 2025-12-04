## Tujuan
- Memverifikasi perubahan yang sudah diterapkan (build artifacts, test coverage, a11y), menyelesaikan penguatan UI/UX komponen inti, menyelaraskan pipeline Turbo/pnpm, dan menutup pekerjaan dengan dokumentasi lengkap.

## Ruang Lingkup
- Paket: `@sba/db`, `@sba/ui`, `@sba/api`, komponen UI (Input, Button, Dialog, Select).
- Build, test, coverage, dan cache Turbo.
- Aksesibilitas (WAI‑ARIA), responsivitas, dan lintasan E2E untuk alur utama.
- Dokumentasi deliverables dan QA report.

## Langkah Teknis
### 1) Verifikasi Build & Cache
- `@sba/db`:
  - Jalankan `pnpm --filter @sba/db build` dan verifikasi `dist/index.js` + `dist/index.d.ts`.
  - Pastikan konsumsi paket lain terhadap `@sba/db` menggunakan `exports` baru.
- `@sba/ui`:
  - Jalankan `pnpm --filter @sba/ui build` dan pastikan `dist/**` + dts.
- Turbo (`turbo.json:5-8,16-18`):
  - Pastikan outputs `dist/**`, `.next/**` dan `coverage/**` tersinkron di semua paket.

### 2) Konsolidasi Test & Coverage API
- `apps/api` (Vitest):
  - Jalankan `pnpm --filter @sba/api test:cov` untuk menghasilkan `coverage/**` sesuai Turbo.
  - `vitest.config.ts` memakai `coverage.provider: 'v8'` (sudah diatur).
  - Target coverage awal ≥ 60% (naik bertahap sesuai roadmap).

### 3) Audit & Penguatan A11y Komponen UI
- Input, Button, Dialog, Select:
  - Input: role default, `aria-invalid`/`aria-describedby` aktif.
  - Button: default `type="button"` bila tidak `asChild`.
  - Dialog: `aria-modal`, `aria-labelledby="dialog-title"`, `aria-describedby="dialog-description"`, id pada Title/Description.
  - Select: `aria-haspopup`, `aria-controls`, `role=listbox/option`, `aria-selected`, dan keyboard nav.
- Unit tests: jalankan semua tes baru (Button/Dialog/Select) di paket UI.
- Responsivitas: cek breakpoint, fokus ring, kontras (WCAG AA).

### 4) CI/CD & Turbo
- Aktifkan cache pnpm dan (opsional) Turbo remote cache.
- Jalankan pipeline lint→typecheck→test→build→e2e dengan `--filter` paket terdampak.
- Evaluasi waktu build; target pengurangan ≥ 20% dibanding baseline.

### 5) E2E & Perf (Opsional bila env tersedia)
- Alur utama: chat → tool call → render → task; onboarding.
- SSE/WS: connect time p95 ≤ 1 s; delivery p95 ≤ 150 ms.
- Perf: Lighthouse p75 (Perf ≥ 90, A11y ≥ 95), API latency p95 ≤ 300 ms.

### 6) Dokumentasi & Deliverables
- Perbarui `daftar deliverables artefak.md` dengan ringkasan perubahan:
  - Sinkronisasi build & cache (db/ui), konsolidasi test API, peningkatan a11y + unit tests.
- Tambah catatan AC & hasil verifikasi (build log, coverage summary, listing `dist/**`).

## Kriteria Penerimaan
- `@sba/db` dan `@sba/ui` menghasilkan artefak `dist/**` + dts; `exports` dikonsumsi dengan benar.
- `apps/api` menghasilkan `coverage/**` via Vitest; laporan coverage tersedia.
- Komponen UI (Input, Button, Dialog, Select) lulus unit tests; a11y lintasan dasar valid.
- Pipeline CI/CD lint→typecheck→test→build berjalan dengan cache efektif.
- Dokumentasi deliverables diperbarui dengan ringkasan perubahan dan bukti verifikasi.

## Risiko & Mitigasi
- Perbedaan lingkungan Node/pnpm → pin engines di root dan gunakan `--frozen-lockfile`.
- Flaky tests a11y → gunakan `testing-library` best practices dan `jest-dom` assertions.
- Ketergantungan pada Turbo outputs → pastikan semua paket menulis `dist/**` secara konsisten.

## Penjadwalan
- Hari 1: Verifikasi build & coverage; audit dan jalankan unit tests UI.
- Hari 2: Optimasi pipeline CI/CD dan cache; dokumentasi deliverables + laporan verifikasi.
- Hari 3: (Opsional) E2E & perf checks; finalisasi dokumen dan penutupan.

## Hasil yang Diharapkan
- Build & cache konsisten di seluruh paket.
- Coverage API sinkron dengan Turbo; a11y komponen inti kuat dan tervalidasi.
- Dokumentasi deliverables menunjukkan perubahan dan bukti verifikasi; pekerjaan siap ditutup.