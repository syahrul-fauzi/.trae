## Tujuan
- Menuntaskan sisa pekerjaan kualitas (A11y, stabilitas, integrasi) agar paket @sba/ui siap produksi.
- Memastikan HeatmapTracker aman, efisien, dan tidak mengganggu UX/SSR.

## A11y Remediation
- Perbaiki klik pada elemen non-interaktif:
  - Ubah `<div>`/`span` clickable menjadi `<button>` atau tambahkan `role="button"`, `tabIndex=0`, dan keyboard handlers.
  - Target langsung dari log lint: `ag-ui/monitoring/MonitoringDashboard.tsx` (baris 327, 374), `atoms/FileUpload/FileUpload.tsx` (baris 128), `atoms/Select/Select.tsx` (baris 219).
- Validasi ARIA role yang valid di `ag-ui/stories/WebSocketProvider.stories.tsx`.
- Review cerita `AuthLayout` yang menggunakan anchor `href="#"`; tetap gunakan override lint untuk stories eksploratif, dan tambah varian cerita yang menggunakan `<button>` untuk aksesibilitas.
- Acceptance: lint `jsx-a11y` tanpa error; interaksi keyboard berfungsi di elemen yang dapat diklik.

## Hardening HeatmapTracker
- Tambah opsi `throttleMs` untuk membatasi frekuensi POST; gunakan `requestIdleCallback`/debounce.
- Gunakan `navigator.sendBeacon` jika tersedia untuk mengirim event secara non-blocking (fallback ke fetch).
- Tambah opsi `filter` agar hanya merekam area tertentu (mis. container), bukan seluruh window.
- Tambah pembersihan listener tegas dan unit test untuk memory leak.
- SSR safety: guard ketat untuk akses `window` dan hindari efek pada server.
- Acceptance: unit/integration tests mencakup toggling, resize, throttle/beacon, dan cleanup.

## Integrasi Subpath & Smoke Tests
- Pastikan `tsup` mengeluarkan entri untuk semua subpath (`theme`, `ui`, `analytics/HeatmapTracker`, `molecules`, `organisms`, `templates`, `ag-ui`, `styles`).
- Tambah alias Vitest di apps/web & apps/marketing seperti di apps/app agar impor subpath berhasil saat pengujian.
- Acceptance: smoke tests di semua apps melewati impor root & subpath; tanpa error resolusi.

## E2E & Regression
- E2E: skenario Auth (login/register/reset/verify), dan HeatmapTracker overlay toggle pada halaman demo.
- Regression: jalankan suite yang ada; tambahkan kasus untuk a11y keyboard interaksi pada komponen yang diperbaiki.
- Acceptance: semua skenario inti lulus; tidak ada regresi baru.

## Dokumentasi & Migration Notes
- Perbarui docs dengan opsi HeatmapTracker baru (throttle, beacon, filter) dan contoh best practices.
- Tambah catatan migrasi untuk komponen yang mengubah elemen clickable menjadi `<button>`.
- Acceptance: docs konsisten dengan ekspor aktual dan mencakup edge cases.

## Rilis & Quality Gates
- Lint/type-check/build `@sba/ui` sukses; ukuran bundel wajar; tree-shaking OK.
- Changelog diperbarui; SemVer dipertahankan.
- Acceptance: semua gate hijau dan siap digunakan oleh semua apps.
