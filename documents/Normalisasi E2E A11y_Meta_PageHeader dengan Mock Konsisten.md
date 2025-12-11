## Tujuan
Menyempurnakan seluruh spesifikasi di direktori `discovery/observability/monitoring/runs/agui/a11y-artifacts/dialog/pageheader-breadcrumb/axe` agar:
- Bebas dari ketergantungan login helper nyata
- Menggunakan mock endpoint yang konsisten (`/_test-login`, `/workspaces`, `/integrations`)
- Memiliki selector dan landmark yang seragam untuk stabilitas a11y
- Menghasilkan laporan JSON terstruktur dengan metrik eksekusi

## Ruang Lingkup File
- A11y: `*/**/*a11y*.spec.ts`, `a11y-artifacts.spec.ts`, `dialog-a11y.spec.ts`
- Meta: `*/**/*meta*.spec.ts`
- PageHeader: `pageheader-*/*.spec.ts`
- Breadcrumb & Axe: `pageheader-breadcrumb.spec.ts`, `pageheader-axe.spec.ts`
- Runs/AGUI/Discovery/Observability/Monitoring: semua spesifikasi di subdirektori terkait

## 1) Pembersihan Login Helper
- Identifikasi penggunaan helper: cari `import { login, logout } from './utils/auth'`
- Tindakan:
  - Hapus import dan pemanggilan `login/logout`
  - Tambahkan mock konsisten di `beforeEach`:
    - `page.route('**/api/test-login', fulfill({ status: 200, body: { ok: true, role: 'admin' } }))`
  - Validasi: di awal test, panggil request ke `/_test-login` (via `page.request.post`) dan assert `res.ok()`
- Dokumentasi: update header komentar di setiap file (Tujuan, Tanggal, Maintainer, Pedoman, Cakupan)

## 2) Penyebaran Mock Data (/workspaces, /integrations)
- Pola mock HTML minimal (seragam):
  - `<link rel="canonical" href="{BASE}/workspaces">` atau `/integrations`
  - `<meta property="og:url" content="{BASE}/...">`
  - `<header aria-label="Page header" data-testid="page-header"></header>`
  - `<nav aria-label="Breadcrumb">...</nav>`
  - `<main id="main-content"><h1>...</h1></main>`
- Tindakan:
  - Tambahkan `page.route('**/workspaces', ...)` dan `page.route('**/integrations', ...)` sebelum `page.goto`
  - Skenario: success (200 + konten), error (500 + `{ ok:false }`), empty (200 + konten minimal)
  - Timeout handling: gunakan `waitForLoadState('domcontentloaded'/'networkidle')` dan landmark `#main-content`
- Konsistensi:
  - Gunakan `{BASE} = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'`

## 3) Eksekusi Test Suite (Reporter JSON)
- Menjalankan suite:
  - `PLAYWRIGHT_BASE_URL=http://localhost:3001 pnpm -C apps/app test:e2e --reporter=json > apps/app/test-results/results.json`
- Metrik yang dicatat:
  - Jumlah test passed/failed
  - Durasi total dan per-file (akumulasi `results[].duration` per spesifikasi)
  - Persentase keberhasilan = `passed/total * 100`
- Stabilitas antar run: jalankan dua kali dengan seed/mock tetap, bandingkan hasil (diff sederhana pada jumlah fail dan durasi total)

## 4) Penyusunan Laporan
- Ringkasan terstruktur (Markdown + JSON):
  - Statistik: total, passed, failed, durasi total/per-file, keberhasilan (%)
  - Daftar spesifikasi yang butuh penyesuaian (mis. masih timeout, selector tidak stabil)
  - Rekomendasi WCAG per spesifikasi (contoh):
    - Landmark: pastikan `main` unik atau `#main-content`
    - Aria-label: header, breadcrumb, tombol memiliki nama dapat diakses
    - Kontras: token warna memenuhi rasio 4.5:1 (WCAG AA)
    - Keyboard: fokus awal, trap pada dialog/dropdown, tab order
    - ARIA: role/atribut (`dialog`, `navigation`, `aria-live`, `aria-modal`)
- Output:
  - `apps/app/docs/FINAL_REPORT.md` (ringkas)
  - `apps/app/test-results/results.json` (detail reporter)

## 5) Quality Assurance
- Verifikasi tidak ada regresi:
  - Bandingkan hasil run sebelum/sesudah (jumlah fail turun, durasi stabil/membaik)
- Review konsistensi:
  - Semua file memiliki header standar
  - Semua selector menggunakan pola seragam (`data-testid="page-header"`, `#main-content`)
  - Semua login helper diganti mock `/_test-login`
- Dokumentasi:
  - Tambahkan `docs/testing/e2e-guidelines.md` tentang selector dan mocking

## Kriteria Keberhasilan
- 0 penggunaan login helper nyata di seluruh file target
- Semua meta/a11y PageHeader stabil (tidak timeout) dengan mock fixture
- Reporter JSON dihasilkan konsisten; laporan ringkasan terisi dengan metrik dan rekomendasi WCAG
- Tidak ada penurunan cakupan pengujian; assertion a11y tetap dipertahankan

## Risiko & Mitigasi
- Perbedaan perilaku halaman real vs mock: tandai test sebagai `mocked` dan sediakan suite terpisah untuk env staging
- Flakiness embed pihak ketiga (`/api-docs`): gunakan `toBeAttached()` dan wait minimal, optional polling child count

## Permintaan Konfirmasi
Setelah Anda menyetujui rencana ini, saya akan menerapkan mock dan pembersihan ke seluruh spesifikasi yang ditarget, menjalankan suite JSON, dan menyusun laporan komprehensif sesuai poin di atas.