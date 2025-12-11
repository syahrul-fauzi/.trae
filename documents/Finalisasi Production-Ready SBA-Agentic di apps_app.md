## Ruang Lingkup & Asumsi
- Fokus pada `apps/app` untuk jalur produksi SBA-Agentic (Next.js App Router, TypeScript strict).
- Gunakan komponen bersama dari `packages/ui` (DashboardLayout v2, AuthLayout + variannya).
- Jaga aksesibilitas (ARIA, keyboard, skip link), performa, testing (unit, integrasi, e2e), dan CI.

## Survei Repo (Read-only)
- Verifikasi workspace yang aktif (`apps/app`, `apps/web`, `packages/ui`) dan impor lintas-paket.
- Identifikasi halaman auth di `apps/app` dan lokasi integrasi Header–Sidebar v2.

## Implementasi Layout Header–Sidebar v2
- Porting/menyelaraskan `DashboardLayout` ke `apps/app`, pastikan:
  - Skip link `#main-content`, landmark `<main id="main-content">`, role, dan focus-visible.
  - Toggle tema dengan persistensi, menu pengguna, notifikasi, dan pencarian aksesibel.
  - Responsif: breakpoint, aria-expanded untuk drawer/sidebar, trap focus saat sidebar terbuka.

## Finalisasi AuthLayout & Halaman Auth di apps/app
- Gunakan `AuthLayout` variannya (login, register, reset-password, verify-email) pada route `app/(auth)/...`.
- Lengkapi opsi overlay (`overlayColor`, `overlayOpacity`, `overlayBlendMode`, `overlayPointerEvents`, `showOverlay`) dengan default aman.
- Social login: tombol disabled jika handler tidak tersedia; label fallback; `aria-label`, `aria-disabled`, `title` konsisten.
- Pastikan landmark `role="main"` dan skip link tersedia di halaman auth.

## Agentic Features (UI/Runtime)
- Integrasikan Reasoning Engine, Generative UI Renderer, Multimodal, Interrupts, Meta-events pada halaman demo/feature di `apps/app`.
- Stabilkan state dan performa: memoization, lazy-loading komponen berat, batching update, error boundaries.

## Aksesibilitas (A11y)
- Terapkan ARIA roles dan keyboard navigation untuk Header, Sidebar, dan Auth.
- Tambahkan tes `jest-axe` untuk halaman utama dan auth; verifikasi tanpa pelanggaran.
- Audit focus management: initial focus, tab order, skip link behavior.

## Performa & Next.js App Router
- Dynamic import untuk komponen berat; pisahkan hydration-boundaries agar SSR stabil.
- Hindari blocking render: gunakan Suspense/streaming bila relevan.
- Analisis bundle (optional) dan hilangkan dependensi tak-terpakai.

## Testing
- Unit: `packages/ui` komponen (AuthLayout, DashboardLayout) dengan @testing-library.
- Integrasi: halaman di `apps/app` (auth flows, header/sidebar interaksi).
- E2E: Playwright untuk login/register/reset, navigasi sidebar, tema, pencarian.
- Threshold: coverage minimal dan a11y harus hijau.

## CI/CD
- Workflow: typecheck, lint, unit+integrasi, e2e (opsional gated), a11y job.
- PNPM/Turborepo caching; laporan test dan a11y sebagai artefak.
- Guard branch proteksi untuk produksi.

## Dokumentasi
- Update `README.md` untuk jalur run/dev/build/test `apps/app`.
- Dokumentasi arsitektur singkat: mapping komponen UI ↔ halaman ↔ agentic runtime.
- Contoh penggunaan AuthLayout dan DashboardLayout di `apps/app`.

## Kriteria Penerimaan
- Build TypeScript bersih (tanpa error), lint OK.
- Tes unit/integrasi lulus; e2e penting lulus (auth, navigasi, tema, pencarian).
- A11y: `jest-axe` tanpa pelanggaran pada halaman utama dan auth.
- Header–Sidebar v2 berjalan responsif, keyboard-friendly; AuthLayout konsisten.

## Verifikasi (Setelah Implementasi)
- Jalankan dev, build, test, dan e2e, lalu rekap hasil.
- Review manual a11y (keyboard/focus), dan smoke test di dev server.

Konfirmasi rencana ini untuk mulai eksekusi penuh dan validasi end-to-end di `apps/app`. 