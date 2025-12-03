## Tujuan
- Menyempurnakan UI/UX dan aksesibilitas (a11y) di seluruh komponen.
- Menutup celah bug yang ditemukan dan memastikan perilaku sesuai spesifikasi.
- Menyelesaikan pengujian menyeluruh (unit, a11y, integrasi, perf) dan memperbarui dokumentasi.

## Audit & Perbaikan Komponen UI
- Button: pastikan `type="button"` default, state `loading` memancarkan `aria-busy`/`aria-disabled`.
- Dialog: tetapkan `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby`; pastikan tombol Close memiliki label sr-only.
- Tooltip: `role="tooltip"` pada konten.
- Input: dukungan `aria-invalid` dan `aria-describedby` untuk pesan error.
- Sidebar: trigger level bertingkat mengirimkan `aria-expanded` dan mengaitkan `aria-controls` ke id kontainer submenu; ikon chevron `aria-hidden`.
- Header: tombol ikon-only (profil) diberi `aria-label` dan ikon `aria-hidden`.
- Rujukan contoh kode yang akan dirapikan:
  - `packages/ui/src/components/button.tsx:41-50` (type default, `aria-*`).
  - `packages/ui/src/components/dialog.tsx:37-45` (atribut ARIA dialog).
  - `packages/ui/src/components/tooltip.tsx:17-25` (role tooltip).
  - `packages/ui/src/components/input.tsx:10-18` (aria-invalid/aria-describedby).
  - `packages/ui/src/organisms/Sidebar/Sidebar.tsx:76-93` & `98-106` (expanded/controls & submenu group).
  - `packages/ui/src/organisms/Header/Header.tsx:51-53` (label profil & hidden icon).

## Peningkatan AGUIEventStream
- Semantik a11y
  - Hubungkan judul ke area scroll via `aria-labelledby`; indikator koneksi sebagai `role="status"` dengan `aria-live` dan `aria-label`.
  - Feed `role="feed"` memiliki `id` dan `aria-relevant="additions"`, `aria-busy` mengikuti koneksi.
  - Label deskriptif per item event (`role="article"`, `aria-label`).
- Virtualisasi & Auto-scroll
  - Gunakan `ResizeObserver` untuk `viewportHeight`; atur `scrollTop` ke `scrollHeight` saat `autoScroll` aktif dan event bertambah.
- Toolbar
  - Input pencarian berlabel; filter tipe dengan `aria-label`/`label` terasosiasi; tombol auto-scroll menggunakan `aria-pressed`.
- Rujukan:
  - `apps/app/src/features/agui/ui/AGUIEventStream.tsx:167-177` (judul & status), `239-245` (area scroll), `253-261` (feed), `264-270` (label event).

## Pengujian
- UI Package (`packages/ui`):
  - Unit & a11y tests untuk Button/Dialog/Tooltip/Input/Header/Sidebar.
  - Stabilkan Radix di lingkungan jsdom via mock pada test Dialog/Tooltip.
  - Konfigurasi: `packages/ui/vitest.config.ts:4-12` (`jsdom`, `globals`, coverage `v8`).
- App (`apps/app`):
  - Aktifkan `environment: 'jsdom'`, `globals: true`, dan alias `@` ke `./src/` untuk resolusi import test.
  - Tambah test a11y untuk AGUIEventStream yang memverifikasi asosiasi live region dan feed.
  - Konfigurasi: `apps/app/vitest.config.ts:4-16`.
- Perf smoke (API):
  - Jalankan k6 terhadap health endpoint gunakan `API_BASE_URL`; threshold p95 latency dan error rate.
  - Rujukan skrip: `apps/api/tests/perf/k6-smoke.js`.

## Dokumentasi
- QA_TEST_PLAN.md: tambahkan skenario a11y (roles, labels, live region), stabilisasi Radix di test, dan langkah perf smoke.
- USAGE_GUIDE.md: panduan penggunaan komponen dengan a11y yang benar (ikon-only labels, wiring dialog & select).
- TECH_SPEC.md: kebijakan a11y (WAI-ARIA), persyaratan `aria-*`, dan standar testing (`jsdom`, coverage `v8`).
- ARCHITECTURE.md: alur observability dan event streaming (feed semantics) diperjelas.
- MAINTENANCE.md: checklist regresi a11y sebelum rilis.

## Validasi & Verifikasi
- Jalankan seluruh unit/a11y tests pada `packages/ui` dan `apps/app`; pastikan hijau.
- Jalankan perf smoke k6 dengan `API_BASE_URL` terset; dokumentasikan hasil.
- Lakukan tinjauan visual a11y (navigasi keyboard, fokus, kontras) pada halaman yang menggunakan Header/Sidebar/Dialog/Tooltip/AGUIEventStream.

## Kriteria Penerimaan
- Semua komponen utama memiliki semantik ARIA yang benar dan lulus unit/a11y tests.
- AGUIEventStream terasosiasi dengan judul, feed live region berfungsi, auto-scroll aman.
- Coverage sesuai ambang (UI & App), perf smoke memenuhi threshold.
- Dokumentasi diperbarui dan mencakup perubahan.

## Risiko & Mitigasi
- Risiko flakiness Radix di jsdom: mitigasi dengan mocking di test.
- Potensi regresi interaksi keyboard: uji manual + test dasar untuk fokus/tab-order.
- Konflik alias test: alias `@` di `apps/app/vitest.config.ts` memastikan resolusi.

## Deliverables
- Patch komponen UI & AGUIEventStream (a11y/UX).
- Test baru/ditingkatkan (unit/a11y) di UI dan App.
- Hasil perf smoke k6 terlampir pada QA docs.
- Dokumentasi (TECH_SPEC, USAGE_GUIDE, ARCHITECTURE, MAINTENANCE, QA_TEST_PLAN) diperbarui.

Silakan konfirmasi rencana ini. Setelah Anda menyetujui, saya akan menerapkan perubahan, menjalankan pengujian, dan memfinalisasi dokumentasi serta laporan penyelesaian.