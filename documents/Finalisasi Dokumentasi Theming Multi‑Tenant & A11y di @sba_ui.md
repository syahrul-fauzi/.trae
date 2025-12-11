## Titik Terakhir & Gap
- Bab theming multi‑tenant sudah ditambahkan di `packages/ui/docs/components.md` (ThemeProvider, CSS variables, helper API, contoh copy‑paste, best practices, edge cases).
- A11y: lint masih berpotensi menandai `anchor-valid` di beberapa stories; perlu strategi final (relaksasi lint khusus stories/tests atau perbaikan anchor menjadi button/href valid).
- Konsistensi: verifikasi contoh di dokumen cocok dengan API ekspor nyata (`packages/ui/src/index.ts:27–35`, `packages/ui/package.json:83–87`).

## Rencana Penyelesaian
1) **Perapihan Dokumen Theming**
- Review bahasa/struktur agar konsisten dan mudah dipahami; selaraskan terminologi tenant/theme.
- Tambah sub-bab "Visual Examples" yang merujuk ke Storybook (perbandingan tenant: default/enterprise/startup).
- Validasi contoh kode copy‑paste terhadap API:
  - `ThemeProvider` (`packages/ui/src/theme/ThemeProvider.tsx`)
  - `useTheme` (`packages/ui/src/theme/useTheme.ts`)
  - `getThemeClass` (`packages/ui/src/theme/getThemeClass.ts`)
  - `getCSSVariable` (`packages/ui/src/theme/getCSSVariable.ts`)

2) **Strategi A11y**
- Opsi A (Relaksasi lint): tambahkan override untuk `**/*.stories.@(ts|tsx)` dan `**/*.spec.@(ts|tsx)`
  - Contoh konfigurasi di dokumen (non‑blocking produksi).
- Opsi B (Perbaikan stories):
  - Ganti anchor tanpa `href` menjadi `button` dengan `aria-label` dan fokus states, atau beri `href` valid.
  - Pastikan komponen interaktif memiliki keyboard listener bila perlu.
- Tambahkan penjelasan trade‑off (kecepatan demo vs kualitas produksi) dan rekomendasi default: perbaiki di stories utama, relaksasi sebagai fallback lokal.

3) **Konsistensi & Edge Cases**
- Pastikan semua contoh CSS variables memakai namespace `data-tenant` yang sama.
- Tambah catatan SSR/hydration: set `initialTheme` agar tidak mismatch.
- Tambah catatan fallback: bila tenant id tidak tersedia → tema default.

## Deliverables
- Dokumen final di `packages/ui/docs/components.md` dengan:
  - Bab Theming Multi‑Tenant (lengkap + contoh siap pakai, best practices, edge cases).
  - Sub-bab A11y (opsi relaksasi lint vs perbaikan, contoh yang bisa di‑copy).
  - Referensi visual ke Storybook untuk demonstrasi per-tenant.

## Pemeriksaan Konsistensi
- Contoh import sesuai ekspor (`index.ts` dan subpath `./theme`).
- Penamaan dan atribut a11y konsisten (aria‑label/role/skip link jika relevan).
- Tidak ada kebocoran jalur internal; hanya barrel resmi.

## Update Berkala
- Setelah tiap bagian selesai: kirim ringkasan singkat berisi apa yang ditambahkan/diubah, referensi lokasi file, dan dampak.
- Penutupan: daftar deliverables final, poin verifikasi, dan rekomendasi lanjutan (mis. menambah kisah Storybook per tenant).

## Timeline Singkat
- Langkah 1 (Perapihan dokumen + visual refs): segera.
- Langkah 2 (A11y strategi dan contoh): segera setelah langkah 1.
- Langkah 3 (Konsistensi/Edge cases): final review dan penutupan.
